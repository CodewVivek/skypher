import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ExternalLink, X, Calendar, Tag } from 'lucide-react';
import Like from '../Components/Like';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (

              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => openProjectDetails(project.name)}
              >
                <div className="p-6">
                  <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-2 mb-2 w-auto ">
                      <h2 className="text-xl font-semibold text-gray-900 w-auto">{project.name}</h2>
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
          </div>
        </div>
      </div>


    </>
  );
};

export default Dashboard;
