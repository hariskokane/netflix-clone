import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <AlertCircle className="h-16 w-16 text-netflix-red mb-6" />
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-netflix-light-gray mb-8 max-w-xl">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-netflix-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;