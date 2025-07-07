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
                if (data && data.user_id) {
                    const { data: userData, error: userError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user_id)
                        .single();

                    if (userError) console.error(userError);
                    else setCreator(userData);
                }

            }
            setLoading(false);
        };

        fetchProject();
    }, [name]);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user)
        };
        checkUser();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;



    return (
        <div className="min-h-screen bg-white">
            <div className="bg-white p-20 flex flex-col md:flex-row gap-4">

                {/* Left Section */}
                <div className="w-full md:w-2/3 pr-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{project.name}</h2>
                        <div className='flex gap-2'>
                            <a
                                href={project.website_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <button className='flex gap-2 p-2 bg-white text-black border-gray-200 border-2 rounded-2xl font-semibold text-md'>
                                    <ExternalLink />Lauch
                                </button>
                            </a>
                            <Like projectId={project.id} />
                        </div>
                    </div>

                    <p className="text-gray-600 mt-2">{project.tagline}</p>
                    {project.media_urls.map((url, index) =>
                    (
                        < div className="mt-6 mb-4" >
                            <img
                                key={index}
                                src={url}
                                alt='launch images'
                                className="w-full rounded-lg border"
                            />
                        </div>
                    )
                    )}

                    <p className="text-gray-700 mb-6">{project.description}</p>
                    <p className="text-gray-700 font-extrabold mb-6">{project.team_emails}</p>
                    <p className="text-gray-700 font-extrabold  mb-6">{project.links}</p>
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
                        <h4 className="text-md font-semibold mb-1">Company Info</h4>
                        <a
                            href={project.website_url}
                            className="text-blue-600 text-sm hover:underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {project.website_url}
                        </a>
                        <p className="text-gray-700 font-extrabold  mb-6">{project.is_founder}Founder:Promoter</p>
                        <p className="text-gray-700 font-extrabold  mb-6">Launcher</p>
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
                        <button className='flex items-center gap-1 '>

                            <p className="text-md font-medium text-gray-700">name</p>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProjectDetails;
