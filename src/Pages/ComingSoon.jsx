import React, { useState } from "react";
import { Rocket, Mail, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Rocket className="w-4 h-4" />
                        Coming Soon
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-800 leading-tight mb-6 tracking-tight">
                        The Future of
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Startup</span>
                        <br />
                        Launching
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        We're building the ultimate platform for startups, founders, and investors.
                        Get ready for AI-powered insights, real-time collaboration, and everything you need to scale.
                    </p>
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-800">30</div>
                            <div className="text-sm text-gray-600">Days</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-800">12</div>
                            <div className="text-sm text-gray-600">Hours</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-800">45</div>
                            <div className="text-sm text-gray-600">Minutes</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="text-3xl font-bold text-gray-800">22</div>
                            <div className="text-sm text-gray-600">Seconds</div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Get Early Access
                        </button>
                        <Link to="/" className="px-8 py-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                            <ArrowRight className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Monetization - Paid Highlights Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            Monetization
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Paid Highlights
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Boost your startup's visibility and reach with our premium highlighting packages.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 99/- Package */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                                    <Sparkles className="w-4 h-4" />
                                    POPULAR
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-2">Quick Boost</h3>
                                <div className="text-5xl font-bold text-blue-600 mb-2">₹99</div>
                                <p className="text-gray-600">Full Day Highlight</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Full Day Dashboard Highlighted</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Trending Projects Section</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Special Badge Display</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Homepage Boost</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Priority Visibility</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                                Get Quick Boost - ₹99
                            </button>
                        </div>

                        {/* 499/599/- Package */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                    PREMIUM
                                </span>
                            </div>

                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold text-gray-800 mb-2">Extended Reach</h3>
                                <div className="text-5xl font-bold text-purple-600 mb-2">₹499</div>
                                <p className="text-gray-600">1 Week Highlight</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">1 Week Dashboard Highlighted</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Trending Projects Section</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Special Badge Display</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Homepage Boost</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Extended Visibility (7 Days)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Analytics Dashboard Access</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                                Get Extended Reach - ₹499
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 text-center">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Why Choose Paid Highlights?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Increased Visibility</h4>
                                    <p className="text-gray-600 text-sm">Get noticed by investors and potential partners</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Premium Badge</h4>
                                    <p className="text-gray-600 text-sm">Stand out with exclusive highlighting</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Homepage Boost</h4>
                                    <p className="text-gray-600 text-sm">Featured placement on the main page</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon; 