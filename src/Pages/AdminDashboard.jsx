import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { Eye, AlertTriangle, ExternalLink, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [deletingProject, setDeletingProject] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    toast.error("Please sign in");
                    return navigate("/");
                }

                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (profileError || profile?.role !== "admin") {
                    toast.error("Access Denied: Admins Only");
                    return navigate("/");
                } else {
                    setIsAdmin(true);
                    fetchProjects();
                }
            } catch (error) {
                console.error('Error in checkAccess:', error);
                toast.error("Error checking access");
            } finally {
                setLoading(false);
            }
        };

        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        checkAccess();

        return () => clearTimeout(timeout);
    }, []);

    const fetchProjects = async () => {
        try {
            console.log('Fetching projects...'); // Debug log

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
            } else {
                console.log('Projects data:', data); // Debug log
                console.log('Number of projects:', data?.length || 0);
                setProjects(data || []);
            }
        } catch (error) {
            console.error('Error in fetchProjects:', error);
            setProjects([]);
        } finally {
            setLoadingProjects(false);
            console.log('Finished loading projects'); // Debug log
        }
    };

    const deleteProject = async (projectId, mediaUrls = []) => {
        if (!window.confirm('Are you sure you want to delete this project and all its associated data?')) return;

        setDeletingProject(projectId);
        try {
            // 1. Delete likes for this project
            const { error: likesError } = await supabase
                .from('project_likes')
                .delete()
                .eq('project_id', projectId);

            if (likesError) {
                console.error('Error deleting likes:', likesError);
            }

            // 2. Delete media files from storage
            if (mediaUrls && mediaUrls.length > 0) {
                const filePaths = mediaUrls.map(url => {
                    const parts = url.split('/startup-media/');
                    return parts[1] || '';
                }).filter(Boolean);

                if (filePaths.length > 0) {
                    const { error: storageError } = await supabase.storage
                        .from('startup-media')
                        .remove(filePaths);

                    if (storageError) {
                        console.error('Error deleting media files:', storageError);
                    }
                }
            }

            // 3. Delete the project
            const { error: projectError } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (projectError) {
                throw projectError;
            }

            toast.success('Project and all associated data deleted successfully.');
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project. Please try again.');
        } finally {
            setDeletingProject(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage platform projects</p>
                </div>

                {/* Projects Management */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">All Projects ({projects.length})</h2>
                    </div>

                    {loadingProjects ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No projects found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Creator
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Website
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {project.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {project.tagline}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {project.user_id || 'Anonymous'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={project.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                                >
                                                    {project.website_url}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(project.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/launches/${project.slug}`}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View project"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteProject(project.id, project.media_urls)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete project"
                                                        disabled={deletingProject === project.id}
                                                    >
                                                        {deletingProject === project.id ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
