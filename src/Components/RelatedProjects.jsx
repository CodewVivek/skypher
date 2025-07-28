import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Like from "../Components/Like";
import { ExternalLink, Tag, Rocket } from "lucide-react";

const RelatedProjects = ({ categoryType, excludeProjectId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [fallbackProjects, setFallbackProjects] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("category_type", categoryType)
        .neq("id", excludeProjectId)
        .neq("status", "draft")
        .limit(6);
      setProjects(data || []);
      // If no related, fetch fallback
      if (!data || data.length === 0) {
        const { data: fallback, error: fallbackError } = await supabase
          .from("projects")
          .select("*")
          .neq("id", excludeProjectId)
          .neq("status", "draft")
          .limit(6);
        setFallbackProjects(fallback || []);
      } else {
        setFallbackProjects([]);
      }
      setLoading(false);
    };
    if (categoryType && excludeProjectId) fetchRelated();
  }, [categoryType, excludeProjectId]);

  if (loading)
    return (
      <div className="text-gray-400 dark:text-gray-500 py-4">
        Loading related projects...
      </div>
    );
  if (!projects.length && !fallbackProjects.length) return null;

  return (
    <div className="mt-10">
      {(projects.length || fallbackProjects.length) > 0 && (
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Related Projects
        </h3>
      )}
      {!projects.length && fallbackProjects.length > 0 && (
        <div className="mb-4 text-blue-700 dark:text-blue-400 font-semibold">
          Explore More
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(projects.length ? projects : fallbackProjects).map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 flex flex-col p-0 rounded-none shadow-none border-none cursor-pointer transition-colors duration-300"
            onClick={() => navigate(`/launches/${project.slug}`)}
          >
            {/* Thumbnail with fixed 1:1 aspect ratio */}
            <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              {project.thumbnail_url ? (
                <img
                  src={project.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 dark:text-gray-500 text-3xl">
                  No Image
                </span>
              )}
            </div>
            {/* Logo + Company Name + External Link */}
            <div className="flex items-center gap-2 mt-4 ml-1">
              {project.logo_url ? (
                <img
                  src={project.logo_url}
                  alt="Logo"
                  className="w-7 h-7 object-contain rounded-full border bg-white dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold border dark:border-gray-600">
                  <Rocket className="w-5 h-5" />
                </div>
              )}
              <h2 className="text-base font-semibold text-black dark:text-white truncate">
                {project.name}
              </h2>
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            {/* Tagline */}
            <p className="text-sm text-black dark:text-gray-300 mt-1 ml-1 truncate">
              {project.tagline}
            </p>
            {/* Category + Like */}
            <div className="flex items-center justify-between mt-2 ml-1 mr-1 mb-2">
              <div className="flex items-center text-xs gap-1 text-black dark:text-gray-300">
                <Tag className="w-4 h-4" />
                <span className="capitalize">{project.category_type}</span>
              </div>
              <Like projectId={project.id} iconOnly={true} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProjects;
