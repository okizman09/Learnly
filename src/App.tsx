import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import DashboardPage from './pages/DashboardPage';
import { Loader2 } from 'lucide-react';

type Page = 'courses' | 'dashboard' | 'course-details';

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-details');
  };

  const handleBackToCourses = () => {
    setCurrentPage('courses');
    setSelectedCourseId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onToggleMode={() => setAuthMode('signup')} />
    ) : (
      <SignUp onToggleMode={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {currentPage !== 'course-details' && (
        <Header
          currentPage={currentPage === 'courses' ? 'courses' : 'dashboard'}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}

      {currentPage === 'courses' && <CoursesPage onViewCourse={handleViewCourse} />}
      {currentPage === 'dashboard' && <DashboardPage onViewCourse={handleViewCourse} />}
      {currentPage === 'course-details' && selectedCourseId && (
        <CourseDetailsPage courseId={selectedCourseId} onBack={handleBackToCourses} />
      )}

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
