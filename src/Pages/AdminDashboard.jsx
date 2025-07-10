import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ExternalLink, Trash2 } from 'lucide-react';
import Alert from '@mui/material/Alert';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        setError('');
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            setError('Failed to fetch projects.');
        } else {
            setProjects(data);
        }
        setLoading(false);
    };

    const handleDeleteProject = async (projectId, mediaUrls = []) => {
        if (!window.confirm('Are you sure you want to delete this project and all its associated data?')) return;
        setDeleting(projectId);
        setError('');
        setSuccess('');
        try {
            // 1. Delete likes for this project (ignore 404)
            const { error: likesError, status: likesStatus } = await supabase
                .from('project_likes')
                .delete()
                .eq('project_id', projectId);
            if (likesError && likesStatus !== 404) throw likesError;

            // 2. Delete media files from storage
            if (mediaUrls && mediaUrls.length > 0) {
                const filePaths = mediaUrls.map(url => {
                    const parts = url.split('/startup-media/');
                    return parts[1] || '';
                }).filter(Boolean);
                if (filePaths.length > 0) {
                    const { error: storageError } = await supabase.storage.from('startup-media').remove(filePaths);
                    if (storageError) throw storageError;
                }
            }
            const { error: projectError } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);
            if (projectError) throw projectError;
            setSuccess('Project and all associated data deleted successfully.');
            setProjects(projects.filter((p) => p.id !== projectId));
        } catch (err) {
            setError('Failed to delete project and associated data. ' + (err.message || ''));
        }
        setDeleting(null);
    };



    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-6 mt-4">Admin Dashboard</h1>
            {error && <Alert severity="error" className="mb-4">{error}</Alert>}
            {success && <Alert severity="success" className="mb-4">{success}</Alert>}
            {loading ? (
                <div>Loading projects...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl shadow-md border roun">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Website</th>
                                <th className="px-4 py-2">Tagline</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Team Emails</th>
                                <th className="px-4 py-2">Links</th>
                                <th className="px-4 py-2">Media</th>
                                <th className="px-4 py-2">User Name</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="border-t">
                                    <td className="px-4 py-2 font-semibold">{project.name}</td>
                                    <td className="px-4 py-2">
                                        <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                            {project.website_url} <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">{project.tagline}</td>

                                    <td className="px-4 py-2">{project.category_type}</td>
                                    <td className="px-4 py-2">
                                        {Array.isArray(project.team_emails) ? project.team_emails.join(', ') : project.team_emails}
                                    </td>
                                    <td className="px-4 py-2">
                                        {Array.isArray(project.links) ? project.links.join(', ') : project.links}
                                    </td>

                                    <td className="px-4 py-2">
                                        {project.media_urls && project.media_urls.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                {project.media_urls.map((url, idx) => (
                                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Media {idx + 1}</a>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{project.user_id}</td>
                                    <td className="px-4 py-2">{new Date(project.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                            onClick={() => handleDeleteProject(project.id, project.media_urls)}
                                            disabled={deleting === project.id}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {deleting === project.id ? 'Deleting...' : 'Delete'}
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
