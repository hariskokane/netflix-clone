import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../services/api';
import MovieCard from './MovieCard';

type MovieRowProps = {
  title: string;
  movies: Movie[];
  onListUpdate?: (movie: Movie, added: boolean) => void;
  variant?: 'default' | 'large' | 'poster';
};

const MovieRow = ({ title, movies, onListUpdate, variant = 'default' }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth - 100; // Adjust scroll amount to show part of next item
      
      const newScrollPosition = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
      
      // Update arrow visibility after scroll
      setTimeout(() => {
        if (rowRef.current) {
          setShowLeftArrow(rowRef.current.scrollLeft > 0);
          setShowRightArrow(
            rowRef.current.scrollLeft + rowRef.current.clientWidth < rowRef.current.scrollWidth - 10
          );
        }
      }, 500);
    }
  };
  
  // Handle scroll event to update arrow visibility
  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(
        rowRef.current.scrollLeft + rowRef.current.clientWidth < rowRef.current.scrollWidth - 10
      );
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 px-4 md:px-12">{title}</h2>
      
      <div className="relative group px-4 md:px-12">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-20 h-12 w-12 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"

          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hidden"
          onScroll={handleScroll}
        >
          {movies.map(movie => (
            <div key={movie.id} className="flex-none">
              <MovieCard 
                movie={movie} 
                onListUpdate={onListUpdate}
                variant={variant}
              />
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-20 h-12 w-12 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;