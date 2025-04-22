import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // For demo purposes, we'll provide a quick login option
  const handleQuickLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      await login('demo@example.com', 'password');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-black" style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/4da5d2b1-1b22-498d-90c7-1d289e0e6677/428b6e81-6db6-4d31-bc02-9eafb8a10c73/US-en-20240826-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}>
      <div className="bg-black bg-opacity-70 min-h-screen">
        <header className="px-6 py-4">
          <Link to="/" className="flex items-center">
            <Film className="h-10 w-10 text-netflix-red" />
            <span className="ml-2 text-2xl font-bold text-netflix-red tracking-wider">NETFLIXCLONE</span>
          </Link>
        </header>
        
        <main className="flex justify-center items-center px-4 py-10">
          <div className="bg-black bg-opacity-80 p-8 rounded max-w-md w-full">
            <h1 className="text-3xl font-bold mb-6">Sign In</h1>
            
            {error && (
              <div className="bg-error-dark bg-opacity-30 flex items-center p-3 rounded mb-4 text-error">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-3 rounded bg-netflix-dark border border-netflix-gray text-white"
                />
              </div>
              
              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 rounded bg-netflix-dark border border-netflix-gray text-white"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-netflix-red hover:bg-red-700 text-white font-semibold py-3 rounded transition duration-300 disabled:opacity-70"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-4">
              <button
                onClick={handleQuickLogin}
                disabled={isLoading}
                className="w-full bg-netflix-dark hover:bg-netflix-gray text-white font-semibold py-3 rounded transition duration-300 disabled:opacity-70 border border-netflix-gray"
              >
                Quick Demo Login
              </button>
            </div>
            
            <div className="mt-6">
              <p className="text-netflix-light-gray">
                New to Netflix Clone?{' '}
                <Link to="/signup" className="text-white hover:underline">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;