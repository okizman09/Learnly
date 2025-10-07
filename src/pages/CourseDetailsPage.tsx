import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Clock, User, Target, CheckCircle, Loader2 } from 'lucide-react';

interface CourseDetailsPageProps {
  courseId: string;
  onBack: () => void;
}

interface Course {
  id: string;
  title: string;
  full_description: string;
  learning_objectives: string[];
  duration: string;
  instructor_name: string;
  instructor_bio: string;
  thumbnail_url: string;
}

export default function CourseDetailsPage({ courseId, onBack }: CourseDetailsPageProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourseDetails();
    if (user) {
      checkCompletion();
    }
  }, [courseId, user]);

  const fetchCourseDetails = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching course:', error);
    } else {
      setCourse(data);
    }
    setLoading(false);
  };

  const checkCompletion = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (!error && data) {
      setIsCompleted(true);
    }
  };

  const handleMarkComplete = async () => {
    if (!user || isCompleted) return;

    setMarkingComplete(true);

    const { error } = await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        course_id: courseId,
      });

    if (error) {
      console.error('Error marking course complete:', error);
      alert('Failed to mark course as complete. Please try again.');
    } else {
      setIsCompleted(true);
    }

    setMarkingComplete(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Courses</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-80">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {isCompleted && (
              <div className="absolute top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>

          <div className="p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {course.title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{course.instructor_name}</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {course.full_description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Learning Objectives
                </h2>
              </div>
              <ul className="space-y-3">
                {course.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-10 bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {course.instructor_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Instructor: {course.instructor_name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {course.instructor_bio}
                  </p>
                </div>
              </div>
            </div>

            {user && !isCompleted && (
              <button
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingComplete ? 'Marking as Complete...' : 'Mark as Completed'}
              </button>
            )}

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-900 font-medium">
                  Sign in to track your progress and mark courses as completed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
