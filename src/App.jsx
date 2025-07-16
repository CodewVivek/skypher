import React from 'react';
import Header from './Components/Header';
import Register from './Pages/Register';
import LandingPage from './Pages/LandingPage';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import UserRegister from './Pages/UserRegister';
import ProjectDetails from './Pages/ProjectDetails.jsx';
import DashBoard from './Pages/Dashboard.jsx';
import TermsOfService from './Pages/TermsOfService';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import AdminDashboard from './Pages/AdminDashboard';
import Settings from './Components/Settings.jsx';
import Profile from './Components/Profile.jsx';
import Aboutus from './Components/Aboutus.jsx';
import Footer from './Components/Footer.jsx';
import News from './Pages/News.jsx';
import UserProfile from './Pages/UserProfile.jsx';



function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">

        <Header />

        <main className="flex-grow">
          <Routes>

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={<DashBoard />} />
            <Route path="/launchpage" element={<LandingPage />} />

            {/*user realted */}
            <Route path="/UserRegister" element={<UserRegister />} />
            <Route path="/submit" element={<Register />} />
            <Route path="/launches/:slug" element={<ProjectDetails />} />


            {/*user Profile realted */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<UserProfile />} />


            <Route path="/news" element={<News />} />

            {/*footer details */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/footer" element={<Footer />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;

