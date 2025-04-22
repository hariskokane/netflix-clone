import { useState, useEffect } from 'react';
import { Movie, myListAPI } from '../services/api';
import MovieCard from '../components/common/MovieCard';
import { ListX } from 'lucide-react';

const MyList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  
  useEffect(() => {
    // Get the user's list from localStorage
    const userList = myListAPI.getMyList();
    setMovies(userList);
  }, []);
  
  const handleListUpdate = (movie: Movie, added: boolean) => {
    if (!added) {
      setMovies(movies.filter(m => m.id !== movie.id));
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-6">My List</h1>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map(movie => (
            <div key={movie.id}>
              <MovieCard 
                movie={movie} 
                variant="poster" 
                isInMyList={true}
                onListUpdate={handleListUpdate}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <ListX className="h-16 w-16 text-netflix-light-gray mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your list is empty</h2>
          <p className="text-netflix-light-gray text-center max-w-md">
            Add movies and TV shows to your list to keep track of what you want to watch.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyList;