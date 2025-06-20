import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ExternalLink } from 'lucide-react';
import Like from '../Components/Like';


const ProjectDetails = () => {
    const { name } = useParams();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .ilike('name', name.replace(/-/g, ' ')) // if slugified
                .maybeSingle();

            if (error) {
                console.error(error);
            } else {
                setProject(data);
            }
            setLoading(false);
        };

        fetchProject();
    }, [name]);



    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-white p-20 flex flex-col md:flex-row gap-4">

                {/* Left Section */}
                <div className="w-full md:w-2/3 pr-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{project.name}</h2>
                        <a
                            href={project.website_url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <button className='flex gap-2 p-2 bg-blue-400 text-white rounded-2xl font-sans text-md'>
                                <ExternalLink />Visit Lauch
                            </button>
                        </a>

                    </div>

                    <p className="text-gray-600 mt-2">{project.tagline}</p>

                    <div className="mt-6 mb-4">
                        <img
                            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2dwaWczajVpeGltMmplOGJqdmJwd2lvc3RpdXdpdmQ1dHplem52eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4NKJhDAEv8TRu/giphy.gif"
                            alt="Project demo"
                            className="w-full rounded-lg border"
                        />
                    </div>

                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 font-extrabold mb-6">{project.team_emails}</p>
                    <p className="text-gray-700 font-extrabold  mb-6">{project.links}</p>
                    <p className="text-gray-700 font-extrabold  mb-6">{project.is_founder}Founder:</p>
                    <p className="text-gray-700 font-extrabold mb-6">{formatDate(project.created_at)}</p>


                    <div className="flex gap-2 flex-wrap mb-6">
                        {project.tags?.split(',').map((tag, i) => (
                            <span key={i} className="bg-gray-100 text-sm px-3 py-1 rounded-full text-gray-700">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                </div>


                {/* Right Sidebar */}
                <div className="w-full md:w-1/3 ">
                    <div className="mb-4">
                        <span className="text-sm text-gray-500">Launch Likes</span>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-2xl font-bold text-red-500"> <Like projectId={project.id} /></span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-md font-semibold mb-1">Company Info</h4>
                        <a
                            href={project.website_url}
                            className="text-blue-600 text-sm hover:underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {project.website_url}
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                            Launched in {new Date(project.created_at).getFullYear()}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-md font-semibold mb-1">Social</h4>
                        <div className="flex gap-2">
                            {project.instagram && (
                                <a href={project.instagram} target="_blank" rel="noreferrer" className="text-pink-600 text-sm">
                                    Instagram
                                </a>
                            )}
                            {project.linkedin && (
                                <a href={project.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 text-sm">
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-md font-semibold mb-1">Built By</h4>
                        <p className="text-sm text-gray-700">{project.user_name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
