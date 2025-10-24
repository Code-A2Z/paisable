import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-montserrat">
            <header className="py-4 px-8 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md">
                <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">Paisable</Link>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex items-center justify-center px-4 py-20">
                <div className="max-w-3xl w-full text-center">
                    <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-pink-100 via-sky-100 to-purple-100 mx-auto mb-8">
                        <svg className="w-16 h-16 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5M14.25 9.75l-4.5 4.5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Page not found</h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Oops — the page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                            Go to Homepage
                        </Link>
                        <Link to="/contact" className="inline-block text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:underline">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
