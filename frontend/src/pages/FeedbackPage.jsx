import React, { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { MessageSquare, Bug, Lightbulb, Send } from 'lucide-react';

const FeedbackPage = () => {
    const [formData, setFormData] = useState({
        type: 'thought',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setLoading(true);
        try {
            await api.post('/feedback', formData);
            toast.success('Thank you for your feedback!');
            setFormData({ type: 'thought', message: '' });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const options = [
        { id: 'thought', label: 'Share Thoughts', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
        { id: 'bug', label: 'Report Bug', icon: Bug, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' },
        { id: 'feature', label: 'Suggest Feature', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
                            We Value Your Feedback
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Help us improve Paisable. Whether it's a bug, a feature request, or just some thoughts, we'd love to hear from you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => setFormData({ ...formData, type: option.id })}
                                    className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${formData.type === option.id
                                            ? `${option.border} ${option.bg} ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800`
                                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex flex-col items-center space-y-3">
                                        <option.icon className={`w-8 h-8 ${option.color}`} />
                                        <span className={`font-semibold ${formData.type === option.id ? 'text-gray-900 dark:text-gray-900' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {option.label}
                                        </span>
                                    </div>
                                    {formData.type === option.id && (
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none shadow-sm"
                                placeholder="Tell us what's on your mind..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Submit Feedback</span>
                                        <Send size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
