import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ExternalLink, Calendar, Tag, MessageCircle } from 'lucide-react';
import Like from '../Components/Like';

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

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
                setLoading(false);
                return;
            } else {
                setProfile(data);
                // Fetch projects for this user
                const { data: userProjects, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', data.id);
                if (!projectsError) {
                    setProjects(userProjects);
                } else {
                    setProjects([]);
                }
                // Check if logged-in user is the owner
                const { data: { user: loggedInUser } } = await supabase.auth.getUser();
                if (loggedInUser && loggedInUser.id === data.id) {
                    setIsOwner(true);
                    // Fetch comments on own projects
                    if (userProjects && userProjects.length > 0) {
                        const projectIds = userProjects.map(p => p.id);
                        const { data: userComments, error: commentsError } = await supabase
                            .from('comments')
                            .select('*, projects(name, slug)')
                            .in('project_id', projectIds)
                            .eq('user_id', data.id);
                        if (!commentsError) {
                            setComments(userComments);
                        } else {
                            setComments([]);
                        }
                    } else {
                        setComments([]);
                    }
                } else {
                    setIsOwner(false);
                }
                setLoading(false);
            }
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
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow border border-gray-200">
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
                        {isOwner && (
                            <p className="text-gray-500 text-sm">{profile.email || 'No email provided'}</p>
                        )}
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

                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Projects Launched</h2>
                    {projects.length === 0 ? (
                        <p className="text-gray-500">No projects launched yet.</p>
                    ) : (
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-1 border-gray-300"
                                        onClick={() => window.location.href = `/launches/${project.slug}`}
                                    >
                                        <div className="p-4">
                                            <div className='flex items-center justify-between'>
                                                <div className="flex items-center gap-2 mb-2 w-auto ">
                                                    <h2 className="text-2xl font-semibold text-gray-900 w-auto">{project.name}</h2>
                                                    <a
                                                        href={project.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                                <Like projectId={project.id} />
                                            </div>
                                            {project.media_urls && project.media_urls.length > 0 && (
                                                <img
                                                    src={project.media_urls[0]}
                                                    alt='Image of Launch'
                                                    className='w-full object-cover p-1'
                                                />
                                            )}
                                            <p className="text-md text-gray-600 mb-4 line-clamp-2">{project.tagline}</p>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm ">
                                                    <Tag className="w-4 h-4 mr-2 text-black" />
                                                    <span className="capitalize">{project.category_type}</span>
                                                </div>
                                                <div className="flex items-center text-sm ">
                                                    <Calendar className="w-4 h-4 mr-2 text-black" />
                                                    <span className='text-gray-600'>{new Date(project.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {isOwner && (
                    <div className="mt-10">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-blue-500" /> Your Comments on Your Projects
                        </h2>
                        {comments.length === 0 ? (
                            <p className="text-gray-500">You haven't commented on your own projects yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {comments.map(comment => (
                                    <li key={comment.id} className="bg-gray-50 p-4 rounded-lg border">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                            <div>
                                                <p className="text-gray-800 text-sm mb-1">{comment.content}</p>
                                                <p className="text-xs text-gray-500">On project: <span className="font-medium">{comment.projects?.name || 'Unknown'}</span></p>
                                            </div>
                                            {comment.projects?.slug && (
                                                <button
                                                    className="text-blue-600 hover:underline text-xs font-medium"
                                                    onClick={() => navigate(`/launches/${comment.projects.slug}`)}
                                                >
                                                    View Project
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
