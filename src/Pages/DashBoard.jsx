import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ExternalLink, Calendar, Tag, Search, Rocket } from 'lucide-react';
import Like from '../Components/Like';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjectsData = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('projects').select('*').neq('status', 'draft');
      if (error) {
        console.error("Error fetching project data", error);
        setError(error.message);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjectsData();
  }, []);

  // Filter projects by search query
  const projectsSearch = projects.filter(
    project =>
      (project.name && project.name.toLowerCase().includes(search.toLowerCase())) ||
      (project.category_type && project.category_type.toLowerCase().includes(search.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Sort projects by date (descending)
  const sortProjects = [...projectsSearch].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Group projects by date
  const groupProjectsByDate = (projects) => {
    const groups = {};
    projects.forEach(project => {
      const date = new Date(project.created_at);
      let label;
      if (isToday(date)) label = 'Today';
      else if (isYesterday(date)) label = 'Yesterday';
      else label = format(date, 'd MMMM yyyy');
      if (!groups[label]) groups[label] = [];
      groups[label].push(project);
    });
    return groups;
  };
  const groupedProjects = groupProjectsByDate(sortProjects);

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const openProjectDetails = (project) => {
    navigate(`/launches/${project.slug}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading projects...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <div className="min-h-screen mt-20 bg-white">
        <div className='flex items-center justify-center'>
          <div className="text-center py-10 sm:py-16 md:py-24 px-2 sm:px-0">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6 tracking-tight">
              Decode Limitless Growth.<br />
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed">
              Got an idea ready to explode? Stop waiting. Launch it here. Explore the innovations shaping tomorrow.
            </p>
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for startups, categories, features..."
                className="w-full pl-12 pr-12 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 placeholder-gray-500 text-gray-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              {search && (
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none text-lg sm:text-xl"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>
        {Object.keys(groupedProjects).length === 0 && (
          <div className="flex justify-center items-center min-h-[60vh] sm:min-h-[70vh]">
            <div className="flex flex-col justify-center items-center text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-650 mb-4">
                No Launches Available
              </h2>
              <p className="text-lg text-gray-600">
                Currently, there are no launches scheduled or listed.<br />
                We are continuously updating our records; please revisit shortly for new information.
              </p>
            </div>
          </div>
        )}
        {Object.entries(groupedProjects).map(([dateLabel, projects]) => (
          <div key={dateLabel}>
            <h3 className="text-xl sm:text-2xl font-bold my-4 sm:my-6 mx-4 sm:mx-10">{dateLabel}</h3>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white flex flex-col p-0 rounded-none shadow-none border-none cursor-pointer"
                    onClick={() => openProjectDetails(project)}
                  >

                    <div className="w-full aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-3xl">No Image</span>
                      )}
                    </div>
                    {/* Logo + Company Name */}
                    <div className="flex items-center gap-2 mt-4 ml-1">
                      {project.logo_url ? (
                        <img
                          src={project.logo_url}
                          alt="Logo"
                          className="w-7 h-7 object-contain rounded-full border bg-white"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold border">
                          <Rocket className="w-5 h-5" />
                        </div>
                      )}
                      <h2 className="text-base font-semibold text-black truncate">{project.name}</h2>
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    {/* Tagline */}
                    <p className="text-sm text-black mt-1 ml-1 truncate">{project.tagline}</p>
                    {/* Category + Like */}
                    <div className="flex items-center justify-between mt-2 ml-1 mr-1 mb-2">
                      <div className="flex items-center text-xs gap-1 text-black">
                        <Tag className="w-4 h-4" />
                        <span className="capitalize">{project.category_type}</span>
                      </div>
                      <Like projectId={project.id} iconOnly={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div >
    </>
  );
};

export default Dashboard;