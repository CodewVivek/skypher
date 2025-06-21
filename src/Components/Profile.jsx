import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit3, Camera, Globe, Linkedin, Twitter, Youtube, ExternalLink, Save } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your profile information and social links</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 relative">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img
                                    src={user.user_metadata?.avatar_url || user.user_metadata?.picture || "https://via.placeholder.com/120"}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                                />
                                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <div className="text-white">
                                <h2 className="text-2xl font-bold">
                                    {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                                </h2>
                                <p className="text-blue-100">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8 space-y-8">
                        {/* Basic Information */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                                        <p className="text-sm text-gray-500">Your personal details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg  font-light transition-colors"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profile in Settings
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={user.user_metadata?.full_name || user.user_metadata?.name || ''}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter your full name"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                    readOnly
                                />
                            </div>
                        </section>

                        {/* Social Links */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
                                    <p className="text-sm text-gray-500">Connect your social media profiles</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: Twitter, label: 'Twitter', placeholder: 'https://twitter.com/username' },
                                    { icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                                    { icon: Youtube, label: 'YouTube', placeholder: 'https://youtube.com/@username' },
                                    { icon: ExternalLink, label: 'Portfolio', placeholder: 'https://yourportfolio.com' }
                                ].map((social) => (
                                    <div key={social.label}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{social.label}</label>
                                        <div className="relative">
                                            <social.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="url"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder={social.placeholder}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
