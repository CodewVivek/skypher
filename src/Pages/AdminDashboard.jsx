import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const AdminDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    //const [flaggedReports, setFlaggedReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        checkAdminAccess();
    }, []);

    const checkAdminAccess = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/');
                return;
            }

            // Check if user's email matches admin email
            if (user.email === 'vivekmanikonda113@gmail.com') {
                setIsAdmin(true);
                fetchData();
            } else {
                setError('Access denied. Admin privileges required.');
                navigate('/');
            }
        } catch (error) {
            console.error('Error checking admin access:', error);
            setError('Error verifying admin access');
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setError(''); // Clear any previous errors

            // Fetch projects
            const { data: projectsData, error: projectsError } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (projectsError) {
                console.error('Projects fetch error:', projectsError);
                throw new Error('Error loading projects');
            }
            setProjects(projectsData || []);

            // Fetch users
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (usersError) {
                console.error('Users fetch error:', usersError);
                throw new Error('Error loading users');
            }
            setUsers(usersData || []);

            // Fetch flagged reports
            const { data: reportsData, error: reportsError } = await supabase
                .from('flagged_reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (reportsError) {
                console.error('Reports fetch error:', reportsError);
                throw new Error('Error loading reports');
            }
            setFlaggedReports(reportsData || []);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message || 'Error loading dashboard data');
        }
    };

    const handleProjectStatus = async (projectId, newStatus) => {
        try {
            const { error } = await supabase
                .from('projects')
                .update({ status: newStatus })
                .eq('id', projectId);

            if (error) throw error;
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating project status:', error);
            setError('Error updating project status');
        }
    };

    const handleUserAction = async (userId, action) => {
        try {
            if (action === 'block') {
                const { error } = await supabase
                    .from('users')
                    .update({ is_blocked: true })
                    .eq('id', userId);
                if (error) throw error;
            } else if (action === 'unblock') {
                const { error } = await supabase
                    .from('users')
                    .update({ is_blocked: false })
                    .eq('id', userId);
                if (error) throw error;
            }
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error handling user action:', error);
            setError('Error performing user action');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-8">
                        <nav className="-mb-px flex space-x-8">
                            {['projects', 'users', 'reports'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {projects.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No projects found. Projects will appear here when users submit them.
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {projects.map((project) => (
                                            <tr key={project.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                                    <div className="text-sm text-gray-500">{project.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleProjectStatus(project.id, 'approved')}
                                                        className="text-green-600 hover:text-green-900 mr-4"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleProjectStatus(project.id, 'rejected')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {users.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No users found. Users will appear here when they register.
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                                    <div className="text-sm text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.is_blocked ? 'Blocked' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {user.is_blocked ? (
                                                        <button
                                                            onClick={() => handleUserAction(user.id, 'unblock')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Unblock
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUserAction(user.id, 'block')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Block
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {flaggedReports.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No flagged reports found. Reports will appear here when users flag content.
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {flaggedReports.map((report) => (
                                            <tr key={report.id}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{report.reason}</div>
                                                    <div className="text-sm text-gray-500">Reported by: {report.reporter_email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleProjectStatus(report.project_id, 'rejected')}
                                                        className="text-red-600 hover:text-red-900 mr-4"
                                                    >
                                                        Remove Project
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(report.reporter_id, 'block')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Block Reporter
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 