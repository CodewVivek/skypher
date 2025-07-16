import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowBigRight, ArrowBigLeft, ExternalLink, Flag } from 'lucide-react';
import Like from '../Components/Like';
import Share from '../Components/Share';
import ReportModal from '../Components/ReportModal';
import Comments from '../Components/Comments';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = (props) => (
    <div
        {...props}
        style={{
            ...props.style,
            display: 'flex',
            background: 'gray',
            borderRadius: '50%',
            width: 40,
            height: 40,
            right: 10,
            left: 'auto',
            zIndex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={e => (e.currentTarget.style.opacity = 0.85)}
    >

    </div>
);

const PrevArrow = (props) => (
    <div
        {...props}
        style={{
            ...props.style,
            display: 'flex',
            background: 'gray',
            borderRadius: '50%',
            width: 40,
            height: 40,
            left: 10,
            right: 'auto',
            zIndex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={e => (e.currentTarget.style.opacity = 0.85)}
    >
    </div>
);

const ProjectDetails = () => {
    const { slug } = useParams();

    const [project, setProject] = useState(null);
    const [creator, setCreator] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                console.error('Error fetching project:', error);
            } else {
                setProject(data);


                if (data && data.user_id) {

                    const { data: userData, error: userError } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url')
                        .eq('id', data.user_id)
                        .single();

                    if (userError) {
                        console.error('Error fetching creator:', userError);
                    } else {

                        setCreator(userData);
                    }
                } else {
                    console.log('No user_id found in project data');
                }
            }

            setLoading(false);
        };

        fetchProject();
    }, [slug]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', user.id)
                    .single();
                if (!profile || !profile.full_name || !profile.avatar_url) {
                    await supabase.from('profiles').update({
                        full_name: user.user_metadata.full_name,
                        avatar_url: user.user_metadata.avatar_url
                    }).eq('id', user.id);
                }
            }
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
                        <h2 className="text-3xl font-bold">{project.name}</h2>
                        <div className='flex gap-2'>
                            <a
                                href={project.website_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <button className='flex gap-2 p-2 bg-white text-black border-gray-200 border-2 rounded-2xl font-semibold text-md'>
                                    <ExternalLink />Launch
                                </button>
                            </a>
                            <Like projectId={project.id} />
                        </div>
                    </div>

                    <p className="text-gray-600 mt-2 text-xl">{project.tagline}</p>
                    {project.media_urls && project.media_urls.length > 0 && (
                        project.media_urls.length === 1 ? (
                            <div className="mt-6 mb-4">
                                <img
                                    src={project.media_urls[0]}
                                    alt="launch image"
                                    className="rounded-lg border"
                                />
                            </div>
                        ) : (
                            <div className="mt-6 mb-4">
                                <Slider
                                    dots={true}
                                    infinite={true}
                                    speed={500}
                                    slidesToShow={1}
                                    slidesToScroll={1}
                                    className="rounded-lg"
                                    nextArrow={<NextArrow />}
                                    prevArrow={<PrevArrow />}
                                >
                                    {project.media_urls.map((url, index) => (
                                        <div key={index}>
                                            <img
                                                src={url}
                                                alt={`launch images ${index + 1}`}
                                                className="rounded-lg border"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        )
                    )}
                    <p className="text-gray-700 mb-6 text-xl text-justify ">{project.description}</p>
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
                        <p className="text-md text-gray-500 mt-1">
                            Launched On: {formatDate(project.created_at)}
                        </p>
                        <div className="flex gap-2 mt-3">
                            <Share projectSlug={project.slug} projectName={project.name} />
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                                title="Report this project"
                            >
                                <Flag className="w-4 h-4" />
                                Report
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-md font-semibold mb-2">Built By</h4>
                        {creator ? (
                            <Link
                                to={`/profile/${encodeURIComponent(creator.full_name)}?id=${creator.id}`}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                <img
                                    src={
                                        creator.avatar_url ||
                                        '/default-avatar.png'
                                    }
                                    alt="creator avatar"
                                    className="w-10 h-10 rounded-full border object-cover"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {creator.full_name || 'Anonymous'}
                                    </p>
                                    <p className="text-xs text-gray-500">View profile</p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">?</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Unknown Creator
                                    </p>
                                    <p className="text-xs text-gray-500">Creator information unavailable</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="ml-12 mr-12 mx-auto">
                <Comments projectId={project.id} />
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                projectId={project.id}
                projectName={project.name}
            />
        </div>
    );
};

export default ProjectDetails;
