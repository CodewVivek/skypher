import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Like from '../Components/Like';
import { ExternalLink, Tag } from 'lucide-react';

const RelatedProjects = ({ categoryType, excludeProjectId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('category_type', categoryType)
                .neq('id', excludeProjectId)
                .neq('status', 'draft')
                .limit(6);
            setProjects(data || []);
            setLoading(false);
        };
        if (categoryType && excludeProjectId) fetchRelated();
    }, [categoryType, excludeProjectId]);

    if (loading) return <div className="text-gray-400 py-4">Loading related projects...</div>;
    if (!projects.length) return <div className="text-gray-400 py-4">No related projects found.</div>;

    return (
        <div className="mt-10">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Related Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map(project => (
                    <div
                        key={project.id}
                        className="rounded-md shadow-md border border-gray-100 transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-xl hover:scale-[1.03]"
                        onClick={() => navigate(`/launches/${project.slug}`)}
                    >
                        <div className="p-1">
                            {project.thumbnail_url ? (
                                <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden mb-2">
                                    <img
                                        src={project.thumbnail_url}
                                        alt="Thumbnail"
                                        className="w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mb-2 text-gray-400 text-2xl font-bold">
                                    No Thumbnail
                                </div>
                            )}
                            <div className='flex items-center justify-between'>
                                <div className="flex items-center gap-2 mb-2 w-auto ">
                                    {project.logo_url ? (
                                        <img
                                            src={project.logo_url}
                                            alt="Logo"
                                            className="w-10 h-10 object-contain rounded-full border bg-white"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold border">
                                            <span>L</span>
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-semibold text-gray-900 w-auto">{project.name}</h2>
                                    <a
                                        href={project.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                                <Like projectId={project.id} />
                            </div>
                            <p className="text-md text-gray-600 mb-4 line-clamp-2 min-h-[48px]">{project.tagline}</p>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm ">
                                    <Tag className="w-4 h-4 mr-2 text-black" />
                                    <span className="capitalize">{project.category_type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProjects; 