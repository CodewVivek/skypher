import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ExternalLink, Calendar, Tag, Search } from 'lucide-react';
import Like from '../Components/Like';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const projectsSearch = projects.filter(
    project => project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.category_type.toLowerCase().includes(search.toLowerCase())) ||
      (project.description.toLowerCase().includes(search.toLowerCase()))
  )


  useEffect(() => {
    const fetchProjectsData = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('projects').select('*');
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

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''); // it basically will remove capticals - etc... and convert into small Letters

  const openProjectDetails = (projectName) => {
    const slug = slugify(projectName);
    navigate(`/launches/${slug}`);
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
      <div className="min-h-screen mt-20">
        <div className='flex items-center justify-center'>
          <div className="relative  justify-center w-full max-w-md">
            <input
              type="text"
              placeholder="Search for Launches,categories,or more..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search />
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {
            projectsSearch.length == 0 && (
              <div>
                <div className="flex justify-center items-center min-h-[60vh] sm:min-h-[70vh]">
                  <div className="flex flex-col justify-center items-center text-center">
                    <svg data-v-ad307406="" xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-animal-icon lucide-animal animal-icon"><path d="M13 16a3 3 0 0 1 2.24 5"></path><path d="M18 12h.01"></path><path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"></path><path d="M20 8.54V4a2 2 0 1 0-4 0v3"></path><path d="M7.612 12.524a3 3 0 1 0-1.6 4.3"></path></svg>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-650 mb-4">
                      No Launches Available
                    </h2>
                    <p className="text-lg text-gray-600">
                      Currently, there are no  launches scheduled or listed.<br />
                      We are continuously updating our records; please revisit shortly for new information.
                    </p>
                  </div>
                </div>
              </div>

            )
          }
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsSearch.map((project) => (

              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-1 border-gray-300"
                onClick={() => openProjectDetails(project.name)}
              >
                <div className="p-6">
                  <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-2 mb-2 w-auto ">
                      <h2 className="text-2xl font-semibold text-gray-900 w-auto">{project.name}</h2>
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
                    <Like projectId={project.id} />
                  </div>
                  {project.media_urls && project.media_urls.length > 0 && (
                    <img
                      src={project.media_urls[0]}
                      alt='Image of Launch'
                      className='w-full object-cover p-1'
                    />
                  )}
                  <p className="text-md text-gray-600 mb-4 line-clamp-2">{project.tagline}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm ">
                      <Tag className="w-4 h-4 mr-2 text-black" />
                      <span className="capitalize">{project.category_type}</span>
                    </div>
                    <div className="flex items-center text-sm ">
                      <Calendar className="w-4 h-4 mr-2 text-black" />
                      <span className='text-gray-600'>{formatDate(project.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div >
        </div >
      </div >


    </>
  );
};

export default Dashboard;
