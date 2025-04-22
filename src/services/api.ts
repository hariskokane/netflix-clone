import axios from 'axios';

// Use TMDB API for movie data
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // This is a public API key for TMDB
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type Movie = {
  id: number;
  title: string;
  name?: string; // For TV shows
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string; // For TV shows
  vote_average: number;
  media_type?: string;
  genre_ids: number[];
};

export type MovieDetail = Movie & {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number; // For TV shows
  tagline?: string;
  status: string;
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
  similar: {
    results: Movie[];
  };
};

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const tmdbAPI = {
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    const response = await api.get<{ results: Movie[] }>(`/trending/${mediaType}/${timeWindow}`);
    return response.data.results;
  },
  
  getMoviesByCategory: async (category: string, page: number = 1) => {
    const response = await api.get<{ results: Movie[] }>(`/movie/${category}`, {
      params: { page },
    });
    return response.data.results;
  },
  
  getTVByCategory: async (category: string, page: number = 1) => {
    const response = await api.get<{ results: Movie[] }>(`/tv/${category}`, {
      params: { page },
    });
    return response.data.results;
  },
  
  getMovieDetails: async (id: number) => {
    const response = await api.get<MovieDetail>(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
    return response.data;
  },
  
  getTVDetails: async (id: number) => {
    const response = await api.get<MovieDetail>(`/tv/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
    return response.data;
  },
  
  searchMulti: async (query: string, page: number = 1) => {
    const response = await api.get<{ results: Movie[] }>('/search/multi', {
      params: { query, page },
    });
    return response.data.results;
  },
  
  getImageUrl: (path: string | null, size: 'original' | 'w500' | 'w780' | 'w1280' = 'original') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },
};

// My List functionality using localStorage
const MY_LIST_KEY = 'netflix_my_list';

export const myListAPI = {
  getMyList: (): Movie[] => {
    const list = localStorage.getItem(MY_LIST_KEY);
    return list ? JSON.parse(list) : [];
  },
  
  addToMyList: (movie: Movie): Movie[] => {
    const currentList = myListAPI.getMyList();
    const isAlreadyAdded = currentList.some(item => item.id === movie.id);
    
    if (!isAlreadyAdded) {
      const updatedList = [...currentList, movie];
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(updatedList));
      return updatedList;
    }
    
    return currentList;
  },
  
  removeFromMyList: (movieId: number): Movie[] => {
    const currentList = myListAPI.getMyList();
    const updatedList = currentList.filter(movie => movie.id !== movieId);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(updatedList));
    return updatedList;
  },
  
  isInMyList: (movieId: number): boolean => {
    const currentList = myListAPI.getMyList();
    return currentList.some(movie => movie.id === movieId);
  },
};