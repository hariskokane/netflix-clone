import { Film } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-netflix-black z-50">
      <div className="flex flex-col items-center">
        <Film className="h-16 w-16 text-netflix-red animate-pulse" />
        <div className="mt-4 text-xl text-netflix-light-gray">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;