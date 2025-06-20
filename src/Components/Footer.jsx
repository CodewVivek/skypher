import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Copyright } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="text-black pt-12 pb-8 bg-white">
            <div className="pt-8 border-t border-gray-200 text-center sm:text-left">
                <div className="container-custom px-4 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <Rocket className="h-6 w-6 text-primary-400" />
                                <span className="font-display font-bold text-2xl text-black">Skypher</span>
                            </Link>
                            <p className="text-black mb-4">
                                Connecting innovative startups with the resources they need to succeed.
                            </p>
                            {/* Socials (add icons if needed) */}
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">Platform</h4>
                            <ul className="space-y-2">
                                <li><Link to="/" className="text-black">Home</Link></li>
                                <li><Link to="/register" className="text-black">Register</Link></li>
                                <li><Link to="/jobs" className="text-black">Jobs</Link></li>
                                <li><Link to="/marketing" className="text-black">Marketing</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-black">Blog</a></li>
                                <li><a href="#" className="text-black">Help Center</a></li>
                                <li><a href="#" className="text-black">Startup Guide</a></li>
                                <li><a href="#" className="text-black">Investor Resources</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="/aboutus" className="text-black">About Us</a></li>
                                <li><a href="#" className="text-black">Careers</a></li>
                                <li><a href="/privacy" className="text-black">Privacy Policy</a></li>
                                <li><a href="/terms" className="text-black">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright bar */}
                    <div className="flex justify-center items-center text-sm text-gray-500 mt-8">
                        <Copyright className="w-4 h-4 mr-1" />
                        <span>Skypher. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
