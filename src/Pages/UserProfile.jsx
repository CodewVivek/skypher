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
        if (project.edit_count === 1) setEditWarning(true);
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
            // Only allow if edit_count < 2
            if (editProject.edit_count >= 2) {
                setEditError('Edit limit reached.');
                return;
            }
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
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 border-1 border-gray-300"
                                        {...(project.status !== 'draft' && { onClick: () => window.location.href = `/launches/${project.slug}` })}
                                        style={project.status === 'draft' ? { cursor: 'default', opacity: 0.9 } : { cursor: 'pointer' }}
                                    >
                                        <div className="p-4">
                                            {project.status === 'draft' && (
                                                <span className="inline-block bg-red-400 text-white text-sm px-2 py-1 rounded ml-2">!! Not Launched</span>
                                            )}
                                            <div className='flex items-center gap-2 mb-2 w-auto '>
                                                <h2 className="text-2xl font-semibold text-gray-900 w-auto">{project.name}</h2>
                                                {project.status !== 'draft' && (
                                                    <a
                                                        href={project.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                            {project.status === 'draft' ? (
                                                <div>

                                                </div>
                                            ) : (
                                                <>
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
                                                </>
                                            )}
                                            {isOwner && (
                                                <div className="flex gap-2 mt-2">
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        disabled={project.edit_count >= 2}
                                                        onClick={(e) => { e.stopPropagation(); handleEditClick(project); }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(project); }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                            {isOwner && project.edit_count === 1 && (
                                                <Alert severity="warning" className="mt-2">
                                                    You can only edit this project one more time!
                                                </Alert>
                                            )}
                                            {isOwner && project.edit_count >= 2 && (
                                                <Alert severity="error" className="mt-2">
                                                    Edit limit reached. You cannot edit this project anymore.
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                <Dialog open={!!editProject} onClose={handleEditClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogContent>
                        {editWarning && (
                            <Alert severity="warning" className="mb-4">
                                You can only edit this project one more time!
                            </Alert>
                        )}
                        {editError && (
                            <Alert severity="error" className="mb-4">{editError}</Alert>
                        )}
                        <TextField
                            margin="dense"
                            label="Name"
                            name="name"
                            value={editForm.name || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Tagline"
                            name="tagline"
                            value={editForm.tagline || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Website URL"
                            name="website_url"
                            value={editForm.website_url || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Category"
                            name="category_type"
                            value={editForm.category_type || ''}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            name="description"
                            value={editForm.description || ''}
                            onChange={handleEditChange}
                            fullWidth
                            multiline
                            minRows={3}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose}>Cancel</Button>
                        <Button onClick={handleEditSave} color="primary" variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={!!deleteProject} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this project? This cannot be undone.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCancel}>Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                    </DialogActions>
                </Dialog>

                {/* Success Snackbars */}
                <Snackbar open={editSuccess} autoHideDuration={4000} onClose={() => setEditSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert onClose={() => setEditSuccess(false)} severity="success" sx={{ width: '100%' }}>
                        Project updated successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={deleteSuccess} autoHideDuration={4000} onClose={() => setDeleteSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
                        Project deleted successfully!
                    </Alert>
                </Snackbar>

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
