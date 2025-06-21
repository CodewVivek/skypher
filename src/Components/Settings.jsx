import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertTriangle, X } from 'lucide-react';

const Settings = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // Delete user data from your database tables
            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .eq('id', (await supabase.auth.getUser()).data.user.id);

            if (deleteError) throw deleteError;

            toast.success('Account deleted successfully');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account');
        }
    };

    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    if (!user) {
        return <div className="text-center mt-12">Loading profile...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-16 px-6 md:px-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-10">Account Settings</h1>

            {/* SECTION: Personal Info */}
            <section className="bg-white p-8 shadow rounded-2xl space-y-6 border border-gray-200">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    <p className="text-sm text-gray-500">Update your name and email associated with your account.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={user.user_metadata?.full_name || user.user_metadata?.name || 'no name'}
                            placeholder="Your Name"
                            className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-600 focus:border-blue-600"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={user.email}
                            placeholder="you@gmail.com"
                            className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-600 focus:border-blue-600"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>

            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
                    <p className="text-sm text-gray-500">Share how people can connect with you.</p>
                </div>

                <div className="space-y-4">
                    {['Twitter', 'LinkedIn', 'Portfolio'].map((label) => (
                        <div key={label}>
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <input
                                type="url"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`https://${label.toLowerCase()}.com/yourprofile`}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Save Button */}
            <div className="pt-4">
                <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition">
                    Save Changes
                </button>
            </div>

            <section className="bg-white p-8 shadow rounded-2xl space-y-6 border border-gray-200 mt-12">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
                    <p className="text-sm text-gray-500">Control your experience on the platform.</p>
                </div>

                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Receive Email Notifications</span>
                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600" />
                    </div>
                </div>
            </section>


            {/* SECTION: Danger Zone */}
            <section className="bg-white p-8 shadow rounded-2xl space-y-4 border border-red-200 mt-12">
                <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
                <p className="text-sm text-gray-500">Deleting your account is permanent and cannot be undone.</p>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                    Delete My Account
                </button>
            </section>

            {/* Delete Account Modal */}
            {
                showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                                </div>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Settings;
