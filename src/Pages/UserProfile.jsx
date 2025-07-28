import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  ExternalLink,
  Calendar,
  Tag,
  MessageCircle,
  Rss,
  Star,
  Edit3,
  Trash2,
  HelpCircle,
  Menu,
  X,
  Briefcase,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  Youtube,
  Eye,
  Clock,
  Check,
  X as XIcon,
} from "lucide-react";
import Like from "../Components/Like";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import SortByDateFilter from "../Components/SortByDateFilter";

function sortProjectsByDate(
  projects,
  dateField = "created_at",
  order = "newest",
) {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return order === "newest" ? dateB - dateA : dateA - dateB;
  });
}

const UserProfileSidebar = ({
  projects,
  comments,
  activeTab,
  setActiveTab,
  projectFilter,
  setProjectFilter,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex-col gap-8 z-30 transform transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:flex md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-colors duration-300`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="mt-8 md:mt-0">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            My Activity
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300 font-medium">
            <li
              onClick={() => setActiveTab("projects")}
              className={`flex items-center justify-between text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-2 rounded-lg ${activeTab === "projects" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
            >
              <span className="flex items-center gap-3">
                <Briefcase className="w-5 h-5" />
                Projects
              </span>
            </li>
            <li
              onClick={() => setActiveTab("comments")}
              className={`flex items-center justify-between text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-2 rounded-lg ${activeTab === "comments" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                Comments
              </span>
              <span
                className={`font-semibold px-2.5 py-0.5 rounded-full ${activeTab === "comments" ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}
              >
                {comments.length}
              </span>
            </li>
          </ul>
        </div>
        {activeTab === "projects" && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              My Launches
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300 font-medium">
              <li
                onClick={() => setProjectFilter("all")}
                className={`flex items-center justify-between text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-2 rounded-lg ${projectFilter === "all" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <Rss className="w-5 h-5" />
                  All
                </span>
                <span
                  className={`font-semibold px-2.5 py-0.5 rounded-full ${projectFilter === "all" ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}
                >
                  {projects.length}
                </span>
              </li>
              <li
                onClick={() => setProjectFilter("draft")}
                className={`flex items-center justify-between text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-2 rounded-lg ${projectFilter === "draft" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5" />
                  Drafts
                </span>
                <span
                  className={`font-semibold px-2.5 py-0.5 rounded-full ${projectFilter === "draft" ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}
                >
                  {projects.filter((p) => p.status === "draft").length}
                </span>
              </li>
              <li
                onClick={() => setProjectFilter("launched")}
                className={`flex items-center justify-between text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-2 rounded-lg ${projectFilter === "launched" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <Star className="w-5 h-5" />
                  Launched
                </span>
                <span
                  className={`font-semibold px-2.5 py-0.5 rounded-full ${projectFilter === "launched" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}
                >
                  {projects.filter((p) => p.status !== "draft").length}
                </span>
              </li>
            </ul>
          </div>
        )}
        <div className="mt-auto pt-8">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Resources
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <a
                href="/launchitguide"
                className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-transform duration-200 hover:translate-x-1"
              >
                <HelpCircle className="w-4 h-4" />
                Launch Guide
              </a>
            </li>
            <li>
              <a
                href="/suggestions"
                className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-transform duration-200 hover:translate-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                Feedback
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

const UserProfile = () => {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const [editProject, setEditProject] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editWarning, setEditWarning] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteProject, setDeleteProject] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editError, setEditError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [projectFilter, setProjectFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [userPitches, setUserPitches] = useState([]);
  const [loadingPitches, setLoadingPitches] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deletePitchModal, setDeletePitchModal] = useState({
    open: false,
    pitchId: null,
    status: null,
  });

  // Add a function to fetch projects for the current profile
  const fetchUserProjects = async (profileId) => {
    if (!profileId) {
      return;
    }

    try {
      const { data: userProjects, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", profileId);

      if (error) {
        console.error("Error fetching user projects:", error);
        setProjects([]);
      } else {
        setProjects(userProjects || []);
      }
    } catch (err) {
      console.error("Exception in fetchUserProjects:", err);
      setProjects([]);
    }
  };

  // Fetch user pitches
  const fetchUserPitches = async (profileId) => {
    if (!profileId) {
      console.warn("No profileId provided to fetchUserPitches");
      setLoadingPitches(false);
      return;
    }

    setLoadingPitches(true);
    try {
      const { data, error } = await supabase
        .from("pitch_submissions")
        .select(
          `
                    *,
                    projects:project_id (
                        id, 
                        name, 
                        tagline, 
                        logo_url
                    )
                `,
        )
        .eq("user_id", profileId)
        .order("created_at", { ascending: false });

      if (!error) {
        setUserPitches(data || []);
      } else {
        console.error("Error fetching user pitches:", error);
        setUserPitches([]);
      }
    } catch (err) {
      console.error("Exception in fetchUserPitches:", err);
      setUserPitches([]);
    }
    setLoadingPitches(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setProfile(null);
        setLoading(false);
        return;
      }

      if (username.includes("${") || username.includes("profile.username")) {
        navigate("/");
        return;
      }

      const decodedUsername = decodeURIComponent(username);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", decodedUsername)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        console.error("Query details:", { username, error });
        setProfile(null);
        setLoading(false);
        return;
      } else {
        setProfile(data);
        // Check if logged-in user is the owner
        const {
          data: { user: loggedInUser },
        } = await supabase.auth.getUser();
        let userProjects = [];
        // Set isOwner based on whether logged-in user matches profile owner
        const isProfileOwner = loggedInUser && loggedInUser.id === data.id;
        setIsOwner(isProfileOwner);

        if (loggedInUser && loggedInUser.id === data.id) {
          // Owner: fetch all projects (including drafts)
          const { data: allProjects } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", data.id);
          userProjects = allProjects || [];
        } else {
          // Not owner: only show submitted projects
          const { data: nonDraftProjects } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", data.id)
            .neq("status", "draft");
          userProjects = nonDraftProjects || [];
        }
        setProjects(userProjects);
        // Fetch comments on own projects
        if (userProjects && userProjects.length > 0) {
          const projectIds = userProjects.map((p) => p.id);
          const { data: userComments, error: commentsError } = await supabase
            .from("comments")
            .select("*, projects(name, slug)")
            .in("project_id", projectIds)
            .eq("user_id", data.id);
          if (!commentsError) {
            setComments(userComments);
          } else {
            setComments([]);
          }
        } else {
          setComments([]);
        }

        // Fetch user pitches if this is the owner
        if (isProfileOwner) {
          await fetchUserPitches(data.id);
        }

        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Remove the redundant useEffect that was causing circular dependency

  // Edit handlers
  const handleEditClick = (project) => {
    setEditProject(project);
    setEditForm({ ...project });
  };
  const handleEditClose = () => {
    setEditProject(null);
    setEditWarning(false);
    setEditError("");
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  // In handleEditSave, after updating the project, refetch the latest projects from Supabase
  const handleEditSave = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: editProject.name,
          tagline: editProject.tagline,
          description: editProject.description,
          website_url: editProject.website_url,
          category_type: editProject.category_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editProject.id);
      if (error) throw error;
      setEditSuccess(true);
      setEditProject(null);
      // Add a small delay before refetching to avoid conflicts
      setTimeout(async () => {
        if (profile && profile.id) {
          await fetchUserProjects(profile.id);
        }
      }, 500);
    } catch (err) {
      setEditError(err.message || "Failed to update project.");
    }
  };

  // Delete handlers
  const handleDeleteClick = (project) => setDeleteProject(project);
  const handleDeleteCancel = () => setDeleteProject(null);
  // In handleDeleteConfirm, after deleting the project, refetch the latest projects
  const handleDeleteConfirm = async () => {
    try {
      // First, delete associated data (likes, comments, etc.)
      const { error: likesError } = await supabase
        .from("project_likes")
        .delete()
        .eq("project_id", deleteProject.id);

      if (likesError) {
        console.error("Error deleting likes:", likesError);
      }

      const { error: commentsError } = await supabase
        .from("comments")
        .delete()
        .eq("project_id", deleteProject.id);

      if (commentsError) {
        console.error("Error deleting comments:", commentsError);
      }

      // Then delete the project
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteProject.id);

      if (error) {
        console.error("Error deleting project:", error);
        throw error;
      }

      setDeleteSuccess(true);
      setDeleteProject(null);

      // Add a small delay before refetching to avoid conflicts
      setTimeout(async () => {
        if (profile && profile.id) {
          await fetchUserProjects(profile.id);
        }
      }, 500);
    } catch (err) {
      console.error("Error in handleDeleteConfirm:", err);
      setEditError(err.message || "Failed to delete project.");
    }
  };

  // Delete pitch
  const deletePitch = async (pitchId, status) => {
    setDeletePitchModal({ open: true, pitchId, status });
  };

  const handleDeletePitchConfirm = async () => {
    const { pitchId, status } = deletePitchModal;

    try {
      // First, get pitch data to check video type and URL
      const { data: pitchData, error: fetchError } = await supabase
        .from("pitch_submissions")
        .select("video_url, video_type")
        .eq("id", pitchId)
        .single();

      if (fetchError) {
        console.error("Error fetching pitch data:", fetchError);
        throw fetchError;
      }

      // If it's a file upload, delete from storage
      if (
        pitchData?.video_type === "file" &&
        pitchData?.video_url &&
        pitchData.video_url.includes("pitch-videos")
      ) {
        const filePath = pitchData.video_url.split("/pitch-videos/")[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("pitch-videos")
            .remove([filePath]);

          if (storageError) {
            console.error("Error deleting video file:", storageError);
            // Continue with database deletion even if file deletion fails
          }
        }
      }

      // Delete the pitch record from database
      const { error: deleteError } = await supabase
        .from("pitch_submissions")
        .delete()
        .eq("id", pitchId);

      if (deleteError) {
        console.error("Error deleting pitch record:", deleteError);
        throw deleteError;
      }

      // Refresh pitches with a small delay to avoid conflicts
      setTimeout(() => {
        fetchUserPitches(profile.id);
      }, 500);

      setSnackbar({
        open: true,
        message: "Pitch deleted successfully",
        severity: "success",
      });
      setDeletePitchModal({ open: false, pitchId: null, status: null });
    } catch (error) {
      console.error("Error deleting pitch:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete pitch: " + error.message,
        severity: "error",
      });
      setDeletePitchModal({ open: false, pitchId: null, status: null });
    }
  };

  const handleDeletePitchCancel = () => {
    setDeletePitchModal({ open: false, pitchId: null, status: null });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <Check className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">User profile not found.</p>
      </div>
    );
  }

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  };

  // Add a helper to check if a draft has at least one required field filled
  const isDraftStarted = (project) => {
    return !!(
      project.name ||
      project.tagline ||
      project.description ||
      project.website_url ||
      project.category_type
    );
  };

  // Update the filteredProjects logic for drafts
  const filteredProjects = projects.filter((project) => {
    if (projectFilter === "all") return true;
    if (projectFilter === "draft")
      return project.status === "draft" && isDraftStarted(project);
    if (projectFilter === "launched") return project.status !== "draft";
    return true;
  });

  const sortedProjects = sortProjectsByDate(
    filteredProjects,
    "created_at",
    sortOrder,
  );

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
      {isOwner && (
        <UserProfileSidebar
          projects={projects}
          comments={comments}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="w-full flex-1 p-4 sm:p-6 md:p-8 mt-16">
        {isOwner && (
          <div className="md:hidden pb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 p-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <Menu className="w-5 h-5" />
              Profile Menu
            </button>
          </div>
        )}
        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={
                profile.avatar_url ||
                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                  profile.username
              }
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-gray-700 object-cover shadow-md"
              loading="lazy"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {profile.full_name || profile.username || "Unnamed User"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                {profile.email || "No email provided"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-xl mx-auto md:mx-0">
                {profile.bio || "This user has not written a bio yet"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 dark:text-gray-400">
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.youtube && (
                  <a
                    href={profile.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>YouTube</span>
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gray-800 dark:hover:text-gray-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
            {isOwner && (
              <button
                onClick={() => navigate("/settings")}
                className="mt-4 md:mt-0 md:ml-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm hover:shadow-md self-center md:self-start"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "projects"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Projects ({filteredProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("pitches")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pitches"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Pitches ({userPitches.length})
          </button>
        </div>
        {activeTab === "projects" && (
          <>
            {/* Drafts Section */}
            {isOwner &&
              projectFilter !== "launched" &&
              filteredProjects.filter((p) => p.status === "draft").length >
                0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Drafts
                  </h3>
                  <div className="space-y-4">
                    {filteredProjects
                      .filter((p) => p.status === "draft")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            {project.thumbnail_url ? (
                              <img
                                src={project.thumbnail_url}
                                alt="Thumbnail"
                                className="w-12 h-12 object-cover rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold border dark:border-gray-600">
                                <span>No Thumbnail</span>
                              </div>
                            )}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {project.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Created{" "}
                                {new Date(
                                  project.created_at,
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                })}{" "}
                                • Last edited{" "}
                                {getTimeAgo(
                                  project.updated_at || project.created_at,
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                navigate(`/submit?draft=${project.id}`)
                              }
                              className="px-4 py-2 text-sm font-semibold border border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            >
                              Continue editing
                            </button>
                            <button
                              onClick={() => handleDeleteClick(project)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            {/* Launched Section */}
            {projectFilter !== "draft" &&
              sortedProjects.filter((p) => p.status !== "draft").length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Launched Projects
                    </h3>
                    <SortByDateFilter
                      value={sortOrder}
                      onChange={setSortOrder}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProjects
                      .filter((p) => p.status !== "draft")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                          onClick={() => navigate(`/launches/${project.slug}`)}
                        >
                          <div className="relative pt-[56.25%] bg-gray-100 dark:bg-gray-700 rounded-t-xl overflow-hidden">
                            {project.thumbnail_url ? (
                              <img
                                src={project.thumbnail_url}
                                alt={`${project.name} thumbnail`}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                Nt
                              </div>
                            )}
                          </div>
                          <div className="p-5 flex-grow flex flex-col">
                            <div className="flex items-start gap-4 mb-3">
                              {project.logo_url ? (
                                <img
                                  src={project.logo_url}
                                  alt="Logo"
                                  className="w-12 h-12 object-contain rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 mt-1"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold border dark:border-gray-600 flex-shrink-0 mt-1">
                                  <span>
                                    {project.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  {project.name}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {project.tagline}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mt-auto mb-4">
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                                  {project.category_type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span>
                                  Launched on{" "}
                                  {new Date(
                                    project.created_at,
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <Like projectId={project.id} />
                              {isOwner && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/submit?edit=${project.id}`);
                                    }}
                                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClick(project);
                                    }}
                                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  No Projects Found
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  There are no projects matching the selected filter.
                </p>
              </div>
            )}
          </>
        )}
        {activeTab === "comments" && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                My Comments
              </h3>
              <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="mt-6">
              {comments && comments.length > 0 ? (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={
                            profile.avatar_url ||
                            "https://api.dicebear.com/6.x/initials/svg?seed=" +
                              profile.username
                          }
                          alt="author avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            {comment.content}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>
                              Commented on{" "}
                              <a
                                href={`/launches/${comment.projects.slug}`}
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {comment.projects.name}
                              </a>
                            </span>
                            <span className="mx-1">·</span>
                            <span>{getTimeAgo(comment.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    No Comments Yet
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    You haven't made any comments yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pitches Tab */}
        {activeTab === "pitches" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                My Pitches
              </h2>
            </div>

            {loadingPitches ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading pitches...
                </p>
              </div>
            ) : userPitches.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>No pitches submitted yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {userPitches.map((pitch) => (
                  <div key={pitch.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {pitch.title || "Untitled Pitch"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pitch.status)}`}
                          >
                            {getStatusIcon(pitch.status)}
                            {pitch.status}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Project: {pitch.projects?.name}
                        </p>

                        {pitch.description && (
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {pitch.description}
                          </p>
                        )}

                        {pitch.admin_notes && (
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-800 dark:text-red-200">
                              <strong>Rejection Reason:</strong>{" "}
                              {pitch.admin_notes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            Submitted:{" "}
                            {new Date(pitch.created_at).toLocaleDateString()}
                          </span>
                          <span>Type: {pitch.video_type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {pitch.video_type === "file" ? (
                          <PitchVideoPlayer filePath={pitch.video_url} />
                        ) : (
                          <a
                            href={pitch.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => deletePitch(pitch.id, pitch.status)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          title="Delete pitch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog
        open={!!editProject}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit {editForm.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editForm.name || ""}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Tagline"
            name="tagline"
            value={editForm.tagline || ""}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Website URL"
            name="website_url"
            value={editForm.website_url || ""}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Description"
            name="description"
            value={editForm.description || ""}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
            multiline
            rows={4}
          />
          {editError && (
            <Alert severity="error" className="mt-4">
              {editError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteProject} onClose={handleDeleteCancel}>
        <DialogTitle>Delete "{deleteProject?.name}"?</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Pitch Confirmation Modal */}
      <Dialog
        open={deletePitchModal.open}
        onClose={handleDeletePitchCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Delete Pitch
              </h3>
              <p className="text-sm text-red-600 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <HelpCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-yellow-800">
                  Are you absolutely sure?
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  This will permanently delete your pitch video and all
                  associated data. This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">
                What will be deleted:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Your pitch video file
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Pitch submission record
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  All associated metadata
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-6 pt-0">
          <Button
            onClick={handleDeletePitchCancel}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePitchConfirm}
            variant="contained"
            className="bg-red-600 hover:bg-red-700 text-white"
            startIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Pitch
          </Button>
        </DialogActions>
      </Dialog>

      {/* MUI Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Helper component for video preview
function PitchVideoPlayer({ filePath }) {
  const [signedUrl, setSignedUrl] = useState("");
  useEffect(() => {
    async function getSignedUrl() {
      if (!filePath) return;
      const { data } = await supabase.storage
        .from("pitch-videos")
        .createSignedUrl(filePath, 60 * 60);
      setSignedUrl(data?.signedUrl || "");
    }
    getSignedUrl();
  }, [filePath]);
  if (!signedUrl) return <span>Loading video...</span>;
  return <video src={signedUrl} controls width={200} />;
}

export default UserProfile;
