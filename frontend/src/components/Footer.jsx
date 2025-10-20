import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <span className="flex items-center">
              <img src="/favicon-96x96.png" className="h-8 mr-3" alt="Paisable Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Paisable
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm text-gray-600 dark:text-gray-400">
              Your personal finance companion for smarter money management.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Quick Links
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <button onClick={() => scrollToSection('dashboard')} className="hover:underline">
                    Dashboard
                  </button>
                </li>
                <li className="mb-4">
                  <button onClick={() => scrollToSection('budgets')} className="hover:underline">
                    Budgets
                  </button>
                </li>
                <li className="mb-4">
                  <button onClick={() => scrollToSection('transactions')} className="hover:underline">
                    Transactions
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link to="/about" className="hover:underline">About</Link>
                </li>
                <li className="mb-4">
                  <Link to="/contact" className="hover:underline">Contact</Link>
                </li>
                <li className="mb-4">
                  <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Connect
              </h2>
              <div className="flex space-x-4">
                <a href="https://github.com/yourusername/paisable" 
                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <FaGithub className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/paisable" 
                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/company/paisable" 
                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        
        
      </div>
    </footer>
  );
};

export default Footer;