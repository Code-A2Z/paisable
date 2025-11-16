import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ThemeToggle from '../components/ThemeToggle';

const ChartIcon = () => <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

const ReceiptIcon = () => <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

const CategoryIcon = () => <svg className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5z" /></svg>;

const FeatureCard = ({ icon, title, children }) => {
  return (
    <Link  to="/login">
    
    <div className="relative group cursor-pointer ">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-l bg-gradient-to-r from-sky-400/40 via-purple-400/40 to-pink-400/40 transition-opacity duration-500" />

      {/* Actual Card */}
      <div className="relative p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-sky-100 dark:bg-sky-900 mb-6 transition-colors duration-300 group-hover:bg-sky-200 dark:group-hover:bg-sky-800">
          <span className="text-sky-600 dark:text-sky-400 text-3xl">
            {icon}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
          {title}
        </h4>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
    </Link>
  );
};

export default function WelcomePage() {
  const { user } = useAuth();
  const { logout } = useAuth();

  return (
    <div className="bg-background">
     
      <nav className="border-b border-border ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Paisable</div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
             {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:bg-background/80 transition font-semibold">Dashboard</Link>
              <button onClick={logout} className="bg-secondary text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-[#155e75] dark:hover:text-gray-700 font-semibold">Login</Link>
              <Link to="/register" className="bg-secondary text-white px-4 py-2 rounded-md font-semibold hover:bg-[#155e75] dark:hover:bg-gray-700">Sign Up</Link>
            </>
          )}
            
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-secondary rounded-full">
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-primary text-balance leading-tight">
                Take Control of Your Finances
              </h1>
              <p className="text-lg text-foreground leading-relaxed max-w-lg">
                The simple, smart, and secure way to manage your income and expenses, visualize your spending, and achieve your financial goals.
              </p>
            </div>
            
           

            
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-full min-h-96 bg-gradient-to-br from-secondary to-slate-100 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-" />
            <div className="absolute top-8 left-8 right-8 space-y-4">
              <div className="bg-secondary rounded-xl p-6 shadow-lg space-y-3">
                <p className="text-sm text-foreground">Total Balance</p>
                <p className="text-3xl font-bold text-primary">$24,582.50</p>
                <div className="flex gap-2 pt-2">
                  <div className="h-1 flex-1 bg-accent rounded-full" />
                  <div className="h-1 flex-1 bg-secondary rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-lg p-4 shadow-lg">
                  <p className="text-xs text-foreground mb-1">Income</p>
                  <p className="text-xl font-bold text-primary">+$5,200</p>
                </div>
                <div className="bg-secondary rounded-lg p-4 shadow-lg">
                  <p className="text-xs text-muted-foreground mb-1">Expenses</p>
                  <p className="text-xl font-bold text-primary">-$1,840</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Features Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <h3 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-16">
            All The Tools You Need
          </h3>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<ChartIcon />} title="Visualize Your Spending">
              See where your money goes with intuitive charts and graphs. 
              Understand your habits and make smarter financial decisions.
            </FeatureCard>

            <FeatureCard icon={<ReceiptIcon />} title="Effortless Receipt Scanning">
              Simply upload a photo of your receipt, and let our smart OCR technology 
              extract the details for you.
            </FeatureCard>

            <FeatureCard icon={<CategoryIcon />} title="Smart Categorization">
              Organize your transactions with customizable categories 
              to track spending across different areas of your life.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 bg-secondary">
        <p>&copy; {new Date().getFullYear()} Paisable. All Rights Reserved.</p>
      </footer>
    </div>
  );
}