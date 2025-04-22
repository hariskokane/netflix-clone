import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-netflix-black py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-netflix-light-gray text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Company</li>
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Contact Us</li>
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Careers</li>
            </ul>
          </div>
          
          <div className="mb-6 md:mb-0">
            <h3 className="text-netflix-light-gray text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Account & Billing</li>
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Plans & Pricing</li>
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Supported Devices</li>
            </ul>
          </div>
          
          <div className="mb-6 md:mb-0">
            <h3 className="text-netflix-light-gray text-lg font-semibold mb-4">Terms</h3>
            <ul className="space-y-2">
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Privacy</li>
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Terms of Use</li>
              <li className="text-netflix-gray hover:text-white transition cursor-pointer">Cookie Preferences</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-netflix-light-gray text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-netflix-gray hover:text-white transition">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-netflix-gray hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-netflix-gray hover:text-white transition">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center text-netflix-gray text-sm">
          <p>© 2025 Netflix Clone. This is a project for educational purposes only.</p>
          <p className="mt-2">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;