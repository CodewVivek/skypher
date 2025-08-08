import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Register from "./Pages/Register";
import UserRegister from "./Pages/UserRegister";
import DashBoard from "./Pages/DashBoard";
import ProjectDetails from "./Pages/ProjectDetails";
import UserProfile from "./Pages/UserProfile";
import PitchUpload from "./Pages/PitchUpload";
import ComingSoon from "./others/ComingSoon.jsx";
import LaunchItGuide from "./others/LaunchItGuide.jsx";
import LandingPage from "./others/LandingPage.jsx";
import AdminDashboard from "./Pages/AdminDashboard";
import Settings from "./Components/Settings";
import TermsOfService from "./others/TermsOfService.jsx";
import PrivacyPolicy from "./others/PrivacyPolicy.jsx";
import Aboutus from "./others/Aboutus.jsx";
import Suggestions from "./others/Suggestions.jsx";
import ApprovedPitches from "./Pages/ApprovedPitchesGallery.jsx";
import MyLaunches from "./Pages/userinfoyou/MyLaunches.jsx";
import SavedProjects from "./Pages/userinfoyou/SavedProjects.jsx";
import UpvotedProjects from "./Pages/userinfoyou/UpvotedProjects.jsx";
import MyComments from "./Pages/userinfoyou/MyComments.jsx";
import FollowersFollowing from "./Pages/userinfoyou/FollowersFollowing.jsx";
import CategoryProjects from "./Pages/CategoryProjects.jsx";
import ScrollToTop from "./Components/ScrollToTop";

function AppRoutes() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/launchpage";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      {!hideHeaderFooter && (
        <Sidebar isOpen={sidebarOpen} />
      )}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-10'}`}>
        {!hideHeaderFooter && <Header onMenuClick={handleSidebarToggle} />}
        <main className="flex-grow pt-16" style={{ minHeight: "100%" }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/admin"
                element={
                  <PageFade>
                    <AdminDashboard />
                  </PageFade>
                }
              />
              <Route
                path="/"
                element={
                  <PageFade>
                    <DashBoard />
                  </PageFade>
                }
              />

              <Route
                path="/UserRegister"
                element={
                  <PageFade>
                    <UserRegister />
                  </PageFade>
                }
              />
              <Route
                path="/submit"
                element={
                  <PageFade>
                    <Register />
                  </PageFade>
                }
              />
              <Route
                path="/launches/:slug"
                element={
                  <PageFade>
                    <ProjectDetails />
                  </PageFade>
                }
              />
              <Route
                path="/settings"
                element={
                  <PageFade>
                    <Settings />
                  </PageFade>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <PageFade>
                    <UserProfile />
                  </PageFade>
                }
              />
              <Route
                path="/terms"
                element={
                  <PageFade>
                    <TermsOfService />
                  </PageFade>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PageFade>
                    <PrivacyPolicy />
                  </PageFade>
                }
              />
              <Route
                path="/aboutus"
                element={
                  <PageFade>
                    <Aboutus />
                  </PageFade>
                }
              />
              <Route
                path="/suggestions"
                element={
                  <PageFade>
                    <Suggestions />
                  </PageFade>
                }
              />
              <Route
                path="/launchitguide"
                element={
                  <PageFade>
                    <LaunchItGuide />
                  </PageFade>
                }
              />
              <Route
                path="/upload-pitch"
                element={
                  <PageFade>
                    <PitchUpload />
                  </PageFade>
                }
              />
              <Route
                path="/coming-soon"
                element={
                  <PageFade>
                    <ComingSoon />
                  </PageFade>
                }
              />
              <Route
                path="/my-launches"
                element={
                  <PageFade>
                    <MyLaunches />
                  </PageFade>
                }
              />
              <Route
                path="/saved-projects"
                element={
                  <PageFade>
                    <SavedProjects />
                  </PageFade>
                }
              />
              <Route
                path="/upvoted-projects"
                element={
                  <PageFade>
                    <UpvotedProjects />
                  </PageFade>
                }
              />
              <Route
                path="/viewed-history"
                element={
                  <PageFade>
                    <ComingSoon />
                  </PageFade>
                }
              />
              <Route
                path="/launch-challenges"
                element={
                  <PageFade>
                    <ComingSoon />
                  </PageFade>
                }
              />
              <Route
                path="/my-comments"
                element={
                  <PageFade>
                    <MyComments />
                  </PageFade>
                }
              />
              <Route
                path="/downloads"
                element={
                  <PageFade>
                    <ComingSoon />
                  </PageFade>
                }
              />
              <Route
                path="/followers-following"
                element={
                  <PageFade>
                    <FollowersFollowing />
                  </PageFade>
                }
              />
              <Route
                path="/approved-pitches"
                element={
                  <PageFade>
                    <ApprovedPitches />
                  </PageFade>
                }
              />
              <Route
                path="/category/:category"
                element={
                  <PageFade>
                    <CategoryProjects />
                  </PageFade>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function PageFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
