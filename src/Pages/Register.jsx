import React, { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Upload, User } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categoryOptions = [
        {
            label: "💸 Finance & Fintech",
            options: [
                { value: "fintech", label: "💸 Fintech" },
                { value: "accounting", label: "📊 Accounting Software" },
                { value: "budgeting", label: "📉 Budgeting Apps" },
                { value: "credit", label: "💳 Credit Score Tools" },
                { value: "financial-planning", label: "📅 Financial Planning" },
                { value: "fundraising", label: "🤝 Fundraising Resources" },
                { value: "investing", label: "📈 Investing Platforms" },
                { value: "invoicing", label: "🧾 Invoicing Tools" },
                { value: "money-transfer", label: "💱 Money Transfer" },
                { value: "neobanks", label: "🏦 Neobanks" },
                { value: "online-banking", label: "🌐 Online Banking" },
                { value: "payroll", label: "💼 Payroll Software" },
                { value: "retirement", label: "👵 Retirement Planning" },
                { value: "savings", label: "💰 Savings Apps" },
                { value: "startup-finance", label: "🚀 Startup Financial Planning" },
                { value: "startup-incorporation", label: "📜 Startup Incorporation" },
                { value: "stock-trading", label: "📊 Stock Trading Platforms" },
                { value: "tax-prep", label: "🧮 Tax Preparation" },
                { value: "treasury", label: "🏛️ Treasury Management" },
            ]
        },
        {
            label: "☁️ SaaS & Platforms",
            options: [
                { value: "saas", label: "☁️ SaaS" },
                { value: "platform-addons", label: "🧩 Product Add-ons" },
            ]
        },
        {
            label: "📈 Marketing & Sales",
            options: [
                { value: "adtech", label: "📈 AdTech" },
                { value: "crm", label: "🧠 CRM Platforms" },
                { value: "email-marketing", label: "📬 Email Marketing" },
                { value: "ads", label: "📢 Ad Management" },
                { value: "social-media-scheduling", label: "🗓️ Social Media Scheduling" },
                { value: "seo", label: "🔍 SEO & Analytics" },
                { value: "affiliate", label: "🔗 Affiliate Marketing" }
            ]
        },
        {
            label: "👥 Social & Community",
            options: [
                { value: "social", label: "👥 Social Media" },
                { value: "community", label: "🌐 Online Communities" },
                { value: "creatoreconomy", label: "🎨 Creator Economy Tools" },
                { value: "community-management", label: "👩‍💻 Community Management" }
            ]
        },
        {
            label: "🧠 Artificial Intelligence",
            options: [
                { value: "ai", label: "🤖 AI" },
                { value: "gen-ai", label: "🧠 Generative AI Tools" },
                { value: "ai-coding", label: "💻 AI Coding Assistants" },
                { value: "ai-writing", label: "✍️ AI Writing Tools" },
                { value: "computer-vision", label: "👁️ Computer Vision" },
                { value: "ai-platforms", label: "🧪 AI APIs & Hosting" }
            ]
        },
        {
            label: "🩺 Health & Fitness",
            options: [
                { value: "healthtech", label: "🏥 HealthTech" },
                { value: "medtech", label: "💊 MedTech" },
                { value: "biotech", label: "🧬 BioTech" },
                { value: "fitness", label: "🏋️ Fitness Apps" },
                { value: "mental-health", label: "🧘 Wellness & Mental Health" },
                { value: "health-trackers", label: "📟 Health Data Trackers" },
                { value: "femtech", label: "👩 FemTech" },
                { value: "eldertech", label: "👵 ElderTech" }
            ]
        },
        {
            label: "🎨 Design & Creative",
            options: [
                { value: "design", label: "🎨 UI/UX Design Tools" },
                { value: "graphic", label: "🖌️ Graphic Design Software" },
                { value: "animation", label: "🎞️ Animation Tools" },
                { value: "video-editing", label: "🎥 Video Editing" },
                { value: "asset-management", label: "🗂️ Digital Asset Management" }
            ]
        },
        {
            label: "⚙️ Engineering & Development",
            options: [
                { value: "devtools", label: "⚙️ Dev Tools" },
                { value: "code-collab", label: "👨‍💻 Code Collaboration" },
                { value: "devops", label: "🔁 DevOps Platforms" },
                { value: "ci-cd", label: "🧪 CI/CD Tools" },
                { value: "api", label: "🔌 API Testing & Management" },
                { value: "containers", label: "📦 Container Orchestration" },
                { value: "cloud", label: "☁️ Cloud Platforms" },
                { value: "iot", label: "📡 IoT" }
            ]
        },
        {
            label: "💼 Work & Productivity",
            options: [
                { value: "productivity", label: "✅ Productivity Tools" },
                { value: "project-mgmt", label: "📋 Project Management" },
                { value: "remote-workforce", label: "🧑‍💻 Remote Workforce Tools" },
                { value: "team-collab", label: "👥 Team Collaboration" },
                { value: "time-tracking", label: "⏱️ Time Tracking Tools" },
                { value: "calendar", label: "📆 Scheduling & Calendar Apps" }
            ]
        },
        {
            label: "🌱 Sustainability & Climate",
            options: [
                { value: "greentech", label: "🌱 GreenTech" },
                { value: "climatetech", label: "🌎 ClimateTech" }
            ]
        },
        {
            label: "🚚 Logistics & Mobility",
            options: [
                { value: "logistics", label: "🚚 Logistics" },
                { value: "mobility", label: "🛴 Mobility" },
                { value: "traveltech", label: "✈️ TravelTech" }
            ]
        },
        {
            label: "🛍️ Ecommerce & Retail",
            options: [
                { value: "ecommerce", label: "🛍️ E-commerce" },
                { value: "store-builders", label: "🧱 Store Builders" },
                { value: "checkout", label: "💳 Checkout & Payments" },
                { value: "dropshipping", label: "📦 Dropshipping Tools" },
                { value: "product-sourcing", label: "🔍 Product Sourcing" },
                { value: "inventory", label: "📦 Inventory Management" }
            ]
        },
        {
            label: "🔒 Security & Infrastructure",
            options: [
                { value: "cybersecurity", label: "🔒 Cybersecurity" },
                { value: "hardware", label: "🛠️ Hardware Startups" },
                { value: "security", label: "🛡️ Security Tools" }
            ]
        },
        {
            label: "🎮 Entertainment & Media",
            options: [
                { value: "gaming", label: "🎮 Gaming" },
                { value: "entertainment", label: "🎬 Entertainment" },
                { value: "edutainment", label: "📚🎮 Edutainment" }
            ]
        },
        {
            label: "📚 Education",
            options: [
                { value: "edtech", label: "🎓 EdTech" }
            ]
        },
        {
            label: "🏛️ Legal & Professional Services",
            options: [
                { value: "legaltech", label: "⚖️ LegalTech" },
                { value: "hrtech", label: "👔 HRTech" }
            ]
        },
        {
            label: "⛓️ Blockchain & Web3",
            options: [
                { value: "blockchain", label: "⛓️ Blockchain" },
                { value: "web3", label: "🌐 Web3" },
                { value: "decentralized", label: "🌀 Decentralized Tech" },
                { value: "crypto-wallets", label: "💼 Crypto Wallets" },
                { value: "nft", label: "🖼️ NFT Platforms" },
                { value: "dao", label: "🗳️ DAO Tools" },
                { value: "defi", label: "💹 DeFi Platforms" }
            ]
        },
        {
            label: "🌾 Agri & Industrial Tech",
            options: [
                { value: "agritech", label: "🌾 AgriTech" },
                { value: "constructiontech", label: "🚧 ConstructionTech" },
                { value: "spacetech", label: "🚀 SpaceTech" },
                { value: "marinetech", label: "⚓ MarineTech" }
            ]
        },
        {
            label: "👗 Lifestyle & Consumer",
            options: [
                { value: "fashiontech", label: "👗 FashionTech" },
                { value: "pettech", label: "🐶 PetTech" },
                { value: "kids", label: "🧸 KidsTech" },
                { value: "wellness", label: "🧘 WellnessTech" }
            ]
        },
        {
            label: "🧪 Emerging Technologies",
            options: [
                { value: "nanotech", label: "🔬 NanoTech" },
                { value: "quantum", label: "⚛️ QuantumTech" },
                { value: "regtech", label: "📜 RegTech" },
                { value: "veterantech", label: "🎖️ VeteranTech" },
                { value: "civictech", label: "🏛️ CivicTech" },
                { value: "creatortech", label: "🎨 CreatorTech" },
            ]
        }
    ];
    const [files, setFiles] = useState([]);

    //LINK INPUT
    const [links, setLinks] = useState(['']);
    const addLink = () => setLinks([...links, '']);
    const updateLink = (index, value) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };
    const removeLink = (index) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    //TEAM MEMBERS 
    const [teamEmails, setTeamEmails] = useState([]);
    const [newTeamEmail, setNewTeamEmail] = useState('');
    const addTeamMember = () => {
        if (newTeamEmail && !teamEmails.includes(newTeamEmail)) {
            setTeamEmails([...teamEmails, newTeamEmail]);
            setNewTeamEmail('');
            toast.success('Team member added successfully!');
        }
    };
    const removeTeamMember = (email) => {
        setTeamEmails(teamEmails.filter((e) => e !== email));
    };

    //FORM DATA
    const [formData, setFormData] = useState({
        name: '',
        websiteUrl: '',
        description: '',
        tagline: '',
        isFounder: false,
        categoryOptions: '',

    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    //this is to show the file that we dropped /uploaded
    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf']
        },
        maxSize: 5242880, // 5MB
        maxFiles: 5
    });
    //this code is for remove the files user has uploaded
    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };


    //Checking if the user is authenticated......
    useEffect(() => {
        // Check if user is authenticated
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();//getting the user from db
            if (!user) {
                toast.error('Please sign in to submit a project');
                navigate('/UserRegister');
                return;
            }
            setUser(user);//else set user
        };
        checkUser();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please sign in to submit a project');
            navigate('/UserRegister');
            return;
        }

        // Validate required fields
        if (!formData.name || !formData.websiteUrl || !formData.description || !selectedCategory) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Prepare the data
        const submissionData = {
            name: formData.name,
            website_url: formData.websiteUrl,
            tagline: formData.tagline,
            description: formData.description,
            category_type: selectedCategory?.value,
            team_emails: teamEmails,
            links: links.filter(link => link.trim() !== ''),
            is_founder: formData.isFounder,
            created_at: new Date().toISOString(),
            user_id: user.id
        };

        try {

            let fileUrls = [];
            if (files.length > 0) {
                const uploadPromises = files.map(async (file, index) => {
                    const uniqueTimestamp = Date.now() + index;
                    const filePath = `${uniqueTimestamp}-${file.name}`;
                    const { data, error } = await supabase.storage
                        .from('startup-media')
                        .upload(filePath, file);

                    if (error) throw error;
                    const { data: urlData } = supabase.storage.from('startup-media').getPublicUrl(filePath);
                    return urlData.publicUrl;
                });

                fileUrls = await Promise.all(uploadPromises);
            }

            // Add file URLs to submission data
            submissionData.media_urls = fileUrls;

            // Insert data into Supabase
            const { data, error } = await supabase
                .from('projects')
                .insert([submissionData]);

            if (error) throw error;

            toast.success('Startup registered successfully!');

            // Reset form
            setFormData({
                name: '',
                websiteUrl: '',
                description: '',
                tagline: '',
                isFounder: false,
            });
            setSelectedCategory(null);
            setTeamEmails([]);
            setLinks(['']);
            setFiles([]);
            setStep(1);

            // Navigate to dashboard
            navigate('/');

        } catch (error) {
            console.error('Error submitting form:', error);
            console.log(' submitting form:', error);
            toast.error('Failed to register startup. Please try again.');
        }
    };
    const [step, setStep] = useState(1);


    //using ai to generate the data of the launches and saving ...

    const handleGenerateLaunchData = async () => {
        if (!formData.websiteUrl) {
            toast.error("Please enter a website URL first.");
            return;
        }
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData?.user?.id;

            const res = await fetch("http://localhost:3001/generatelaunchdata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: formData.websiteUrl,
                    user_id,
                }),

            });
            console.log("sending url", formData.websiteUrl);
            const gptData = await res.json();
            if (gptData.err) throw new Error(gptData.message);

            setFormData((prev) => ({
                ...prev,
                name: gptData.name,
                website_url: gptData.website_url,
                tagline: gptData.tagline,
                description: gptData.description,
            }));
            if (gptData.links?.length) setLinks(gptData.links)
            if (gptData.emails?.length) setTeamEmails(gptData.emails)
            toast.success("Startup details fetched! You can now edit them.");

        }
        catch (error) {
            console.error("Auto Generate failed :", error);
            toast.error("AI failed to extract startup info...");
        }

    }
    return (
        <>

            <div className="container-custom py-12">
                <div className="max-w-2xl mx-auto mt-15">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {[1, 2, 3].map((stepNumber) => (
                                    <div key={stepNumber} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                      ${step >= stepNumber ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-gray-300 text-gray-400'}`}
                                        >
                                            {stepNumber}
                                        </div>
                                        <span className={`mt-2 text-sm ${step >= stepNumber ? 'text-blue-900' : 'text-gray-400'}`}>
                                            {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Details' : 'Media'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="relative mt-4">
                                <div className="absolute top-0 left-0 h-1 bg-blue-900" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                                <div className="h-1 bg-gray-200 w-full" />
                            </div>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                        }} className="space-y-6">
                            {step === 1 && (
                                <>
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Website URL</label>
                                        <div className='flex gap-1'>
                                            <input
                                                type="url"
                                                name="websiteUrl"
                                                value={formData.websiteUrl}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                                placeholder="https://example.com"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleGenerateLaunchData}
                                                className="px-4 py-2 bg-indigo-600 text-white text-lg rounded-lg"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Startup Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="Enter your startup name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Tagline</label>
                                        <input
                                            type="text"
                                            name="tagline"
                                            value={formData.tagline}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="Enter a catchy tagline"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="Describe your startup"
                                        />
                                    </div>
                                    <section>
                                        <label className="block font-semibold text-gray-700 mb-2">
                                            Select Category / Industry
                                        </label>
                                        <Select
                                            options={categoryOptions}
                                            isClearable={isClearable}
                                            isSearchable={isSearchable}
                                            value={selectedCategory}
                                            onChange={setSelectedCategory}
                                            className="max-w-md"
                                        />
                                    </section>
                                </>
                            )}

                            {step === 2 && (
                                <>

                                    <div className="space-y-4">
                                        <label className="block text-lg font-semibold text-gray-700">Links</label>
                                        {links.map((link, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="url"
                                                    value={link}
                                                    onChange={(e) => updateLink(index, e.target.value)}
                                                    placeholder="Enter URL"
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                                />

                                                {links.length > 1 && (
                                                    <button type="button" onClick={() => removeLink(index)} className="p-2 text-red-600">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addLink} className="flex items-center text-blue-900">
                                            <Plus className="w-5 h-5 mr-1" />
                                            Add another link
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Add Team Members</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="email"
                                                value={newTeamEmail}
                                                onChange={(e) => setNewTeamEmail(e.target.value)}
                                                placeholder="Enter team member's email"
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={addTeamMember}
                                                className="px-6 py-3 bg-blue-900 text-white rounded-lg"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                    {teamEmails.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-700">Team Members:</h4>
                                            {teamEmails.map((email, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                    <span>{email}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTeamMember(email)}
                                                        className="text-red-600"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <h3 >Did you contribute to building this product?</h3>
                                        <input
                                            type="checkbox"
                                            name="isFounder"
                                            checked={formData.isFounder}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded border-gray-300"
                                        />
                                        <label className="text-base text-gray-700">Yes, I am the founder</label>
                                        <input
                                            type="checkbox"
                                            name="isPromoter"
                                            checked={formData.isPromoter}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded border-gray-300"
                                        />
                                        <label className="text-base text-gray-700">No, I am just promote </label>
                                    </div>
                                </>
                            )}



                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Media</label>
                                        <p className="text-sm text-gray-500 mb-4">Add images, logos, or other media files (max 5MB each)</p>

                                        <div
                                            {...getRootProps()}
                                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                                                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                                        >
                                            <input {...getInputProps()} />
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            {isDragActive ? (
                                                <p className="text-blue-500">Drop the files here...</p>
                                            ) : (
                                                <p className="text-gray-600">
                                                    Drag & drop files here, or click to select files
                                                </p>
                                            )}
                                        </div>

                                        {files.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <h4 className="font-medium text-gray-700">Selected Files:</h4>
                                                {files.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm text-gray-600">{file.name}</span>
                                                            <span className="text-xs text-gray-400">
                                                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between mt-8 pt-4 border-t">
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 bg-gray-100 rounded-lg">
                                        Previous
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button type="button" onClick={() => setStep(step + 1)} className="px-6 py-3 bg-blue-900 text-white rounded-lg">
                                        Next
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} className="px-6 py-3 bg-blue-900 text-white rounded-lg">
                                        Submit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
