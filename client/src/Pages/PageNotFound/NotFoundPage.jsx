import { AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center transform transition-all animate-fadeIn border border-gray-100">
        <div className="relative mb-10">
          {/* Animated circles in background */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-50 rounded-full opacity-75 animate-blob mix-blend-multiply" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-50 rounded-full opacity-75 animate-blob animation-delay-2000 mix-blend-multiply" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-50 rounded-full opacity-75 animate-blob animation-delay-4000 mix-blend-multiply" />
          
          {/* Sorry text with icon */}
          <div className="relative">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-indigo-500 animate-bounce" />
            <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse">
              Sorry !
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Page Not Found
          </h2>
          
          <div className="space-y-3">
            <p className="text-lg md:text-xl text-gray-600">
              Oops! The page you're looking for doesn't exist.
            </p>
            
            <p className="text-base text-gray-500">
              It seems like the QR code or link you tried to access is no longer available.
            </p>
          </div>
        </div>

        {/* Decorative bottom pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-b-3xl" />
      </div>
    </div>
  );
};

export default NotFoundPage;