import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import Register from './Pages/Register';
import LandingPage from './Pages/LandingPage';
import UserRegister from './Pages/UserRegister';
import ProjectDetails from './Pages/ProjectDetails.jsx';
import DashBoard from './Pages/DashBoard.jsx';
import TermsOfService from './Pages/TermsOfService';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import AdminDashboard from './Pages/AdminDashboard';
import Settings from './Components/Settings.jsx';
import Aboutus from './Components/Aboutus.jsx';
import Footer from './Components/Footer.jsx';
import News from './Pages/News.jsx';
import UserProfile from './Pages/UserProfile.jsx';
import Suggestions from './Pages/Suggestions.jsx';
import LaunchItGuide from './Pages/LaunchItGuide.jsx';
import ScrollToTop from './Components/ScrollToTop';
import { AnimatePresence, motion } from 'framer-motion';

function AppRoutes() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/launchpage';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/admin" element={<PageFade><AdminDashboard /></PageFade>} />
            <Route path="/" element={<PageFade><DashBoard /></PageFade>} />
            <Route path="/launchpage" element={<PageFade><LandingPage /></PageFade>} />
            <Route path="/UserRegister" element={<PageFade><UserRegister /></PageFade>} />
            <Route path="/submit" element={<PageFade><Register /></PageFade>} />
            <Route path="/launches/:slug" element={<PageFade><ProjectDetails /></PageFade>} />
            <Route path="/settings" element={<PageFade><Settings /></PageFade>} />
            <Route path="/profile/:username" element={<PageFade><UserProfile /></PageFade>} />
            <Route path="/news" element={<PageFade><News /></PageFade>} />
            <Route path="/terms" element={<PageFade><TermsOfService /></PageFade>} />
            <Route path="/privacy" element={<PageFade><PrivacyPolicy /></PageFade>} />
            <Route path="/aboutus" element={<PageFade><Aboutus /></PageFade>} />
            <Route path="/footer" element={<PageFade><Footer /></PageFade>} />
            <Route path="/suggestions" element={<PageFade><Suggestions /></PageFade>} />
            <Route path="/launchitguide" element={<PageFade><LaunchItGuide /></PageFade>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!hideHeaderFooter && <Footer />}
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
      style={{ minHeight: '100%' }}
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

