import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Plus, Check } from 'lucide-react';
import { Movie, tmdbAPI, myListAPI } from '../services/api';

type HeroSectionProps = {
  movies: Movie[];
};

const HeroSection = ({ movies }: HeroSectionProps) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isInMyList, setIsInMyList] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (movies && movies.length > 0) {
      // Select a random movie with a backdrop
      const moviesWithBackdrop = movies.filter(m => m.backdrop_path);
      if (moviesWithBackdrop.length > 0) {
        const randomIndex = Math.floor(Math.random() * moviesWithBackdrop.length);
        const selected = moviesWithBackdrop[randomIndex];
        setFeaturedMovie(selected);
        setIsInMyList(myListAPI.isInMyList(selected.id));
      }
    }
  }, [movies]);
  
  if (!featuredMovie) return null;
  
  const backdropUrl = tmdbAPI.getImageUrl(featuredMovie.backdrop_path, 'original');
  const title = featuredMovie.title || featuredMovie.name || 'Untitled';
  
  const handleAddToMyList = () => {
    if (isInMyList) {
      myListAPI.removeFromMyList(featuredMovie.id);
      setIsInMyList(false);
    } else {
      myListAPI.addToMyList(featuredMovie);
      setIsInMyList(true);
    }
  };

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl || 'https://via.placeholder.com/1920x1080/141414/FFFFFF?text=No+Image'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-green-500 font-semibold">
              {Math.round(featuredMovie.vote_average * 10)}% Match
            </span>
            <span className="text-netflix-light-gray">
              {featuredMovie.release_date?.substring(0, 4) || featuredMovie.first_air_date?.substring(0, 4)}
            </span>
          </div>
          
          <p className="text-netflix-light-gray text-lg mb-6 line-clamp-3 md:line-clamp-none">
            {featuredMovie.overview}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/movie/${featuredMovie.id}`)}
              className="flex items-center justify-center bg-white text-black px-6 py-2 rounded-md hover:bg-opacity-90 transition"
            >
              <Play className="w-5 h-5 mr-2" />
              Play
            </button>
            
            <button
              onClick={() => navigate(`/movie/${featuredMovie.id}`)}
              className="flex items-center justify-center bg-netflix-gray bg-opacity-60 text-white px-6 py-2 rounded-md hover:bg-opacity-40 transition"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </button>
            
            <button
              onClick={handleAddToMyList}
              className="flex items-center justify-center bg-netflix-gray bg-opacity-60 text-white px-4 py-2 rounded-md hover:bg-opacity-40 transition"
            >
              {isInMyList ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  In My List
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  My List
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;