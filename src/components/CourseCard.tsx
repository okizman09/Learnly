import { CheckCircle, Clock, BookOpen } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  shortDescription: string;
  duration: string;
  thumbnailUrl: string;
  isCompleted: boolean;
  onViewDetails: (courseId: string) => void;
}

export default function CourseCard({
  id,
  title,
  shortDescription,
  duration,
  thumbnailUrl,
  isCompleted,
  onViewDetails,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {shortDescription}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Course</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(id)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
