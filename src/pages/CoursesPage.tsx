import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';
import { BookOpen, Loader2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  short_description: string;
  duration: string;
  thumbnail_url: string;
}

interface CoursesPageProps {
  onViewCourse: (courseId: string) => void;
}

export default function CoursesPage({ onViewCourse }: CoursesPageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedCourseIds, setCompletedCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, short_description, duration, thumbnail_url')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('course_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user progress:', error);
    } else {
      const completedIds = new Set(data?.map(p => p.course_id) || []);
      setCompletedCourseIds(completedIds);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2.5 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Available Courses
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Explore our curated collection of courses and start learning today
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No courses available yet
            </h2>
            <p className="text-gray-500">
              Check back soon for new learning opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                shortDescription={course.short_description}
                duration={course.duration}
                thumbnailUrl={course.thumbnail_url}
                isCompleted={completedCourseIds.has(course.id)}
                onViewDetails={onViewCourse}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
