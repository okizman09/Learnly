/*
  # Learnly E-Learning Platform Database Schema

  This migration creates the complete database structure for the Learnly platform,
  including courses, user progress tracking, and authentication setup.

  ## New Tables

  ### 1. `courses`
  Stores all course information including title, description, learning objectives, 
  duration, instructor details, and thumbnail images.
  - `id` (uuid, primary key) - Unique course identifier
  - `title` (text) - Course title
  - `short_description` (text) - Brief course overview for listing cards
  - `full_description` (text) - Complete detailed course description
  - `learning_objectives` (text[]) - Array of learning goals
  - `duration` (text) - Estimated time to complete (e.g., "4 hours", "2 weeks")
  - `instructor_name` (text) - Name of the course instructor
  - `instructor_bio` (text) - Instructor background and credentials
  - `thumbnail_url` (text) - URL to course thumbnail image
  - `created_at` (timestamptz) - When the course was created
  - `updated_at` (timestamptz) - Last modification timestamp

  ### 2. `user_progress`
  Tracks which courses users have completed and when.
  - `id` (uuid, primary key) - Unique progress record identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `course_id` (uuid, foreign key) - Reference to courses table
  - `completed_at` (timestamptz) - When the user completed the course
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled to protect user data.

  ### RLS Policies

  #### courses table:
  - Anyone (including unauthenticated users) can view all courses
  
  #### user_progress table:
  - Authenticated users can view only their own progress records
  - Authenticated users can insert their own completion records
  - Authenticated users can only create records for themselves (WITH CHECK)
  - Users cannot update or delete completion records (data integrity)

  ## Important Notes

  1. The courses table is publicly readable to allow browsing before signup
  2. User progress is strictly private - users can only see their own data
  3. Completion records are immutable once created (no updates/deletes)
  4. Uses built-in auth.users table from Supabase Auth
  5. Foreign key constraints ensure data integrity
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  learning_objectives text[] NOT NULL DEFAULT '{}',
  duration text NOT NULL,
  instructor_name text NOT NULL,
  instructor_bio text NOT NULL,
  thumbnail_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses table
-- Anyone can view courses (public access for browsing)
CREATE POLICY "Anyone can view courses"
  ON courses
  FOR SELECT
  USING (true);

-- RLS Policies for user_progress table
-- Users can view only their own progress
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own progress records
CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
