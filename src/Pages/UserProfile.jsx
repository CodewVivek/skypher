import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ExternalLink, Calendar, Tag, MessageCircle, Rss, Star, Edit3, Trash2, HelpCircle, Menu, X, Briefcase, Link as LinkIcon, Twitter, Linkedin, Youtube } from 'lucide-react';
import Like from '../Components/Like';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, TextField } from '@mui/material';

const UserProfileSidebar = ({ projects, comments, activeTab, setActiveTab, projectFilter, setProjectFilter, isOpen, onClose }) => {
    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            <aside className={`fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 p-6 flex-col gap-8 z-30 transform transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:flex md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 md:hidden">
                    <X className="w-6 h-6" />
                </button>
                <div className="mt-8 md:mt-0">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">My Activity</h2>
                    <ul className="space-y-3 text-gray-600 font-medium">
                        <li onClick={() => setActiveTab('projects')} className={`flex items-center justify-between text-sm hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg ${activeTab === 'projects' ? 'bg-blue-50 text-blue-600' : ''}`}>
                            <span className="flex items-center gap-3"><Briefcase className="w-5 h-5" />Projects</span>
                        </li>
                        <li onClick={() => setActiveTab('comments')} className={`flex items-center justify-between text-sm hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg ${activeTab === 'comments' ? 'bg-blue-50 text-blue-600' : ''}`}>
                            <span className="flex items-center gap-3"><MessageCircle className="w-5 h-5" />Comments</span>
                            <span className={`font-semibold px-2.5 py-0.5 rounded-full ${activeTab === 'comments' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>{comments.length}</span>
                        </li>
                    </ul>
                </div>
                {activeTab === 'projects' && (
                    <div className="mt-8">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">My Launches</h2>
                        <ul className="space-y-3 text-gray-600 font-medium">
                            <li onClick={() => setProjectFilter('all')} className={`flex items-center justify-between text-sm hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg ${projectFilter === 'all' ? 'bg-blue-50 text-blue-600' : ''}`}>
                                <span className="flex items-center gap-3"><Rss className="w-5 h-5" />All</span>
                                <span className={`font-semibold px-2.5 py-0.5 rounded-full ${projectFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>{projects.length}</span>
                            </li>
                            <li onClick={() => setProjectFilter('draft')} className={`flex items-center justify-between text-sm hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg ${projectFilter === 'draft' ? 'bg-blue-50 text-blue-600' : ''}`}>
                                <span className="flex items-center gap-3"><Edit3 className="w-5 h-5" />Drafts</span>
                                <span className={`font-semibold px-2.5 py-0.5 rounded-full ${projectFilter === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>{projects.filter(p => p.status === 'draft').length}</span>
                            </li>
                            <li onClick={() => setProjectFilter('launched')} className={`flex items-center justify-between text-sm hover:text-blue-600 transition-colors cursor-pointer p-2 rounded-lg ${projectFilter === 'launched' ? 'bg-blue-50 text-blue-600' : ''}`}>
                                <span className="flex items-center gap-3"><Star className="w-5 h-5" />Launched</span>
                                <span className={`font-semibold px-2.5 py-0.5 rounded-full ${projectFilter === 'launched' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{projects.filter(p => p.status !== 'draft').length}</span>
                            </li>
                        </ul>
                    </div>
                )}
                <div className="mt-auto pt-8">
                    <h3 className="font-semibold mb-3 text-gray-800">Resources</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li><a href="/launchitguide" className="hover:text-blue-600 flex items-center gap-2 transition-transform duration-200 hover:translate-x-1"><HelpCircle className="w-4 h-4" />Launch Guide</a></li>
                        <li><a href="/suggestions" className="hover:text-blue-600 flex items-center gap-2 transition-transform duration-200 hover:translate-x-1"><MessageCircle className="w-4 h-4" />Feedback</a></li>
                    </ul>
                </div>
            </aside >
        </>
    );
};

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');
    const [projectFilter, setProjectFilter] = useState('all');

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

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths}mo ago`;

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears}y ago`;
    };

    const isDraftIncomplete = (project) => {
        // Required fields: name, tagline, description, website_url, category_type
        return !project.name || !project.tagline || !project.description || !project.website_url || !project.category_type;
    };

    const filteredProjects = projects.filter(project => {
        if (projectFilter === 'all') return true;
        if (projectFilter === 'draft') return project.status === 'draft' && isDraftIncomplete(project);
        if (projectFilter === 'launched') return project.status !== 'draft';
        return true;
    });

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            {isOwner && <UserProfileSidebar projects={projects} comments={comments} activeTab={activeTab} setActiveTab={setActiveTab} projectFilter={projectFilter} setProjectFilter={setProjectFilter} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}

            {/* Main Content */}
            <main className="w-full flex-1 p-4 sm:p-6 md:p-8 mt-16">
                {isOwner && (
                    <div className="md:hidden pb-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-white p-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-100">
                            <Menu className="w-5 h-5" />
                            Profile Menu
                        </button>
                    </div>
                )}
                {/* Profile Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <img
                            src={profile.avatar_url || 'https://api.dicebear.com/6.x/initials/svg?seed=' + profile.username}
                            alt="Profile"
                            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-md"
                            loading="lazy"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.full_name || profile.username || 'Unnamed User'}</h1>
                            <p className="text-gray-500 text-sm mb-3">{profile.email || 'No email provided'}</p>
                            <p className="text-gray-700 mb-4 max-w-xl mx-auto md:mx-0">{profile.bio || 'This user has not written a bio yet'}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500">
                                {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-500 flex items-center gap-1.5"><Twitter className="w-4 h-4" /><span>Twitter</span></a>}
                                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-1.5"><Linkedin className="w-4 h-4" /><span>LinkedIn</span></a>}
                                {profile.youtube && <a href={profile.youtube} target="_blank" rel="noreferrer" className="hover:text-red-600 flex items-center gap-1.5"><Youtube className="w-4 h-4" /><span>YouTube</span></a>}
                                {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noreferrer" className="hover:text-gray-800 flex items-center gap-1.5"><Briefcase className="w-4 h-4" /><span>Portfolio</span></a>}
                            </div>
                        </div>
                        {isOwner && (
                            <button onClick={() => navigate('/settings')} className="mt-4 md:mt-0 md:ml-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm hover:shadow-md self-center md:self-start">Edit Profile</button>
                        )}
                    </div>
                </div>
                {activeTab === 'projects' && (
                    <>
                        {/* Drafts Section */}
                        {isOwner && projectFilter !== 'launched' && filteredProjects.filter(p => p.status === 'draft').length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Drafts</h3>
                                <div className="space-y-4">
                                    {filteredProjects.filter(p => p.status === 'draft').map((project) => (
                                        <div key={project.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                {project.logo_url ? (
                                                    <img src={project.logo_url} alt="Logo" className="w-12 h-12 object-contain rounded-lg border bg-gray-50" loading="lazy" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold border">
                                                        <span>{project.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                                                    <p className="text-xs text-gray-500">Created {new Date(project.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric' })} • Last edited {getTimeAgo(project.updated_at || project.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => navigate(`/submit?draft=${project.id}`)} className="px-4 py-2 text-sm font-semibold border border-blue-600 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-all">Continue editing</button>
                                                <button onClick={() => handleDeleteClick(project)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Launched Section */}
                        {projectFilter !== 'draft' && filteredProjects.filter(p => p.status !== 'draft').length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-gray-800 mb-5">Launched Projects</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProjects.filter(p => p.status !== 'draft').map((project) => (
                                        <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col" onClick={() => navigate(`/launches/${project.slug}`)}>
                                            <div className="relative pt-[56.25%] bg-gray-100 rounded-t-xl overflow-hidden">
                                                {project.media_urls && project.media_urls.length > 0 ? (
                                                    <img src={project.media_urls[0]} alt={`${project.name} preview`} className='absolute top-0 left-0 w-full h-full object-cover' loading="lazy" />
                                                ) : (
                                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                )}
                                            </div>
                                            <div className="p-5 flex-grow flex flex-col">
                                                <div className='flex items-start gap-4 mb-3'>
                                                    {project.logo_url ? (
                                                        <img src={project.logo_url} alt="Logo" className="w-12 h-12 object-contain rounded-lg border bg-white mt-1" loading="lazy" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold border flex-shrink-0 mt-1">
                                                            <span>{project.name.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h2 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">{project.name}</h2>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{project.tagline}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-500 mt-auto mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-4 h-4 text-gray-400" />
                                                        <span className="capitalize font-medium text-gray-700">{project.category_type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span>Launched on {new Date(project.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <Like projectId={project.id} />
                                                    {isOwner && (
                                                        <div className="flex gap-2">
                                                            <button onClick={e => { e.stopPropagation(); navigate(`/submit?edit=${project.id}`); }} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={e => { e.stopPropagation(); handleDeleteClick(project); }} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-12 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                                <h4 className="text-lg font-semibold text-gray-800">No Projects Found</h4>
                                <p className="text-gray-500 mt-1">There are no projects matching the selected filter.</p>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'comments' && (
                    <div>
                        <div className='flex items-center gap-3 mb-5'>
                            <h3 className='text-xl font-bold text-gray-800'>My Comments</h3>
                            <MessageCircle className="w-5 h-5 text-gray-500" />
                        </div>

                        <div className="mt-6">
                            {comments && comments.length > 0 ? (
                                <ul className="space-y-4">
                                    {comments.map(comment => (
                                        <li key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <img src={profile.avatar_url || 'https://api.dicebear.com/6.x/initials/svg?seed=' + profile.username} alt="author avatar" className="w-8 h-8 rounded-full" />
                                                <div className="flex-1">
                                                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{comment.content}</p>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        <span>Commented on <a href={`/launches/${comment.projects.slug}`} className="font-semibold text-blue-600 hover:underline">{comment.projects.name}</a></span>
                                                        <span className="mx-1">·</span>
                                                        <span>{getTimeAgo(comment.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-12 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                                    <h4 className="text-lg font-semibold text-gray-800">No Comments Yet</h4>
                                    <p className="text-gray-500 mt-1">You haven't made any comments yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Edit Dialog */}
            <Dialog open={!!editProject} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit {editForm.name}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" name="name" value={editForm.name || ''} onChange={handleEditChange} fullWidth margin="dense" />
                    <TextField label="Tagline" name="tagline" value={editForm.tagline || ''} onChange={handleEditChange} fullWidth margin="dense" />
                    <TextField label="Website URL" name="website_url" value={editForm.website_url || ''} onChange={handleEditChange} fullWidth margin="dense" />
                    <TextField label="Description" name="description" value={editForm.description || ''} onChange={handleEditChange} fullWidth margin="dense" multiline rows={4} />
                    {editError && <Alert severity="error" className="mt-4">{editError}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSave} color="primary" variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteProject} onClose={handleDeleteCancel}>
                <DialogTitle>Delete "{deleteProject?.name}"?</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this project? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={editSuccess} autoHideDuration={4000} onClose={() => setEditSuccess(false)}>
                <Alert onClose={() => setEditSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Project updated successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={deleteSuccess} autoHideDuration={4000} onClose={() => setDeleteSuccess(false)}>
                <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Project deleted successfully!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UserProfile;
