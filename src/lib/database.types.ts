export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          title: string
          short_description: string
          full_description: string
          learning_objectives: string[]
          duration: string
          instructor_name: string
          instructor_bio: string
          thumbnail_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          short_description: string
          full_description: string
          learning_objectives?: string[]
          duration: string
          instructor_name: string
          instructor_bio: string
          thumbnail_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          short_description?: string
          full_description?: string
          learning_objectives?: string[]
          duration?: string
          instructor_name?: string
          instructor_bio?: string
          thumbnail_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          completed_at?: string
          created_at?: string
        }
      }
    }
  }
}
