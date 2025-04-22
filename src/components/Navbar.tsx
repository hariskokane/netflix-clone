import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Bell, User, ChevronDown, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowSearch(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-netflix-black to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Film className="h-8 w-8 text-netflix-red" />
            <span className="ml-2 text-xl font-bold text-netflix-red tracking-wider hidden sm:inline">NETFLIXCLONE</span>
          </Link>
          
          <div className="ml-8 hidden md:flex space-x-6">
            <Link to="/" className="text-white hover:text-netflix-light-gray transition">Home</Link>
            <Link to="/search?category=movies" className="text-white hover:text-netflix-light-gray transition">Movies</Link>
            <Link to="/search?category=tv" className="text-white hover:text-netflix-light-gray transition">TV Shows</Link>
            <Link to="/mylist" className="text-white hover:text-netflix-light-gray transition">My List</Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="absolute right-0 top-0 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="bg-netflix-black border border-white py-1 px-3 text-white rounded w-48 md:w-64"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="ml-2 text-white"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="text-white hover:text-netflix-light-gray transition"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="hidden sm:block">
            <Bell className="h-5 w-5 text-white" />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 text-white"
            >
              <User className="h-5 w-5" />
              <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-netflix-black border border-netflix-gray rounded shadow-lg py-2">
                <div className="px-4 py-2 text-netflix-light-gray text-sm">{user?.name || user?.email}</div>
                <div className="border-t border-netflix-gray"></div>
                <Link to="/mylist" className="flex px-4 py-2 text-white hover:bg-netflix-dark">
                  <List className="h-5 w-5 mr-2" />
                  My List
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-white hover:bg-netflix-dark"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;