// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { HiMail, HiArrowLeft } from 'react-icons/hi';

// // export default function ForgotPasswordPage() {
// //   const [email, setEmail] = useState('');
// //   const [message, setMessage] = useState('');
// //   const [error, setError] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setError('');
// //     setMessage('');
// //     setIsLoading(true);

// //     try {
// //       // Replace this with your actual backend/API call
// //       const response = await fetch('/api/auth/forgot-password', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ email }),
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Unable to send reset email');
// //       }

// //       setMessage(
// //         'If an account exists with this email, a password reset link has been sent.'
// //       );
// //     } catch (error) {
// //       setError(error.message);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">

// //       {/* Logo */}
// //       <Link
// //         to="/"
// //         className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-12"
// //       >
// //         Paisable
// //       </Link>

// //       {/* Card */}
// //       <div className="px-8 py-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">

// //         {/* Header */}
// //         <div className="text-center mb-8">
// //           <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
// //             Forgot Password?
// //           </h3>

// //           <p className="text-gray-600 dark:text-gray-400 text-sm">
// //             Enter your email address and we'll send you a link to reset your password.
// //           </p>
// //         </div>

// //         {/* Success Message */}
// //         {message && (
// //           <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
// //             <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">
// //               {message}
// //             </p>
// //           </div>
// //         )}

// //         {/* Error Message */}
// //         {error && (
// //           <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
// //             <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
// //               {error}
// //             </p>
// //           </div>
// //         )}

// //         {/* Form */}
// //         <form onSubmit={handleSubmit} className="space-y-6">

// //           {/* Email */}
// //           <div>
// //             <label
// //               htmlFor="email"
// //               className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
// //             >
// //               Email Address
// //             </label>

// //             <div className="relative">
// //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <HiMail className="h-5 w-5 text-gray-400" />
// //               </div>

// //               <input
// //                 id="email"
// //                 type="email"
// //                 placeholder="you@example.com"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 required
// //                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //           </div>

// //           {/* Submit */}
// //           <button
// //             type="submit"
// //             disabled={isLoading}
// //             className="w-full px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             {isLoading ? 'Sending...' : 'Send Reset Link'}
// //           </button>

// //           {/* Back to Login */}
// //           <div className="text-center pt-2">
// //             <Link
// //               to="/login"
// //               className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
// //             >
// //               <HiArrowLeft className="h-4 w-4" />
// //               Back to Sign In
// //             </Link>
// //           </div>

// //         </form>
// //       </div>

// //       {/* Footer */}
// //       <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
// //         Protected by industry-standard security
// //       </p>
// //     </div>
// //   );
// // }


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { HiMail, HiArrowLeft } from 'react-icons/hi';
// import { useAuth } from '../hooks/useAuth';

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const { forgotPassword } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError('');
//     setMessage('');

//     if (!email.trim()) {
//       setError('Please enter your email address.');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await forgotPassword(email.trim());

//       setMessage(
//         'If an account exists with this email, a password reset link has been sent.'
//       );
//     } catch (error) {
//       setError(
//         error.message ||
//           'Unable to send password reset link. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
//       <div className="w-full max-w-md">

//         {/* Logo / Brand */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-blue-600">
//             Paisable
//           </h1>

//           <p className="mt-2 text-gray-600 dark:text-gray-400">
//             Reset your password
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Forgot Password?
//             </h2>

//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               Enter your email address and we'll send you a link to reset
//               your password.
//             </p>
//           </div>

//           {/* Success Message */}
//           {message && (
//             <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
//               {message}
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>

//             {/* Email */}
//             <div className="mb-5">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
//               >
//                 Email Address
//               </label>

//               <div className="relative">
//                 <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   disabled={isLoading}
//                   className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Send Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
//             >
//               {isLoading ? (
//                 <>
//                   <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   Send Reset Link
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Back to Login */}
//           <div className="mt-6 text-center">
//             <Link
//               to="/login"
//               className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
//             >
//               <HiArrowLeft />
//               Back to Sign In
//             </Link>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email.trim());

      setMessage(
        'If an account exists with this email, a password reset link has been sent.'
      );
    } catch (error) {
      setError(
        error.message ||
          'Unable to send password reset link. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Paisable
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Reset your password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset
              your password.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <HiArrowLeft />
              Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}