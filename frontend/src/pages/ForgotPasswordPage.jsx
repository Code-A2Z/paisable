import axios from "axios";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');
        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            setSuccessMessage(response.data.message);
        } catch (error) {
            setServerError(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 rounded-md bg-white dark:bg-gray-800 shadow-lg">
                <h2 className="flex justify-center text-2xl text-white">Forgot Password</h2>
                {serverError && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900 p-2 rounded-md my-4">{serverError}</p>}
                {successMessage && <p className="text-center text-green-500 bg-green-500 dark:bg-green-900 p-2 rounded-md my-4">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-500 dark:text-gray-300 mb-2" htmlFor="email" >Email address</label>
                        <input type="email" id="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600" required onChange={(e) => {
                            setEmail(e.target.value);
                        }} />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Send Reset Link</button>
                    </div>
                </form>
            </div>
        </div>
    )
}