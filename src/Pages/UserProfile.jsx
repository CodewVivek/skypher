import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                setProfile(null);
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (error) {
                console.error('Error fetching profile:', error.message);
                setProfile(null);
            } else {
                setProfile(data);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">User profile not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 px-6 md:px-12">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow border border-gray-200">
                <div className="flex items-center gap-6 mb-8">
                    <img
                        src={profile.avatar_url || '/default-avatar.png'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border object-cover shadow"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {profile.full_name || profile.username || 'Unnamed User'}
                        </h1>
                        <p className="text-gray-500 text-sm">{profile.email || 'No email provided'}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Bio</h2>
                        <p className="text-gray-700">{profile.bio || 'This user has not written a bio yet.'}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Social Links</h2>
                        <div className="space-y-2 text-blue-600">
                            {profile.twitter && (
                                <a href={profile.twitter} target="_blank" rel="noreferrer" className="block hover:underline">
                                    Twitter
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:underline">
                                    LinkedIn
                                </a>
                            )}
                            {profile.youtube && (
                                <a href={profile.youtube} target="_blank" rel="noreferrer" className="block hover:underline">
                                    YouTube
                                </a>
                            )}
                            {profile.portfolio && (
                                <a href={profile.portfolio} target="_blank" rel="noreferrer" className="block hover:underline">
                                    Portfolio
                                </a>
                            )}
                            {!profile.twitter && !profile.linkedin && !profile.youtube && !profile.portfolio && (
                                <p className="text-gray-500">No social links provided.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
