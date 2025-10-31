import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CurrencySelector from "./CurrencySelector";
import ThemeToggle from "./ThemeToggle";

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses =
      "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200";
    if (isActive) {
      return `${baseClasses} bg-blue-600 text-white shadow-sm`;
    }
    return `${baseClasses} text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-white`;
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      {/* ======= NAVBAR ======= */}
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center space-x-8">
              <span
                onClick={handleLogoClick}
                className="font-bold text-xl text-blue-600 dark:text-blue-400 cursor-pointer transition-all duration-300 hover:scale-105 hover:text-blue-500 dark:hover:text-blue-300"
                title="Go to Home"
              >
                Paisable
              </span>

              <div className="hidden md:flex space-x-4">
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/transactions" className={getNavLinkClass}>
                  Transactions
                </NavLink>
                <NavLink to="/budgets" className={getNavLinkClass}>
                  Budgets
                </NavLink>
                <NavLink to="/recurring-transactions" className={getNavLinkClass}>
                  Recurring
                </NavLink>
                <NavLink to="/receipts" className={getNavLinkClass}>
                  Receipts
                </NavLink>
                <NavLink to="/settings" className={getNavLinkClass}>
                  Settings
                </NavLink>
              </div>
            </div>

            {/* Right: Utilities */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <CurrencySelector />
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ======= MAIN CONTENT ======= */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* ======= FOOTER ======= */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center md:text-left text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Paisable
            </span>
            . All rights reserved.
          </p>
          <div className="flex space-x-4">
            <NavLink
              to="/privacy"
              className="hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms"
              className="hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Terms of Use
            </NavLink>
            <NavLink
              to="/contact"
              className="hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Contact
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
