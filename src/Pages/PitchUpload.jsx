import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { Eye, Play } from "lucide-react";

export default function PitchUpload() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [videoType, setVideoType] = useState("link"); // 'link' or 'file'
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [approvedPitches, setApprovedPitches] = useState([]);
  const [loadingApprovedPitches, setLoadingApprovedPitches] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch user on mount
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    fetchUser();
  }, []);

  // Fetch user's projects
  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .eq("user_id", user.id)
        .neq("status", "draft");
      if (!error) setProjects(data || []);
    }
    fetchProjects();
  }, [user]);

  // Fetch approved pitches
  const fetchApprovedPitches = async () => {
    setLoadingApprovedPitches(true);
    try {
      // First, fetch pitches with project data
      const { data: pitchesData, error: pitchesError } = await supabase
        .from("pitch_submissions")
        .select(
          `
                    *,
                    projects:project_id (
                        id, 
                        name, 
                        tagline, 
                        logo_url,
                        user_id
                    )
                `,
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (pitchesError) {
        console.error("Error fetching pitches:", pitchesError);
        setApprovedPitches([]);
        return;
      }

      // Then, fetch user profiles for all unique user IDs
      if (pitchesData && pitchesData.length > 0) {
        const userIds = [...new Set(pitchesData.map((p) => p.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        } else {
          // Combine the data
          const profilesMap = {};
          profilesData?.forEach((profile) => {
            profilesMap[profile.id] = profile;
          });

          const combinedData = pitchesData.map((pitch) => ({
            ...pitch,
            profiles: profilesMap[pitch.user_id],
          }));

          setApprovedPitches(combinedData);
        }
      } else {
        setApprovedPitches([]);
      }
    } catch (err) {
      console.error("Error fetching approved pitches:", err);
      setApprovedPitches([]);
    } finally {
      setLoadingApprovedPitches(false);
    }
  };

  useEffect(() => {
    fetchApprovedPitches();
  }, []);

  // File upload helper
  async function uploadPitchFile(file, userId, projectId) {
    const ext = file.name.split(".").pop();
    const filePath = `${userId}/${projectId}/${Date.now()}-pitch.${ext}`;
    const { error } = await supabase.storage
      .from("pitch-videos")
      .upload(filePath, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from("pitch-videos")
      .getPublicUrl(filePath);
    return urlData.publicUrl;
  }

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    if (!user) {
      setError("You must be logged in.");
      setSubmitting(false);
      return;
    }
    if (!selectedProject) {
      setError("Please select a project.");
      setSubmitting(false);
      return;
    }

    // Check if user already has a pitch for this project
    const { data: existingPitch, error: checkError } = await supabase
      .from("pitch_submissions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("project_id", selectedProject)
      .maybeSingle();

    if (checkError) {
      setError("Error checking existing pitches.");
      setSubmitting(false);
      return;
    }

    if (existingPitch) {
      if (existingPitch.status === "pending") {
        setError(
          "You already have a pending pitch for this project. Please wait for approval or rejection.",
        );
      } else if (existingPitch.status === "approved") {
        setError(
          "You already have an approved pitch for this project. You can only have one pitch per project.",
        );
      } else if (existingPitch.status === "rejected") {
        // Allow resubmission for rejected pitches
        // Delete the old rejected pitch first
        await supabase
          .from("pitch_submissions")
          .delete()
          .eq("id", existingPitch.id);
      }
    }

    let finalVideoUrl = videoUrl;
    let finalVideoType = videoType;
    try {
      if (videoType === "file") {
        if (!videoFile) throw new Error("No file selected");
        if (videoFile.size > 50 * 1024 * 1024)
          throw new Error("File must be under 50MB");
        finalVideoUrl = await uploadPitchFile(
          videoFile,
          user.id,
          selectedProject,
        );
        finalVideoType = "file";
      } else {
        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
          finalVideoType = "youtube";
        } else if (videoUrl.includes("loom.com")) {
          finalVideoType = "loom";
        } else {
          throw new Error("Please enter a valid YouTube or Loom link.");
        }
      }
      const { error: insertError } = await supabase
        .from("pitch_submissions")
        .insert([
          {
            user_id: user.id,
            project_id: selectedProject,
            video_url: finalVideoUrl,
            video_type: finalVideoType,
            title,
            description,
            status: "pending",
          },
        ]);
      if (insertError) throw insertError;

      // Show success message and redirect
      setSnackbar({
        open: true,
        message: "Pitch submitted successfully! Please wait for team approval.",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Error submitting pitch: " + err.message);
      console.error("Pitch submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Upload a Pitch Video</h2>
        <p className="mb-4">You must be logged in to upload a pitch.</p>
        <a
          href="/UserRegister"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Login / Sign Up
        </a>
      </div>
    );
  }
  if (projects.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Upload a Pitch Video</h2>
        <p className="mb-4">
          You must launch a project before uploading a pitch.
        </p>
        <a
          href="/register"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Launch a Project
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 p-6 border-b">
          Upload a Pitch Video
        </h2>
        {error && <div className="text-red-600 mb-2 px-6">{error}</div>}
        {success && <div className="text-green-600 mb-2 px-6">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-4">
              <label className="block font-medium mb-1">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Pitch Video</label>
              <div className="flex gap-4 mb-2 px-6">
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${videoType === "link" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setVideoType("link")}
                >
                  YouTube/Loom Link
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${videoType === "file" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setVideoType("file")}
                >
                  Upload File
                </button>
              </div>
              {videoType === "link" ? (
                <input
                  type="url"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Paste YouTube or Loom link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
              ) : (
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="w-full"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  required
                />
              )}
            </div>
            <div className="mb-4 px-6">
              <label className="block font-medium mb-1">Title (optional)</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="mb-4 px-6">
              <label className="block font-medium mb-1">
                Description (optional)
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
            </div>
            <div className="px-6 pb-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Pitch"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Approved Pitches Gallery */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Approved Pitches</h2>
          <p className="text-gray-600 mt-1">
            Watch pitches from other founders
          </p>
        </div>

        {loadingApprovedPitches ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading approved pitches...</p>
          </div>
        ) : approvedPitches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No approved pitches yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {approvedPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {pitch.projects?.logo_url && (
                      <img
                        src={pitch.projects.logo_url}
                        alt="Project logo"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {pitch.title || "Untitled Pitch"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {pitch.profiles?.full_name || "Anonymous"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Project:</strong> {pitch.projects?.name}
                  </p>

                  {pitch.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {pitch.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(pitch.created_at).toLocaleDateString()}
                    </span>

                    {pitch.video_type === "file" ? (
                      <ApprovedPitchVideoPlayer filePath={pitch.video_url} />
                    ) : (
                      <a
                        href={pitch.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Watch
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
}

// Helper component for approved pitch video preview
function ApprovedPitchVideoPlayer({ filePath }) {
  const [signedUrl, setSignedUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

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

  if (!signedUrl)
    return <span className="text-sm text-gray-500">Loading...</span>;

  return (
    <div className="relative">
      {!isPlaying ? (
        <button
          onClick={() => setIsPlaying(true)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <Play className="w-4 h-4" />
          Watch
        </button>
      ) : (
        <video
          src={signedUrl}
          controls
          className="w-full h-32 object-cover rounded"
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
