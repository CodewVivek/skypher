import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ExternalLink, X, Calendar, Users, Link as LinkIcon, Tag, Building2, Globe, ArrowLeft } from 'lucide-react';
import Like from '../Components/Like';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) {
        console.error("error fetching project data", error)
      }
      else {
        setProjects(data)
      }
    };
    fetchProjectsData();
  }, []);

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    // Scroll to the details section
    document.getElementById('project-details').scrollIntoView({ behavior: 'smooth' });
  }

  const closeProjectDetails = () => {
    setSelectedProject(null);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => openProjectDetails(project)}
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

                    <div className="flex items-center w-auto line-clamp-1 gap-10">
                      <Like projectId={project.id} />
                    </div>
                  </div>
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
      </div >

      {
        selectedProject && (
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
              <Like />
            </div>
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

        )
      }
    </>
  );
};

export default Dashboard;