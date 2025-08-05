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
          // No user_id found in project data
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
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 py-10 px-2 md:px-6 mt-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 justify-center">
            <div className="flex flex-col items-center justify-center w-full max-w-2xl p-6 text-center ">
              {project.logo_url && (
                <img
                  src={project.logo_url}
                  alt={`${project.name} logo`}
                  className="w-16 h-16 rounded-2xl border-4 border-gray-300  shadow-lg object-contain  mx-auto mb-2 "
                />
              )}
              <h1 className="text-4xl font-semibold text-gray-800 mb-2">
                {project.name}
              </h1>
              <p className="text-xl text-gray-600  font-medium ">
                {project.tagline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4">
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow transition text-lg flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Launch {project.name}
                </a>

                <div className=" rounded-full  shadow-sm hover:shadow-md border border-gray-200  transition-all duration-300 inline-flex items-center justify-center">
                  <Like projectId={project.id} />
                </div>
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-6 whitespace-pre-line">{project.description}</p>
          {/* Images */}
          {project.cover_urls && project.cover_urls.length > 0 && (
            <div className="mb-10 relative">
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
                    className="group relative flex justify-center items-center w-full h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden cursor-zoom-in transition-all"
                    onClick={() => openModal(idx)}
                  >
                    <img
                      src={url}
                      alt={`Cover ${idx + 1}`}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </Slider>

              {/* Lightbox Modal */}
              {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 text-white text-4xl font-bold bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    &times;
                  </button>

                  {/* Prev button */}
                  {project.cover_urls.length > 1 && (
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 transition"
                      onClick={prevModal}
                      aria-label="Previous image"
                    >
                      <ArrowBigLeft className="w-8 h-8 text-gray-700" />
                    </button>
                  )}

                  {/* Image */}
                  <img
                    src={project.cover_urls[modalIndex]}
                    alt={`Cover ${modalIndex + 1}`}
                    className="max-h-[85vh] max-w-[95vw] rounded-xl shadow-2xl object-contain bg-white transition duration-300"
                  />

                  {/* Next button */}
                  {project.cover_urls.length > 1 && (
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 transition"
                      onClick={nextModal}
                      aria-label="Next image"
                    >
                      <ArrowBigRight className="w-8 h-8 text-gray-700" />
                    </button>
                  )}
                </div>
              )}
            </div>

          )}
          {/* Comments */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-10">
            <h2 className="text-lg font-bold mb-4">Comments</h2>
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
        {/* Right/Sidebar Section */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
            {/* Company Info */}
            <h2 className="text-lg font-bold mb-4">Company Info</h2>
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4" />
              <a href={project.website_url} target="_blank" rel="noopener" className="text-blue-700 hover:underline truncate">{project.website_url}</a>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Launched on {formatDate(project.created_at)}</span>
            </div>
            {/* Share */}
            <div className="mb-4">
              <Share projectSlug={project.slug} projectName={project.name} />
            </div>
            {/* Launcher */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Launcher</h3>
              {creator && (
                <Link to={`/profile/${creator.username}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                  <img
                    src={creator.avatar_url || '/default-avatar.png'}
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
              )}
            </div>
            {/* Built With */}
            {project.built_with && project.built_with.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">Built With:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.built_with.map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{tech}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Links */}
            {project.links && project.links.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">Links:</span>
                <ul className="mt-1 space-y-1">
                  {project.links.map((link, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-gray-500" />
                      <a href={link} target="_blank" rel="noopener" className="text-blue-700 hover:underline break-all">{getLinkLabel(link)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Report */}
            <div className="mb-4">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium w-full justify-center"
                title="Report this project"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
            {/* Trending Launches */}
            <TrendingProjects limit={5} by="likes" />
          </div>
        </aside>
      </div>


    </div>
  );
};

export default ProjectDetails;
