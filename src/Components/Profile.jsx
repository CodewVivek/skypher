import React from 'react';

const Profile = () => {
    return (
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-gray-100 shadow-xl rounded-2xl space-y-10">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>

            {/* Profile Picture */}
            <section className="flex items-center gap-6">
                <img
                    src="https://via.placeholder.com/100"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-600"
                />
                <button className="text-sm text-blue-600 hover:underline font-medium">Change Photo</button>
            </section>

            {/* Basic Info */}
            <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Tell us about yourself..."
                    />
                </div>
            </section>

            {/* Social Links */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
                    <p className="text-sm text-gray-500">Share how people can connect with you.</p>
                </div>

                <div className="space-y-4">
                    {['Twitter', 'LinkedIn', 'Portfolio'].map((label) => (
                        <div key={label}>
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <input
                                type="url"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`https://${label.toLowerCase()}.com/yourprofile`}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Save Button */}
            <div className="pt-4">
                <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Profile;
