import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-white to-blue-100 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-8">
                    Privacy Policy
                </h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Name and email address</li>
                            <li>Profile information</li>
                            <li>Account credentials</li>
                            <li>Communication preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide and maintain our services</li>
                            <li>Process your transactions</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Communicate with you about products, services, and events</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Information Sharing</h2>
                        <p className="mb-4">
                            We do not sell or rent your personal information to third parties. We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Service providers who assist in our operations</li>
                            <li>Legal authorities when required by law</li>
                            <li>Business partners with your consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
                        <p className="mb-4">
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Your Rights</h2>
                        <p className="mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to processing of your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies and Tracking</h2>
                        <p className="mb-4">
                            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy; 