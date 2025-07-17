import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { Eye, AlertTriangle, ExternalLink, Trash2, Package, Flag, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [reports, setReports] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingReports, setLoadingReports] = useState(true);
    const [deletingProject, setDeletingProject] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects');
    const [userCount, setUserCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [reportCount, setReportCount] = useState(0);

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
                    fetchReports();
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

    useEffect(() => {
        const fetchCounts = async () => {
            const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: projects } = await supabase.from('projects').select('*', { count: 'exact', head: true });
            const { count: comments } = await supabase.from('comments').select('*', { count: 'exact', head: true });
            const { count: reports } = await supabase.from('reports').select('*', { count: 'exact', head: true });
            setUserCount(users || 0);
            setProjectCount(projects || 0);
            setCommentCount(comments || 0);
            setReportCount(reports || 0);
        };
        fetchCounts();
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

    const fetchReports = async () => {
        try {
            console.log('Fetching reports...'); // Debug log

            const { data, error } = await supabase
                .from('reports')
                .select(`
                    *,
                    projects:project_id (
                        id,
                        name,
                        slug,
                        website_url
                    ),
                    profiles:user_id (
                        id,
                        full_name,
                        email
                    ),
                    comments:comment_id (
                        id,
                        content,
                        project_id,
                        projects (
                            id,
                            name,
                            slug,
                            website_url
                        )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching reports:', error);
                setReports([]);
            } else {
                setReports(data || []);
            }
        } catch (error) {
            console.error('Error in fetchReports:', error);
            setReports([]);
        } finally {
            setLoadingReports(false);
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

    const updateReportStatus = async (reportId, status) => {
        try {
            const { error } = await supabase
                .from('reports')
                .update({
                    status: status,
                    resolved_at: status !== 'pending' ? new Date().toISOString() : null
                })
                .eq('id', reportId);

            if (error) {
                console.error('Error updating report:', error);
                toast.error('Failed to update report status');
            } else {
                toast.success('Report status updated successfully');
                fetchReports();
            }
        } catch (error) {
            console.error('Error in updateReportStatus:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'ignored': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
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
                    <p className="text-gray-600">Manage platform projects and user reports</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-2xl font-bold text-blue-600">{userCount}</span>
                        <span className="text-gray-700 mt-2">Users</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-2xl font-bold text-green-600">{projectCount}</span>
                        <span className="text-gray-700 mt-2">Projects</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-2xl font-bold text-purple-600">{commentCount}</span>
                        <span className="text-gray-700 mt-2">Comments</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-2xl font-bold text-red-600">{reportCount}</span>
                        <span className="text-gray-700 mt-2">Reports</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'projects'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Projects ({projects.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4" />
                            Reports ({reports.length})
                        </div>
                    </button>
                </div>

                {/* Projects Tab */}
                {activeTab === 'projects' && (
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
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">User Reports ({reports.length})</h2>
                        </div>

                        {loadingReports ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading reports...</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Flag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No reports found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Report
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Comment (if reported)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reporter
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reports.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                                            {report.reason.replace('_', ' ')}
                                                        </p>
                                                        {report.description && (
                                                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                                                {report.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {report.comment_id && report.comments?.content ? (
                                                        <div className="text-xs text-gray-700 italic max-w-xs truncate">{report.comments.content}</div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {report.comment_id && report.comments?.projects ? (
                                                        <Link
                                                            to={`/launches/${report.comments.projects.slug}`}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            {report.comments.projects.name}
                                                        </Link>
                                                    ) : report.projects ? (
                                                        <Link
                                                            to={`/launches/${report.projects.slug}`}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            {report.projects.name}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-500">Project deleted</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {report.profiles?.full_name || 'Anonymous'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {report.profiles?.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {/* View button for project or comment */}
                                                        {report.projects ? (
                                                            <Link
                                                                to={`/launches/${report.projects.slug}`}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="View reported project"
                                                                target="_blank"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        ) : report.comment_id ? (
                                                            // If it's a comment report, try to link to the project and scroll to comment
                                                            report.project_id && report.projects ? (
                                                                <Link
                                                                    to={`/launches/${report.projects.slug}?comment=${report.comment_id}`}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    title="View reported comment"
                                                                    target="_blank"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                            ) : (
                                                                <span className="text-gray-400">No project</span>
                                                            )
                                                        ) : null}
                                                        {report.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateReportStatus(report.id, 'resolved')}
                                                                    className="text-green-600 hover:text-green-800"
                                                                    title="Mark as resolved"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => updateReportStatus(report.id, 'ignored')}
                                                                    className="text-gray-600 hover:text-gray-800"
                                                                    title="Ignore report"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
