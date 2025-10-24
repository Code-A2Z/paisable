import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
    //get the token
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword,setNewPassword]=useState('');

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            await axios.post('/api/auth/reset-password',{token,newPassword});
            alert('Password reset successful. You can now log in with your new password.');
        }catch(error){
            alert(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    }    

    return (
        <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 rounded-md bg-white dark:bg-gray-800 shadow-lg">
                <h2 className="flex justify-center text-2xl text-white">Reset Password</h2>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-500 dark:text-gray-300 mb-2" htmlFor="newPassword">New Password</label>
                        <input type="password" id="newPassword" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600" required onChange={(e)=>{
                            setNewPassword(e.target.value);
                        }}/>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

