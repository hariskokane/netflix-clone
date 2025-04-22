import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info } from 'lucide-react';
import { Movie, tmdbAPI, myListAPI } from '../../services/api';
import { motion } from 'framer-motion';

type MovieCardProps = {
  movie: Movie;
  isInMyList?: boolean;
  onListUpdate?: (movie: Movie, added: boolean) => void;
  variant?: 'default' | 'large' | 'poster';
};

const MovieCard = ({ 
  movie, 
  isInMyList: propIsInMyList, 
  onListUpdate,
  variant = 'default'
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInMyList, setIsInMyList] = useState(propIsInMyList || myListAPI.isInMyList(movie.id));
  const navigate = useNavigate();
  
  const handleAddToMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInMyList) {
      myListAPI.removeFromMyList(movie.id);
      setIsInMyList(false);
      onListUpdate?.(movie, false);
    } else {
      myListAPI.addToMyList(movie);
      setIsInMyList(true);
      onListUpdate?.(movie, true);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const title = movie.title || movie.name || 'Untitled';
  const posterUrl = tmdbAPI.getImageUrl(movie.poster_path, 'w500');
  const backdropUrl = tmdbAPI.getImageUrl(movie.backdrop_path, 'w780');
  
  const getCardSize = () => {
    switch(variant) {
      case 'large':
        return 'w-[300px] sm:w-[400px] h-[169px] sm:h-[225px]';
      case 'poster':
        return 'w-[200px] sm:w-[240px] h-[300px] sm:h-[360px]';
      default:
        return 'w-[240px] sm:w-[320px] h-[135px] sm:h-[180px]';
    }
  };
  
  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`netflix-card ${getCardSize()} ${variant === 'poster' ? 'rounded-md' : 'rounded'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      variants={cardVariants}
      whileHover="hover"
    >
      <img
        src={variant === 'poster' ? posterUrl : (backdropUrl || posterUrl)}
        alt={title}
        className="w-full h-full object-cover rounded-md"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/500x281/141414/FFFFFF?text=No+Image';
        }}
      />

      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 p-4 flex flex-col justify-between rounded-md">
          <div className="text-lg font-semibold line-clamp-2">{title}</div>
          
          <div className="flex items-center gap-3 justify-center mt-2">
            <button 
              className="p-3 bg-white text-black rounded-full hover:bg-opacity-80 transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie.id}`);
              }}
            >
              <Play className="h-6 w-6" />
            </button>
            
            <button 
              className="p-3 border-2 border-white rounded-full hover:bg-white hover:bg-opacity-30 transition"
              onClick={handleAddToMyList}
            >
              {isInMyList ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </button>
            
            <button 
              className="p-3 border-2 border-white rounded-full hover:bg-white hover:bg-opacity-30 transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie.id}`);
              }}
            >
              <Info className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;