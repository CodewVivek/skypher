import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowBigRight, ArrowBigLeft, ExternalLink, Flag, Calendar } from 'lucide-react';
import Like from '../Components/Like';
import Share from '../Components/Share';
import ReportModal from '../Components/ReportModal';
import Comments from '../Components/Comments';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RelatedProjects from '../Components/RelatedProjects';
import TrendingProjects from '../Components/TrendingProjects';

const NextArrow = ({ onClick, style, ...rest }) => (
    <button
        type="button"
        onClick={onClick}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2 flex items-center justify-center"
        style={{ ...style }}
        aria-label="Next image"
    >
        <ArrowBigRight className="w-6 h-6 text-gray-700" />
    </button>
);

const PrevArrow = ({ onClick, style, ...rest }) => (
    <button
        type="button"
        onClick={onClick}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2 flex items-center justify-center"
        style={{ ...style }}
        aria-label="Previous image"
    >
        <ArrowBigLeft className="w-6 h-6 text-gray-700" />
    </button>
);

// Helper to get link label
function getLinkLabel(url) {
    if (!url) return 'Website';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('play.google.com')) return 'Play Store';
    if (url.includes('apps.apple.com')) return 'App Store';
    return 'Website';
}

const ProjectDetails = () => {
    const { slug } = useParams();

    const [project, setProject] = useState(null);
    const [creator, setCreator] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    // Modal state for image lightbox
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);


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
                        .select('id, full_name, avatar_url, username')
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

    // Modal navigation handlers
    const openModal = idx => { setModalIndex(idx); setModalOpen(true); };
    const closeModal = () => setModalOpen(false);
    const prevModal = () => setModalIndex(i => (i === 0 ? project.cover_urls.length - 1 : i - 1));
    const nextModal = () => setModalIndex(i => (i === project.cover_urls.length - 1 ? 0 : i + 1));

    // Keyboard navigation for modal
    useEffect(() => {
        if (!modalOpen) return;
        const handler = (e) => {
            if (e.key === 'ArrowLeft') prevModal();
            if (e.key === 'ArrowRight') nextModal();
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [modalOpen, project?.cover_urls?.length]);


    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="min-h-screen bg-white/100">
            <div className="w-full flex items-center justify-center min-h-[260px]  bg-gradient-to-b from-gray-100 to-white ">
                <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4 py-12 text-center m-10">
                    {project.logo_url && (
                        <img
                            src={project.logo_url}
                            alt={`${project.name} logo`}
                            className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-contain mb-4 mx-auto"
                        />
                    )}
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-2">{project.name}</h1>
                    <p className="text-xl text-gray-700 font-medium mb-2">{project.tagline}</p>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl">{project.description}</p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <a
                            href={project.website_url}
                            target="_blank" rel="noopener"
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow hover:bg-blue-700 transition text-lg flex items-center gap-2">
                            <ExternalLink className="w-5 h-5" />
                            Launch {project.name}
                        </a>

                        <div className="bg-white rounded-full px-3 py-2 shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 inline-flex items-center justify-center">
                            <Like projectId={project.id} />
                        </div>

                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-8 py-6 px-2 md:px-6">
                <div className="flex-1 min-w-0">
                    {project.cover_urls && project.cover_urls.length > 0 && (
                        <div className="mb-8 relative">
                            <Slider
                                dots={true}
                                infinite={project.cover_urls.length > 1}
                                speed={500}
                                slidesToShow={1}
                                slidesToScroll={1}
                                nextArrow={project.cover_urls.length > 1 ? <NextArrow /> : null}
                                prevArrow={project.cover_urls.length > 1 ? <PrevArrow /> : null}
                                swipeToSlide={true}
                                adaptiveHeight={true}
                            >
                                {project.cover_urls.map((url, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-center items-center w-full h-[350px] rounded-lg overflow-hidden relative cursor-pointer"
                                        onClick={() => openModal(idx)}
                                    >
                                        <img
                                            src={url}
                                            alt={`Cover ${idx + 1}`}
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    </div>
                                ))}
                            </Slider>
                            {/* Modal/Lightbox for images */}
                            {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                                    <button
                                        className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/40 rounded-full p-2 hover:bg-black/70"
                                        onClick={closeModal}
                                        aria-label="Close"
                                    >
                                        &times;
                                    </button>
                                    <button
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2 z-10"
                                        onClick={prevModal}
                                        style={{ display: project.cover_urls.length > 1 ? 'block' : 'none' }}
                                        aria-label="Previous image"
                                    >
                                        <ArrowBigLeft className="w-8 h-8 text-gray-700" />
                                    </button>
                                    <img
                                        src={project.cover_urls[modalIndex]}
                                        alt={`Cover ${modalIndex + 1}`}
                                        className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg object-contain bg-white"
                                    />
                                    <button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2 z-10"
                                        onClick={nextModal}
                                        style={{ display: project.cover_urls.length > 1 ? 'block' : 'none' }}
                                        aria-label="Next image"
                                    >
                                        <ArrowBigRight className="w-8 h-8 text-gray-700" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Comments */}
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-10">
                        <Comments projectId={project.id} className="mt-10" />
                    </div>
                    {/* Related Projects */}
                    <RelatedProjects categoryType={project.category_type} excludeProjectId={project.id} />
                    {/* Thumbnail (if not already shown in covers) */}
                    {project.thumbnail_url && (!project.cover_urls || project.cover_urls.length === 0) && (
                        <div className="mb-8">
                            <img
                                src={project.thumbnail_url}
                                alt="Thumbnail"
                                className="rounded-lg border w-full max-h-[300px] object-contain"
                            />
                        </div>
                    )}
                    <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} projectId={project.id} projectName={project.name} />
                </div>
                {/* Sidebar - stack below on mobile */}
                <aside className="w-full md:w-80 flex-shrink-0 mt-10 md:mt-0">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-400 p-6 space-y-6 transition-all hover:shadow-2xl duration-300">

                        {/* Company Info */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Company Info</h2>
                            <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
                                <ExternalLink className="w-4 h-4 text-blue-500" />
                                <a
                                    href={project.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline truncate"
                                >
                                    {project.website_url}
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                <span>Launched on {formatDate(project.created_at)}</span>
                            </div>
                        </div>

                        {/* Share */}
                        <div>
                            <Share projectSlug={project.slug} projectName={project.name} />
                        </div>

                        {/* Launcher */}
                        {creator && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">🚀 Launcher</h3>
                                <Link
                                    to={`/profile/${creator.username}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                                >
                                    <img
                                        src={creator.avatar_url || '/default-avatar.png'}
                                        alt="creator avatar"
                                        className="w-11 h-11 rounded-full object-cover border shadow-sm"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {creator.full_name || 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-gray-500">View profile</p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Built With */}
                        {project.built_with?.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-1">🛠️ Built With:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.built_with.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        {project.links?.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-1">🔗 Links</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    {project.links.map((link, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Link className="w-4 h-4 mt-1 text-gray-500" />
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all"
                                            >
                                                {getLinkLabel(link)}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Report */}
                        <div>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium text-sm"
                            >
                                <Flag className="w-4 h-4" />
                                Report this project
                            </button>
                        </div>

                        {/* Trending Projects */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">🔥 Trending Launches</h3>
                            <TrendingProjects limit={5} by="likes" />
                        </div>

                    </div>
                </aside>

            </div>
        </div>
    );
};

export default ProjectDetails;
