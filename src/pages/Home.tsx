import { useState, useEffect } from 'react';
import { Movie, tmdbAPI } from '../services/api';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/common/MovieRow';
import LoadingScreen from '../components/common/LoadingScreen';

const Home = () => {
  const [trendingNow, setTrendingNow] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        
        // Fetch different categories in parallel
        const [trending, popular, topRated, tvPopular] = await Promise.all([
          tmdbAPI.getTrending('all', 'week'),
          tmdbAPI.getMoviesByCategory('popular'),
          tmdbAPI.getMoviesByCategory('top_rated'),
          tmdbAPI.getTVByCategory('popular')
        ]);
        
        setTrendingNow(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setTvShows(tvPopular);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="pb-10">
      <HeroSection movies={trendingNow.slice(0, 5)} />
      
      <div className="mt-12">
        <MovieRow 
          title="Trending Now" 
          movies={trendingNow}
          variant="large"
        />
        <MovieRow 
          title="Popular Movies" 
          movies={popularMovies}
          variant="poster"
        />
        <MovieRow 
          title="Top Rated" 
          movies={topRatedMovies}
          variant="large"
        />
        <MovieRow 
          title="Popular TV Shows" 
          movies={tvShows}
          variant="poster"
        />
      </div>
    </div>
  );
};

export default Home;