import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Copyright } from 'lucide-react';


const Footer = () => {
    return (
        <footer className=" text-black pt-12 pb-8">
            <div className="pt-8 border-t border-gray-800 text-center sm:text-left" />
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Rocket className="h-6 w-6 text-primary-400" />
                            <span className="font-display font-bold text-2xl text-black">Skypher</span>
                        </Link>
                        <p className="text-black mb-4">
                            Connecting innovative startups with the resources they need to succeed.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-black hover:text-primary-400 transition-colors"
                                aria-label="Twitter"
                            >

                            </a>
                            <a
                                href="#"
                                className="text-black hover:text-primary-400 transition-colors"
                                aria-label="LinkedIn"
                            >

                            </a>
                            <a
                                href="#"
                                className="text-black
                                hover:text-primary-400 transition-colors"
                                aria-label="GitHub"
                            >

                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4 ">Platform</h4>
                        <ul className="space-y-2 ">
                            <li>
                                <Link to="/" className="text-black transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-black transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="text-balck
                               transition-colors">
                                    Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/marketing" className="text-balck transition-colors">
                                    Marketing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-black transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className=" text-black transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-black transition-colors">
                                    Startup Guide
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-black transition-colors">
                                    Investor Resources
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/aboutus" className=" text-black
                                transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-black transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-black transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className=" text-black
                                transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    <p className="text-black">
                        <div className="flex">
                            <Copyright /> Skypher. All rights reserved.
                        </div>
                    </p>
                </div>
            </div >
        </footer >
    );
}
export default Footer;