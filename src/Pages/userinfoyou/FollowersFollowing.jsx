import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { ArrowLeft, UserPlus, UserCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FollowersFollowing = () => {
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('following');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please login to view your followers/following");
                navigate("/UserRegister");
                return;
            }
            setUser(user);
            fetchFollowingData(user.id);
        };

        checkAuth();
    }, [navigate]);

    const fetchFollowingData = async (userId) => {
        try {
            setLoading(true);

            // Fetch users that current user is following
            const { data: followingData, error: followingError } = await supabase
                .from('follows')
                .select(`
                    following_id,
                    profiles!follows_following_id_fkey (
                        id,
                        username,
                        full_name,
                        avatar_url,
                        bio
                    )
                `)
                .eq('follower_id', userId);

            if (followingError) {
                console.error('Error fetching following:', followingError);
                toast.error('Failed to load following data');
            } else {
                setFollowing(followingData || []);
            }

            // Fetch users who are following current user
            const { data: followersData, error: followersError } = await supabase
                .from('follows')
                .select(`
                    follower_id,
                    profiles!follows_follower_id_fkey (
                        id,
                        username,
                        full_name,
                        avatar_url,
                        bio
                    )
                `)
                .eq('following_id', userId);

            if (followersError) {
                console.error('Error fetching followers:', followersError);
                toast.error('Failed to load followers data');
            } else {
                setFollowers(followersData || []);
            }

        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while loading data');
            toast.error('An error occurred while loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async (followingId, userName) => {
        try {
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', user.id)
                .eq('following_id', followingId);

            if (error) {
                console.error('Error unfollowing:', error);
                toast.error('Failed to unfollow');
            } else {
                setFollowing(prev => prev.filter(item => item.following_id !== followingId));
                toast.success(`Unfollowed ${userName}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while unfollowing');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                        <p className="text-gray-600">Loading your connections...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Followers & Following</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your connections
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'following'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Following ({following.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('followers')}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'followers'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Followers ({followers.length})
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'following' ? (
                    <div className="space-y-4">
                        {following.length === 0 ? (
                            <div className="text-center py-16">
                                <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Not following anyone yet</h2>
                                <p className="text-gray-600 mb-6">
                                    Start following creators to see their latest launches here.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Explore Projects
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {following.map((item) => (
                                    <div
                                        key={item.following_id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.profiles.avatar_url || '/default-avatar.png'}
                                                alt={item.profiles.full_name || item.profiles.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                                loading="lazy"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {item.profiles.full_name || 'Anonymous'}
                                                </h3>
                                                <p className="text-sm text-gray-500">@{item.profiles.username}</p>
                                                {item.profiles.bio && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {item.profiles.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleUnfollow(item.following_id, item.profiles.full_name || item.profiles.username)}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            <UserCheck className="w-4 h-4 inline mr-2" />
                                            Following
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {followers.length === 0 ? (
                            <div className="text-center py-16">
                                <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No followers yet</h2>
                                <p className="text-gray-600 mb-6">
                                    When people follow you, they'll appear here.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Explore Projects
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {followers.map((item) => (
                                    <div
                                        key={item.follower_id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.profiles.avatar_url || '/default-avatar.png'}
                                                alt={item.profiles.full_name || item.profiles.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                                loading="lazy"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {item.profiles.full_name || 'Anonymous'}
                                                </h3>
                                                <p className="text-sm text-gray-500">@{item.profiles.username}</p>
                                                {item.profiles.bio && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {item.profiles.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/profile/${item.profiles.username}`)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowersFollowing; 