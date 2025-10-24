import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetupPage from './pages/SetupPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ReceiptsPage from './pages/ReceiptsPage';
import WelcomePage from './pages/WelcomePage';
import SettingsPage from './pages/SettingsPage';
import Budgets from './pages/Budgets';
import ContactUs from './pages/ContactUs';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SetupProtectedRoute from './components/SetupProtectedRoute';
import RecurringTransactions from './pages/RecurringTransactions';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Protected Routes */}
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <SetupPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes Wrapper */}
        <Route
          element={
            <SetupProtectedRoute>
              <Layout />
            </SetupProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route
            path="/recurring-transactions"
            element={<RecurringTransactions />}
          />
        </Route>
      </Routes>

      {/* Beautiful Footer Section */}
           {/* Beautiful Footer Section */}
      <footer className="bg-gray-900 text-gray-300 mt-0">
        <div className="max-w-7xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-24">
       
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Paisable</h2>
            <p className="text-base text-gray-400">
              Smart finance management made simple-track, budget, and plan your
              expenses effortlessly.
            </p>
          </div>

  
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 ">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-indigo-400">Dashboard</Link></li>
              <li><Link to="/transactions" className="hover:text-indigo-400">Transactions</Link></li>
              <li><Link to="/budgets" className="hover:text-indigo-400">Budgets</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400">Contact Us</Link></li>
            </ul>
          </div>

 
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400">
                <FaGithub size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400">
                <FaTwitter size={22} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400">
                <FaLinkedin size={22} />
              </a>                                             
            </div>
          </div>
        </div>

      
        <div className="text-center py-4 text-lg text-gray-500 bg-gray-900">
          © {new Date().getFullYear()} Paisable. All rights reserved.
        </div>
      </footer>


      <ToastContainer />
    </>
  );
}

export default App;
