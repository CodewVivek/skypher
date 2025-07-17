import React from 'react';

const News = () => (
    <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Platform News & Updates</h1>
        <p className="mb-4">Stay up to date with the latest news, feature releases, and announcements from Launch It.</p>
        <ul className="list-disc ml-6 mb-4">
            <li>🚀 <b>New Feature:</b> You can now upload multiple images for your project launches!</li>
            <li>🔒 <b>Security Update:</b> Improved account security and privacy controls.</li>
            <li>🌟 <b>Community:</b> Join our Discord to connect with other founders and users.</li>
            <li>📢 <b>Feedback:</b> We love hearing from you! Send your suggestions to <a href="mailto:support@launchit.com" className="text-blue-600 underline">support@launchit.com</a>.</li>
        </ul>
        <p className="text-gray-500">Check back here for more updates and platform improvements.</p>
    </div>
);

export default News;
