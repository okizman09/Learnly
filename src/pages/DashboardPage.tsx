import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Award, BookOpen, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';

interface CompletedCourse {
  id: string;
  completed_at: string;
  courses: {
    id: string;
    title: string;
    thumbnail_url: string;
    duration: string;
  };
}

interface DashboardPageProps {
  onViewCourse: (courseId: string) => void;
}

export default function DashboardPage({ onViewCourse }: DashboardPageProps) {
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    const [progressResult, coursesResult] = await Promise.all([
      supabase
        .from('user_progress')
        .select(`
          id,
          completed_at,
          courses:course_id (
            id,
            title,
            thumbnail_url,
            duration
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false }),
      supabase.from('courses').select('id', { count: 'exact', head: true }),
    ]);

    if (progressResult.error) {
      console.error('Error fetching progress:', progressResult.error);
    } else {
      setCompletedCourses(progressResult.data as any || []);
    }

    if (coursesResult.error) {
      console.error('Error fetching courses count:', coursesResult.error);
    } else {
      setTotalCourses(coursesResult.count || 0);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const completionPercentage = totalCourses > 0
    ? Math.round((completedCourses.length / totalCourses) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your learning progress and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Total Courses</p>
            <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Progress</p>
            <p className="text-3xl font-bold text-gray-900">{completionPercentage}%</p>
          </div>
        </div>

        {completionPercentage === 100 && totalCourses > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 mb-12 text-center">
            <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-700 text-lg">
              You've completed all available courses. Keep up the great work!
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle className="w-7 h-7 text-green-600" />
            Completed Courses
          </h2>

          {completedCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No courses completed yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start exploring courses and track your progress here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((progress) => (
                <div
                  key={progress.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onViewCourse(progress.courses.id)}
                >
                  <div className="relative h-40">
                    <img
                      src={progress.courses.thumbnail_url}
                      alt={progress.courses.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 p-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {progress.courses.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Completed on {new Date(progress.completed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
