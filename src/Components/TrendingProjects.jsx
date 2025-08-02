import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const TrendingProjects = ({ limit = 5, by = "likes" }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      // Fetch all projects
      let { data: projectsData, error } = await supabase
        .from("projects")
        .select("*")
        .neq("status", "draft");
      if (error || !projectsData) {
        setProjects([]);
        setLoading(false);
        return;
      }
      // For each project, fetch likes and comments count
      const projectsWithCounts = await Promise.all(
        projectsData.map(async (project) => {
          const { count: likesCount } = await supabase
            .from("project_likes")
            .select("id", { count: "exact", head: true })
            .eq("project_id", project.id);
          const { count: commentsCount } = await supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .eq("project_id", project.id);
          return {
            ...project,
            likesCount: likesCount || 0,
            commentsCount: commentsCount || 0,
          };
        }),
      );
      // Sort by likes or comments
      const sorted = [...projectsWithCounts].sort((a, b) => {
        if (by === "comments") return b.commentsCount - a.commentsCount;
        return b.likesCount - a.likesCount;
      });
      setProjects(sorted.slice(0, limit));
      setLoading(false);
    };
    fetchTrending();
  }, [limit, by]);

  if (loading)
    return (
      <div className="text-gray-400 py-4">
        Loading trending projects...
      </div>
    );
  if (!projects.length)
    return (
      <div className="text-gray-400 py-4">
        No trending projects found.
      </div>
    );

  return (
    <div className="mt-10">
      <div className="font-semibold text-md mb-5 text-gray-800">
        Trending Launches
      </div>
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-gray-300 p-3 flex gap-3 items-center cursor-pointer hover:shadow-md transition-all duration-300 bg-white hover:bg-gray-50"
            onClick={() => navigate(`/launches/${project.slug}`)}
          >
            {project.logo_url ? (
              <img
                src={project.logo_url}
                alt="Logo"
                className="w-12 h-12 object-contain rounded-lg border bg-gray-50"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold border">
                <span>L</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-md font-semibold text-gray-900 truncate">
                {project.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {project.tagline}
              </p>
              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                <span>🚀 {project.likesCount}</span>
                <span>💬 {project.commentsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProjects;
