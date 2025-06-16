import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import Select from 'react-select';
import { supabase } from '../supabaseClient';


registerPlugin(FilePondPluginImagePreview);

const Register = () => {

    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categoryOptions = [
        { value: 'fintech', label: '💸 Fintech' },
        { value: 'healthtech', label: '🏥 Healthtech' },
        { value: 'ai', label: '🤖 AI' },
        { value: 'ecommerce', label: '🛍️ E-commerce' },
        { value: 'edtech', label: '🎓 Edtech' },
        { value: 'greentech', label: '🌱 GreenTech' },
        { value: 'blockchain', label: '⛓️ Blockchain' },
        { value: 'saas', label: '☁️ SaaS' },
        { value: 'proptech', label: '🏡 PropTech' },
        { value: 'insurtech', label: '🛡️ InsurTech' },
        { value: 'foodtech', label: '🍔 FoodTech' },
        { value: 'traveltech', label: '✈️ TravelTech' },
        { value: 'logistics', label: '🚚 Logistics' },
        { value: 'agritech', label: '🌾 AgriTech' },
        { value: 'medtech', label: '💊 MedTech' },
        { value: 'cybersecurity', label: '🔒 Cybersecurity' },
        { value: 'iot', label: '📡 IoT' },
        { value: 'gaming', label: '🎮 Gaming' },
        { value: 'entertainment', label: '🎬 Entertainment' },
        { value: 'social', label: '👥 Social Media' },
        { value: 'legaltech', label: '⚖️ LegalTech' },
        { value: 'fashiontech', label: '👗 FashionTech' },
        { value: 'hrtech', label: '👔 HRTech' },
        { value: 'climatetech', label: '🌎 ClimateTech' },
        { value: 'biotech', label: '🧬 BioTech' },
        { value: 'nanotech', label: '🔬 NanoTech' },
        { value: 'edutainment', label: '📚🎮 Edutainment' },
        { value: 'adtech', label: '📈 AdTech' },

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




    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name || !formData.websiteUrl || !formData.description || !selectedCategory) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Prepare the data
        const submissionData = {
            ...formData,
            category: selectedCategory?.value,
            teamMembers: teamEmails,
            links: links.filter(link => link.trim() !== ''),
            files: files.map(file => file.file),
            createdAt: new Date().toISOString()
        };

        try {
            // Upload files to Supabase storage if there are any
            let fileUrls = [];
            if (files.length > 0) {
                const uploadPromises = files.map(async (file) => {
                    const uniqueTimestamp = Date.now() + index;
                    const filePath = `${uniqueTimestamp}-${file.file.name}`;
                    const { data, error } = await supabase.storage
                        .from('startup-media')
                        .upload(filePath, file.file);

                    if (error) throw error;
                    const { data: urlData } = supabase.storage.from('startup-media').getPublicUrl(filePath);
                    return urlData.publicUrl;
                });

                fileUrls = await Promise.all(uploadPromises);
            }

            // Add file URLs to submission data
            submissionData.fileUrls = fileUrls;

            // Insert data into Supabase
            const { data, error } = await supabase
                .from('projects')
                .insert([submissionData]);

            if (error) throw error;

            toast.success('Startup registered successfully!');
            // Reset form or redirect
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

        } catch (error) {
            console.error('Error submitting form:', error);
            console.log('Error submitting form:', error);
            toast.error('Failed to register startup. Please try again.');
        }
    };
    const [step, setStep] = useState(1);

    return (
        <>

            <div className="container-custom py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {[1, 2, 3, 4].map((stepNumber) => (
                                    <div key={stepNumber} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                      ${step >= stepNumber ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-gray-300 text-gray-400'}`}
                                        >
                                            {stepNumber}
                                        </div>
                                        <span className={`mt-2 text-sm ${step >= stepNumber ? 'text-blue-900' : 'text-gray-400'}`}>
                                            {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Details' : stepNumber === 3 ? 'Team' : 'Media'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="relative mt-4">
                                <div className="absolute top-0 left-0 h-1 bg-blue-900" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                                <div className="h-1 bg-gray-200 w-full" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <>
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
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Website URL</label>
                                        <input
                                            type="url"
                                            name="websiteUrl"
                                            value={formData.websiteUrl}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="https://example.com"
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
                                </>
                            )}

                            {step === 2 && (
                                <>
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
                                </>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
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
                                </div>

                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Media</label>
                                        <p className="text-sm text-gray-500 mb-4">Add images, logos, or other media files</p>
                                        <FilePond
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={true}
                                            maxFiles={5}
                                            name="files"
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between mt-8 pt-4 border-t">
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 bg-gray-100 rounded-lg">
                                        Previous
                                    </button>
                                )}
                                {step < 4 ? (
                                    <button type="button" onClick={() => setStep(step + 1)} className="px-6 py-3 bg-blue-900 text-white rounded-lg">
                                        Next
                                    </button>
                                ) : (
                                    <button type="submit" className="px-6 py-3 bg-blue-900 text-white rounded-lg">
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
