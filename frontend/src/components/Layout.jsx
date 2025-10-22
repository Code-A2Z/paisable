import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CurrencySelector from './CurrencySelector';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = 'px-3 py-2 rounded-md text-sm font-medium';
    if (isActive) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white`;
  };

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* 2. Wrap the span in a Link to the dashboard */}
               <span
      onClick={handleClick}
      className="font-bold text-xl text-blue-600 dark:text-blue-400 cursor-pointer transition-all duration-500 hover:scale-105 hover:drop-shadow-lg hover:text-blue-500 dark:hover:text-blue-300"
      title="Go to home"
    >
      Paisable
    </span>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" className={getNavLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/transactions" className={getNavLinkClass}>
                    Transactions
                  </NavLink>
                  <NavLink to="/receipts" className={getNavLinkClass}>
                    Receipts
                  </NavLink>
                  <NavLink to="/settings" className={getNavLinkClass}>
                    Settings
                  </NavLink>
                  <NavLink to="/budgets" className={getNavLinkClass}>
                    Budgets
                  </NavLink>
                  <NavLink
                    to="/recurring-transactions"
                    className={getNavLinkClass}
                  >
                    Recurring Transactions
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CurrencySelector />
              <div className="hidden md:flex items-center gap-4">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-700 dark:text-gray-200 focus:outline-none"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {menuOpen && (
          <>
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            ></div>

            <div className="fixed top-0 right-0  w-1/2 h-full bg-white dark:bg-gray-800 z-50 shadow-2xl rounded-l-2xl p-6 flex flex-col gap-6 transition-transform duration-300">
              

              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                <X size={22} />
              </button>

              <div className="flex flex-col gap-4 mt-10">
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={getNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/transactions" onClick={() => setMenuOpen(false)} className={getNavLinkClass}>
                  Transactions
                </NavLink>
                <NavLink to="/receipts" onClick={() => setMenuOpen(false)} className={getNavLinkClass}>
                  Receipts
                </NavLink>
                <NavLink to="/settings" onClick={() => setMenuOpen(false)} className={getNavLinkClass}>
                  Settings
                </NavLink>
                <NavLink to="/budgets" onClick={() => setMenuOpen(false)} className={getNavLinkClass}>
                  Budgets
                </NavLink>
                <NavLink to="/recurring-transactions" onClick={() => setMenuOpen(false)} className={getNavLinkClass}>
                  Recurring Transactions
                </NavLink>
              </div>

              <div className="mt-auto flex flex-col items-center gap-4">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="w-24 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
