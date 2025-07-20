import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ExternalLink, Calendar, Tag, MessageCircle } from 'lucide-react';
import Like from '../Components/Like';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, TextField } from '@mui/material';

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();
    const [editProject, setEditProject] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editWarning, setEditWarning] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [deleteProject, setDeleteProject] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [editError, setEditError] = useState('');

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
                // Check if logged-in user is the owner
                const { data: { user: loggedInUser } } = await supabase.auth.getUser();
                let userProjects = [];
                // Set isOwner based on whether logged-in user matches profile owner
                const isProfileOwner = loggedInUser && loggedInUser.id === data.id;
                setIsOwner(isProfileOwner);

                if (loggedInUser && loggedInUser.id === data.id) {
                    // Owner: fetch all projects (including drafts)
                    const { data: allProjects } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('user_id', data.id);
                    userProjects = allProjects || [];
                } else {
                    // Not owner: only show submitted projects
                    const { data: nonDraftProjects } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('user_id', data.id)
                        .neq('status', 'draft');
                    userProjects = nonDraftProjects || [];
                }
                setProjects(userProjects);
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
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    // Edit handlers
    const handleEditClick = (project) => {
        setEditProject(project);
        setEditForm({ ...project });
    };
    const handleEditClose = () => {
        setEditProject(null);
        setEditWarning(false);
        setEditError('');
    };
    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };
    const handleEditSave = async () => {
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    ...editForm,
                    edit_count: (editProject.edit_count || 0) + 1,
                })
                .eq('id', editProject.id);
            if (error) throw error;
            setEditSuccess(true);
            setEditProject(null);
            setEditWarning(false);

            const { data: userProjects } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', profile.id);
            setProjects(userProjects);
        } catch (err) {
            setEditError(err.message || 'Failed to update project.');
        }
    };

    // Delete handlers
    const handleDeleteClick = (project) => setDeleteProject(project);
    const handleDeleteCancel = () => setDeleteProject(null);
    const handleDeleteConfirm = async () => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', deleteProject.id);
            if (error) throw error;
            setDeleteSuccess(true);
            setDeleteProject(null);
            // Refetch projects
            const { data: userProjects } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', profile.id);
            setProjects(userProjects);
        } catch (err) {
            setEditError(err.message || 'Failed to delete project.');
        }
    };

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

    // Helper function to get time ago
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInMinutes < 1) return 'less than 1m';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths}mo`;

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears}y`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Custom Sidebar */}
            <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 p-8 flex-col gap-8 hidden md:flex z-10">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-blue-900">My Launches</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center justify-between"><span>🌟 All</span><span className="font-semibold">{projects.length}</span></li>
                        <li className="flex items-center justify-between"><span>📝 Drafts</span><span className="font-semibold">{projects.filter(p => p.status === 'draft').length}</span></li>
                        <li className="flex items-center justify-between"><span>🚀 Launched</span><span className="font-semibold">{projects.filter(p => p.status !== 'draft').length}</span></li>
                    </ul>
                </div>
                <div className="mt-8">
                    <h3 className="font-semibold mb-2 text-blue-900">Help & Resources</h3>
                    <ul className="space-y-2 text-blue-700">
                        <li><a href="#" className="hover:underline">Launch Guide</a></li>
                        <li><a href="#" className="hover:underline">FAQ</a></li>
                        <li><a href="#" className="hover:underline">Support</a></li>
                    </ul>
                </div>
            </aside>
            {/* Main Content */}
            <main className="w-full md:ml-64 flex-1 max-w-5xl mx-auto p-4 md:p-12 h-screen overflow-y-auto mt-4 md:mt-8 mb-4 md:mb-8">
                {/* Profile Info */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-10">
                    <img
                        src={profile.avatar_url || '/default-avatar.png'}
                        alt="Profile"
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full border object-cover shadow"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{profile.full_name || profile.username || 'Unnamed User'}</h1>
                        <p className="text-gray-500 text-sm mb-1 md:mb-2">{profile.email || 'No email provided'}</p>
                        <p className="text-gray-700 mb-1 md:mb-2">{profile.bio || 'This user has not written a bio yet.'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-blue-600 text-sm">
                            {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:underline">Twitter</a>}
                            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
                            {profile.youtube && <a href={profile.youtube} target="_blank" rel="noreferrer" className="hover:underline">YouTube</a>}
                            {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>}
                        </div>
                    </div>
                </div>
                {/* Drafts Section */}
                {isOwner && projects.filter(p => p.status === 'draft').length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">In Progress</h3>
                        <div className="space-y-4">
                            {projects.filter(p => p.status === 'draft').map((project) => (
                                <div key={project.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        {project.logo_url ? (
                                            <img src={project.logo_url} alt="Logo" className="w-12 h-12 object-contain rounded-full border bg-white" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border">
                                                <span>{project.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                                            <p className="text-xs text-gray-500">Created on {new Date(project.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })} ✍️</p>
                                            <p className="text-xs text-gray-400">Last edited {getTimeAgo(project.updated_at || project.created_at)} ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => navigate(`/submit?draft=${project.id}`)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50">Continue editing</button>
                                        <button onClick={() => handleDeleteClick(project)} className="p-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200">
                                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Launched Section */}
                <div className="mb-10">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Launched</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.filter(p => p.status !== 'draft').map((project) => (
                            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-1 border-gray-300">
                                <div className="p-4">
                                    <div className='flex items-center gap-2 mb-2 w-auto'>
                                        {project.logo_url ? (
                                            <img src={project.logo_url} alt="Logo" className="w-10 h-10 object-contain rounded-full border bg-white" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold border">
                                                <span>{project.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                        )}
                                        <h2 className="text-2xl font-semibold text-gray-900 w-auto">{project.name}</h2>
                                        <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors" onClick={e => e.stopPropagation()}>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    {project.media_urls && project.media_urls.length > 0 && (
                                        <img src={project.media_urls[0]} alt='Image of Launch' className='w-full object-cover p-1' />
                                    )}
                                    <p className="text-md text-gray-600 mb-4 line-clamp-2">{project.tagline}</p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm">
                                            <Tag className="w-4 h-4 mr-2 text-black" />
                                            <span className="capitalize">{project.category_type}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-black" />
                                            <span className='text-gray-600'>{new Date(project.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    {isOwner && (
                                        <div className="flex gap-2 mt-2">
                                            <Button variant="outlined" color="primary" size="small" onClick={e => { e.stopPropagation(); navigate(`/submit?edit=${project.id}`); }}>Edit</Button>
                                            <Button variant="outlined" color="error" size="small" onClick={e => { e.stopPropagation(); handleDeleteClick(project); }}>Delete</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
