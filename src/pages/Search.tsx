import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie, tmdbAPI } from '../services/api';
import MovieCard from '../components/common/MovieCard';
import LoadingScreen from '../components/common/LoadingScreen';
import { Search as SearchIcon } from 'lucide-react';

let debounceTimeout: ReturnType<typeof setTimeout>;

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const category = queryParams.get('category');

  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Fetch results based on search term or category
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        if (searchTerm) {
          const searchResults = await tmdbAPI.searchMulti(searchTerm);
          setResults(searchResults);
        } else if (category) {
          if (category === 'movies') {
            const [popular, topRated, upcoming] = await Promise.all([
              tmdbAPI.getMoviesByCategory('popular'),
              tmdbAPI.getMoviesByCategory('top_rated'),
              tmdbAPI.getMoviesByCategory('upcoming')
            ]);
            const combined = [...popular, ...topRated, ...upcoming];
            const uniqueResults = Array.from(new Map(combined.map(item => [item.id, item])).values());
            setResults(uniqueResults);
          } else if (category === 'tv') {
            const [popular, topRated] = await Promise.all([
              tmdbAPI.getTVByCategory('popular'),
              tmdbAPI.getTVByCategory('top_rated')
            ]);
            const combined = [...popular, ...topRated];
            const uniqueResults = Array.from(new Map(combined.map(item => [item.id, item])).values());
            setResults(uniqueResults);
          }
        } else {
          const trending = await tmdbAPI.getTrending('all', 'week');
          setResults(trending);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm, category]);

  // Auto-update search term in URL with debounce
  useEffect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (localSearchTerm) {
        navigate(`/search?q=${encodeURIComponent(localSearchTerm)}`);
      } else if (!category) {
        navigate('/search');
      }
    }, 500); // debounce delay
    return () => clearTimeout(debounceTimeout);
  }, [localSearchTerm]);

  const getTitle = () => {
    if (searchTerm) {
      return `Results for: "${searchTerm}"`;
    } else if (category === 'movies') {
      return 'Browse Movies';
    } else if (category === 'tv') {
      return 'Browse TV Shows';
    } else {
      return 'Browse All';
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search for movies, TV shows, people..."
              className="w-full py-3 px-4 pl-12 bg-netflix-dark border border-netflix-gray rounded-md text-white"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-gray h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{getTitle()}</h1>
        <div className="flex space-x-4 mb-6">
          <a
            href="/search"
            className={`px-4 py-2 rounded-full ${!category && !searchTerm ? 'bg-netflix-red' : 'bg-netflix-dark hover:bg-netflix-gray'} transition`}
          >
            All
          </a>
          <a
            href="/search?category=movies"
            className={`px-4 py-2 rounded-full ${category === 'movies' ? 'bg-netflix-red' : 'bg-netflix-dark hover:bg-netflix-gray'} transition`}
          >
            Movies
          </a>
          <a
            href="/search?category=tv"
            className={`px-4 py-2 rounded-full ${category === 'tv' ? 'bg-netflix-red' : 'bg-netflix-dark hover:bg-netflix-gray'} transition`}
          >
            TV Shows
          </a>
        </div>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {results.map((movie) => (
            <div key={movie.id} className="h-auto">
              <MovieCard movie={movie} variant="poster" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-netflix-light-gray">No results found</p>
          <p className="mt-2">Try adjusting your search or browse our categories</p>
        </div>
      )}
    </div>
  );
};

export default Search;
