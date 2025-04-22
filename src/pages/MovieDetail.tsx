import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star, Clock, Calendar, Users } from 'lucide-react';
import { MovieDetail as MovieDetailType, tmdbAPI, myListAPI } from '../services/api';
import LoadingScreen from '../components/common/LoadingScreen';
import MovieRow from '../components/common/MovieRow';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [isInMyList, setIsInMyList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError('');
        
        const movieId = parseInt(id);
        
        // First try as a movie, if fails, try as a TV show
        try {
          const movieData = await tmdbAPI.getMovieDetails(movieId);
          setMovie(movieData);
          setIsInMyList(myListAPI.isInMyList(movieId));
        } catch (movieError) {
          try {
            const tvData = await tmdbAPI.getTVDetails(movieId);
            setMovie(tvData);
            setIsInMyList(myListAPI.isInMyList(movieId));
          } catch (tvError) {
            setError('Movie or TV show not found');
          }
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);
  
  const handleAddToMyList = () => {
    if (!movie) return;
    
    if (isInMyList) {
      myListAPI.removeFromMyList(movie.id);
      setIsInMyList(false);
    } else {
      myListAPI.addToMyList(movie);
      setIsInMyList(true);
    }
  };
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl text-netflix-light-gray">{error || 'Movie not found'}</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-netflix-red text-white px-6 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  const backdropUrl = tmdbAPI.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdbAPI.getImageUrl(movie.poster_path, 'w500');
  
  const title = movie.title || movie.name || 'Untitled';
  const releaseYear = (movie.release_date || movie.first_air_date || '').substring(0, 4);
  const genres = movie.genres.map(genre => genre.name).join(', ');
  
  // Get trailer if available
  const trailer = movie.videos.results.find(
    video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );

  return (
    <div className="pb-10">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={backdropUrl || 'https://via.placeholder.com/1920x1080/141414/FFFFFF?text=No+Image'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-5xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
            
            {movie.tagline && (
              <p className="text-xl text-netflix-light-gray italic mb-4">{movie.tagline}</p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                className="flex items-center justify-center bg-white text-black px-6 py-2 rounded-md hover:bg-opacity-90 transition"
                onClick={() => {
                  if (trailer) {
                    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                  }
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                {trailer ? 'Play Trailer' : 'Play'}
              </button>
              
              <button
                onClick={handleAddToMyList}
                className="flex items-center justify-center bg-netflix-gray bg-opacity-60 text-white px-6 py-2 rounded-md hover:bg-opacity-40 transition"
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
      
      {/* Details Section */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Poster */}
          <div className="lg:w-1/4">
            <img
              src={posterUrl || 'https://via.placeholder.com/500x750/141414/FFFFFF?text=No+Image'}
              alt={title}
              className="w-full rounded-md shadow-lg"
            />
          </div>
          
          {/* Right Column - Details */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center bg-netflix-dark px-3 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{movie.vote_average.toFixed(1)}/10</span>
                </div>
                
                {releaseYear && (
                  <div className="flex items-center bg-netflix-dark px-3 py-1 rounded">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{releaseYear}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center bg-netflix-dark px-3 py-1 rounded">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
                
                {movie.number_of_seasons && (
                  <div className="flex items-center bg-netflix-dark px-3 py-1 rounded">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{movie.number_of_seasons} Season{movie.number_of_seasons !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <span className="text-netflix-light-gray">Genres: </span>
                <span>{genres}</span>
              </div>
              
              <p className="text-lg mb-6">{movie.overview}</p>
            </div>
            
            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.credits.cast.slice(0, 5).map(person => (
                    <div key={person.id} className="text-center">
                      <div className="w-full aspect-square rounded-full overflow-hidden mb-2">
                        <img
                          src={person.profile_path ? tmdbAPI.getImageUrl(person.profile_path, 'w500') : 'https://via.placeholder.com/150x150/141414/FFFFFF?text=No+Image'}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-netflix-light-gray">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Similar Titles */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <div className="mt-8">
          <MovieRow 
            title="More Like This" 
            movies={movie.similar.results}
            variant="poster"
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;