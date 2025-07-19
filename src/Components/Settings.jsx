import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, AlertCircle, CheckCircle } from 'lucide-react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Settings = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [bio, setBio] = useState('');
    const [twitter, setTwitter] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const fileInputRef = useRef(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleDeleteAccount = async () => {
        try {
            if (!profile) return;
            // Delete all user-related data
            // 1. Delete comments
            await supabase.from('comments').delete().eq('user_id', profile.id);
            // 2. Delete likes
            await supabase.from('project_likes').delete().eq('user_id', profile.id);
            // 3. Delete projects (and optionally, related comments/likes for those projects)
            const { data: userProjects } = await supabase.from('projects').select('id').eq('user_id', profile.id);
            if (userProjects && userProjects.length > 0) {
                const projectIds = userProjects.map(p => p.id);
                // Delete comments on user's projects
                await supabase.from('comments').delete().in('project_id', projectIds);
                // Delete likes on user's projects
                await supabase.from('project_likes').delete().in('project_id', projectIds);
                // Delete the projects
                await supabase.from('projects').delete().in('id', projectIds);
            }
            // 4. Delete profile
            await supabase.from('profiles').delete().eq('id', profile.id);
            // 5. Delete user from Supabase Auth
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
            setSnackbar({ open: true, message: 'Account and all data deleted successfully', severity: 'success' });
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            setSnackbar({ open: true, message: 'Failed to delete account', severity: 'error' });
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);
            setBio(profileData?.bio || '');
            setTwitter(profileData?.twitter || '');
            setLinkedin(profileData?.linkedin || '');
            setPortfolio(profileData?.portfolio || '');
            setAvatarUrl(profileData?.avatar_url || '');
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        const { error } = await supabase
            .from('profiles')
            .update({
                bio,
                twitter,
                linkedin,
                portfolio
            })
            .eq('id', profile.id);
        setSaving(false);
        if (error) {
            setSnackbar({ open: true, message: 'Failed to save changes', severity: 'error' });
        } else {
            setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !profile) return;
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${profile.id}.${fileExt}`;
        // Upload to Supabase Storage
        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        if (uploadError) {
            setSnackbar({ open: true, message: 'Failed to upload avatar', severity: 'error' });
            return;
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;
        // Update profile
        const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
        if (updateError) {
            setSnackbar({ open: true, message: 'Failed to update avatar', severity: 'error' });
        } else {
            setAvatarUrl(publicUrl);
            setSnackbar({ open: true, message: 'Profile picture updated!', severity: 'success' });
        }
    };

    if (!profile) {
        return <div className="text-center mt-12">Loading profile...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-16 px-6 md:px-12">
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
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
                            value={profile?.full_name || profile?.name || 'no name'}
                            placeholder="Your Name"
                            className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-600 focus:border-blue-600"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={profile?.email || ''}
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
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <img
                        src={avatarUrl || '/default-avatar.png'}
                        alt="Profile Avatar"
                        className="w-24 h-24 rounded-full object-cover border shadow mb-2"
                    />
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        type="button"
                    >
                        Change Profile Picture
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                    />
                </div>

            </section>

            <section className="space-y-6 mt-10">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
                    <p className="text-sm text-gray-500">Share how people can connect with you.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Twitter</label>
                        <input
                            type="url"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://twitter.com/yourprofile"
                            value={twitter}
                            onChange={e => setTwitter(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                        <input
                            type="url"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={linkedin}
                            onChange={e => setLinkedin(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Portfolio</label>
                            <input
                                type="url"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://yourportfolio.com"
                            value={portfolio}
                            onChange={e => setPortfolio(e.target.value)}
                            />
                        </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="pt-4">
                <button
                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* SECTION: Connected Accounts */}
            <div className="bg-white p-8 shadow rounded-2xl space-y-6 border border-gray-200 mt-12">
                <h2 className="text-xl font-semibold text-gray-800">Connected Accounts</h2>
                <div className="flex items-center gap-3">
                    <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
                    <span className="text-gray-700 font-medium">Google Connected</span>
                    </div>
                </div>

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
