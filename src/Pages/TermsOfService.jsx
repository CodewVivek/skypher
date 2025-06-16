import React from 'react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-white to-blue-100 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-8">
                    Terms of Service
                </h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using StartupHunt, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. User Accounts</h2>
                        <p className="mb-4">
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Conduct</h2>
                        <p className="mb-4">
                            You agree not to use the service to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Post or transmit any unlawful, threatening, abusive, libelous, defamatory, obscene, or otherwise objectionable content</li>
                            <li>Impersonate any person or entity</li>
                            <li>Interfere with or disrupt the service or servers</li>
                            <li>Violate any applicable laws or regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Intellectual Property</h2>
                        <p className="mb-4">
                            All content and materials available on StartupHunt are protected by intellectual property rights. You may not use, reproduce, or distribute any content without our permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Limitation of Liability</h2>
                        <p className="mb-4">
                            StartupHunt shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Changes to Terms</h2>
                        <p className="mb-4">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
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

export default TermsOfService; 