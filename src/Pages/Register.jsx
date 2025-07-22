import React, { useState, useCallback, useEffect } from 'react';
import { Plus, X, Upload, User, Star } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { supabase } from '../supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { nanoid } from 'nanoid';
import Snackbar from '@mui/material/Snackbar';
import categoryOptions from '../Components/categoryOptions';

function getLinkType(url) {
    if (!url) return { label: 'Website', icon: '🌐' };
    if (url.includes('youtube.com') || url.includes('youtu.be')) return { label: 'YouTube', icon: '▶️' };
    if (url.includes('instagram.com')) return { label: 'Instagram', icon: '📸' };
    if (url.includes('play.google.com')) return { label: 'Play Store', icon: '🤖' };
    if (url.includes('apps.apple.com')) return { label: 'App Store', icon: '🍎' };
    if (url.includes('linkedin.com')) return { label: 'LinkedIn', icon: '💼' };
    if (url.includes('twitter.com') || url.includes('x.com')) return { label: 'Twitter/X', icon: '🐦' };
    if (url.includes('facebook.com')) return { label: 'Facebook', icon: '📘' };
    return { label: 'Website', icon: '🌐' };
}

const isValidUrl = (string) => {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
};

const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const Register = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState(null);
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formError, setFormError] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [urlError, setUrlError] = useState('');
    const [showAutoSave, setShowAutoSave] = useState(false);
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [loadingProject, setLoadingProject] = useState(false);
    const [existingMediaUrls, setExistingMediaUrls] = useState([]);
    const [existingLogoUrl, setExistingLogoUrl] = useState('');
    const [editingLaunched, setEditingLaunched] = useState(false);
    const [projectLoaded, setProjectLoaded] = useState(false);

    //validate wheather user entered url is url or not 
    const handleUrlBlur = (e) => {
        const { value } = e.target;
        if (value && !isValidUrl(value)) {
            setUrlError('Please enter a valid URL (e.g., https://example.com)');
        } else {
            setUrlError('');
        }
    };

    //links of launches (optional step)
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

    const [formData, setFormData] = useState({
        name: '',
        websiteUrl: '',
        description: '',
        tagline: '',
        categoryOptions: '',
    });
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        setFormError('');
    };

    //media code
    const [files, setFiles] = useState([]);
    const MAX_FILE_SIZE = 5242880; // 5 MB in bytes
    const MAX_FILES = 3;

    function formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // Utility to sanitize file names for Supabase Storage
    function sanitizeFileName(name) {
        // Replace all whitespace (including unicode) and special characters with underscores
        return name.replace(/[^a-zA-Z0-9._-]/g, '_');
    }

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
        setUploadError('');
    }, []);

    const onDropRejected = (fileRejections) => {
        let message = '';
        fileRejections.forEach(rejection => {
            rejection.errors.forEach(err => {
                if (err.code === "file-too-large") {
                    message = "Each file must be smaller than 5.0 MB.";
                }
                if (err.code === "too-many-files") {
                    message = "You can only upload up to 3 files.";
                }
                if (err.code === "file-invalid-type") {
                    message = "Invalid file type. Please upload images or PDFs only.";
                }
            });
        });
        setUploadError(message);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf']
        },
        maxSize: MAX_FILE_SIZE,
        maxFiles: MAX_FILES
    });
    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    // Logo upload state
    const [logoFile, setLogoFile] = useState(null);
    const [logoError, setLogoError] = useState('');

    // Logo upload handler
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            setLogoError('Logo must be JPG, PNG, or GIF.');
            setLogoFile(null);
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setLogoError('Logo must be less than 2MB.');
            setLogoFile(null);
            return;
        }
        setLogoFile(file);
        setLogoError('');
    };

    // Description word count state
    const [descriptionWordCount, setDescriptionWordCount] = useState(0);
    const DESCRIPTION_WORD_LIMIT = 260;

    // Description input handler with word limit
    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        const words = value.trim().split(/\s+/).filter(Boolean);
        if (words.length <= DESCRIPTION_WORD_LIMIT) {
            setFormData({ ...formData, description: value });
            setDescriptionWordCount(words.length);
        } else {
            // Only allow up to the word limit
            const limited = words.slice(0, DESCRIPTION_WORD_LIMIT).join(' ');
            setFormData({ ...formData, description: limited });
            setDescriptionWordCount(DESCRIPTION_WORD_LIMIT);
        }
    };

    // Add taglineCharCount state
    const [taglineCharCount, setTaglineCharCount] = useState(0);

    // Update tagline input onChange handler in Step 1:
    const handleTaglineChange = (e) => {
        setFormData({ ...formData, tagline: e.target.value.slice(0, 60) });
        setTaglineCharCount(e.target.value.length > 60 ? 60 : e.target.value.length);
    };

    //supabase 
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser(); //get user from supabase
            if (!user) { //if not signed up then make them to sign up
                setFormError('Please sign in to submit a project');
                navigate('/UserRegister');
                return;
            }
            setUser(user);
        };
        checkUser();
    }, [navigate]);

    // Load existing project data for editing
    useEffect(() => {
        const loadProjectForEditing = async () => {
            const editId = searchParams.get('edit');
            const draftId = searchParams.get('draft');
            const projectId = editId || draftId;

            if (projectId && user && !projectLoaded) {
                setLoadingProject(true);
                setIsEditing(true);
                setEditingProjectId(projectId);

                try {
                    const { data: project, error } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('id', projectId)
                        .eq('user_id', user.id) // Ensure user owns the project
                        .single();

                    if (error) {
                        console.error('Error loading project:', error);
                        setFormError('Project not found or access denied.');
                        return;
                    }

                    if (project) {
                        setEditingLaunched(project.status !== 'draft');
                        // Pre-fill form with existing data
                        setFormData({
                            name: project.name || '',
                            websiteUrl: project.website_url || '',
                            description: project.description || '',
                            tagline: project.tagline || '',
                        });
                        // Set category if it exists
                        if (project.category_type) {
                            const categoryOption = categoryOptions.flatMap(group => group.options).find(option => option.value === project.category_type);
                            setSelectedCategory(categoryOption || null);
                        }
                        // Set links if they exist
                        if (project.links && project.links.length > 0) {
                            setLinks(project.links);
                        } else {
                            setLinks(['']);
                        }
                        // Always start on step 1 for editing, just like new project
                        setStep(1);
                        if (project.media_urls && project.media_urls.length > 0) {
                            console.log('Project has existing media:', project.media_urls);
                        }
                        if (project.logo_url) {
                            console.log('Project has existing logo:', project.logo_url);
                        }
                        // Set existing media and logo URLs
                        setExistingMediaUrls(project.media_urls || []);
                        setExistingLogoUrl(project.logo_url || '');
                    }
                } catch (error) {
                    console.error('Error loading project for editing:', error);
                    setFormError('Failed to load project for editing.');
                } finally {
                    setLoadingProject(false);
                    setProjectLoaded(true);
                }
            }
        };
        if (user && !projectLoaded) {
            loadProjectForEditing();
        }
    }, [user, projectLoaded]);

    // Auto-save to localStorage
    useEffect(() => {
        if (!isEditing) {
            const savedDraft = localStorage.getItem('launch_draft');
            if (savedDraft) {
                try {
                    const draft = JSON.parse(savedDraft);
                    setFormData(draft.formData || {});
                    setSelectedCategory(draft.selectedCategory || null);
                    setLinks(draft.links || ['']);
                    setStep(draft.step || 1);
                } catch { }
            }
        }
    }, [isEditing]);

    useEffect(() => {
        // Save to localStorage on form change, but do not show Snackbar here
        const draft = {
            formData,
            selectedCategory,
            links,
            step
        };
        localStorage.setItem('launch_draft', JSON.stringify(draft));
    }, [formData, selectedCategory, links, step]);

    // Validation functions for submit only
    const validateStep1 = () => {
        if (!editingLaunched && (!formData.name || !formData.websiteUrl)) {
            setFormError('Please fill in all required fields in Basic Info (Step 1).');
            return false;
        }
        if (!formData.description || !formData.tagline || !selectedCategory) {
            setFormError('Please fill in all required fields in Basic Info (Step 1).');
            return false;
        }
        setFormError('');
        return true;
    };
    const validateStep3 = () => {
        if (files.length === 0 && existingMediaUrls.length === 0) {
            setUploadError('Please upload at least one media file (Step 3).');
            return false;
        }
        setUploadError('');
        return true;
    };
    const validateLogo = () => {
        if (!logoFile && !existingLogoUrl) {
            setLogoError('Please upload a logo (Step 3).');
            return false;
        }
        setLogoError('');
        return true;
    };

    // Utility: Check if form is empty (no required fields filled)
    const isFormEmpty = () => {
        return !formData.name && !formData.tagline && !formData.description && !formData.websiteUrl && !selectedCategory;
    };

    //submission handle with media and all other form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setUploadError('');
        // Only validate on submit
        const valid1 = validateStep1();
        const valid3 = validateStep3();
        const validLogo = validateLogo();
        if (!valid1 || !valid3 || !validLogo) return;
        if (!user) {
            setFormError('Please sign in to submit a project');
            navigate('/UserRegister');
            return;
        }
        const submissionData = {
            name: formData.name,
            website_url: formData.websiteUrl,
            tagline: formData.tagline,
            description: formData.description,
            category_type: selectedCategory?.value,
            links: links.filter(link => link.trim() !== ''),
            created_at: new Date().toISOString(),
            user_id: user.id,
            updated_at: new Date().toISOString(),
            status: 'launched',
        };
        // Generate unique slug
        const baseSlug = slugify(formData.name);
        const uniqueSlug = `${baseSlug}-${nanoid(6)}`;
        submissionData.slug = uniqueSlug;
        //media into supabase bucket 
        try {
            let fileUrls = [...existingMediaUrls]; // Start with existing media
            if (files.length > 0) {
                const uploadPromises = files.map(async (file, index) => {
                    const uniqueTimestamp = Date.now() + index;
                    const filePath = `${uniqueTimestamp}-${sanitizeFileName(file.name)}`;
                    const { data, error } = await supabase.storage
                        .from('startup-media')
                        .upload(filePath, file);
                    if (error) throw error;
                    const { data: urlData } = supabase.storage.from('startup-media').getPublicUrl(filePath);
                    return urlData.publicUrl;
                });
                const newFileUrls = await Promise.all(uploadPromises);
                fileUrls = [...fileUrls, ...newFileUrls];
            }
            submissionData.media_urls = fileUrls;
            // Logo upload
            let logoUrl = existingLogoUrl;
            if (logoFile) {
                const logoPath = `${Date.now()}-logo-${sanitizeFileName(logoFile.name)}`;
                const { data: logoData, error: logoErrorUpload } = await supabase.storage
                    .from('startup-media')
                    .upload(logoPath, logoFile);
                if (logoErrorUpload) throw logoErrorUpload;
                const { data: logoUrlData } = supabase.storage.from('startup-media').getPublicUrl(logoPath);
                logoUrl = logoUrlData.publicUrl;
            }
            submissionData.logo_url = logoUrl;

            if (isEditing && editingProjectId) {
                // Always update the existing project (draft or launched)
                submissionData.status = 'launched';
                const { data, error } = await supabase
                    .from('projects')
                    .update(submissionData)
                    .eq('id', editingProjectId);
                if (error) throw error;
                console.log('Project updated:', data);
                if (data && data[0]) {
                    console.log('Updated project status:', data[0].status);
                }
                navigate('/');
                return;
            } else {
                // Only for brand new projects
                submissionData.status = 'launched';
                const { data, error } = await supabase
                    .from('projects')
                    .insert([submissionData]);
                if (error) throw error;
            }

            setFormData({
                name: '',
                websiteUrl: '',
                description: '',
                tagline: '',
            });
            setSelectedCategory(null);
            setLinks(['']);
            setFiles([]);
            setLogoFile(null);
            setStep(1);
            setFormError('');
            setUploadError('');
            setLogoError('');
            setIsEditing(false);
            setEditingProjectId(null);
            navigate('/');
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormError('Failed to register startup. Please try again.');
        }
    };

    //ai generated content for submission
    const handleGenerateLaunchData = async () => {
        if (!formData.websiteUrl) {
            setFormError("Please enter a website URL first.");
            return;
        }
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData?.user?.id;
            const res = await fetch(import.meta.env.VITE_API_URL + "/generatelaunchdata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: formData.websiteUrl,
                    user_id,
                }),
            });
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

            setFormError('');
        }
        catch (error) {
            console.error("Auto Generate failed :", error);
            setFormError("AI failed to extract startup info...");
        }
    }

    // Save as Draft handler
    const handleSaveDraft = async () => {
        setFormError('');
        if (!user) {
            setFormError('Please sign in to save');
            navigate('/UserRegister');
            return;
        }
        // Do not save if form is empty
        if (isFormEmpty()) {
            setFormError('Cannot save an empty draft.');
            return;
        }
        // Do not save as draft if editing a launched project
        if (isEditing && editingLaunched) {
            setFormError('Cannot save launched project as draft.');
            return;
        }
        if (!formData.name) {
            setFormError('Please enter a project name before saving.');
            return;
        }
        const draftData = {
            name: formData.name,
            website_url: formData.websiteUrl || '',
            tagline: formData.tagline || '',
            description: formData.description || '',
            category_type: selectedCategory?.value || '',
            links: links.filter(link => link.trim() !== ''),
            created_at: new Date().toISOString(),
            user_id: user.id,
            status: 'draft',
            slug: slugify(formData.name) + '-' + nanoid(6),
            media_urls: [] // Optionally save media if you want
        };
        console.log('Saving draft:', draftData);
        try {
            const { error } = await supabase
                .from('projects')
                .insert([draftData]);
            if (error) throw error;
            setShowDraftSaved(true);
        } catch (error) {
            setFormError('Failed to save draft. Please try again.');
            console.error('Supabase error:', error);
        }
    };

    // In the Next button handler, update draft if editing, otherwise insert
    const handleNext = async () => {
        // Save current progress as draft before moving to next step
        if (user && formData.name) {
            if (isEditing && editingLaunched) {
                setStep(step + 1);
                return;
            }
            // Do not save if form is empty
            if (isFormEmpty()) {
                setStep(step + 1);
                return;
            }
            try {
                const draftData = {
                    name: formData.name,
                    website_url: formData.websiteUrl || '',
                    tagline: formData.tagline || '',
                    description: formData.description || '',
                    category_type: selectedCategory?.value || '',
                    links: links.filter(link => link.trim() !== ''),
                    created_at: new Date().toISOString(),
                    user_id: user.id,
                    status: 'draft',
                    updated_at: new Date().toISOString(),
                    media_urls: [...existingMediaUrls],
                };
                let draftId = editingProjectId;
                // If not editing, check for an existing draft with same name and user
                if (!isEditing) {
                    const { data: existingDraft, error: findError } = await supabase
                        .from('projects')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('name', formData.name)
                        .eq('status', 'draft')
                        .maybeSingle();
                    if (findError) {
                        console.error('Error checking for existing draft:', findError);
                    }
                    if (existingDraft && existingDraft.id) {
                        draftId = existingDraft.id;
                    }
                }
                if (isEditing && editingProjectId && !editingLaunched) {
                    // Update existing draft
                    const { error } = await supabase
                        .from('projects')
                        .update(draftData)
                        .eq('id', editingProjectId);
                    if (error) {
                        console.error('Error updating draft:', error);
                    } else {
                        setShowDraftSaved(true);
                    }
                } else if (draftId) {
                    // Update found draft
                    const { error } = await supabase
                        .from('projects')
                        .update(draftData)
                        .eq('id', draftId);
                    if (error) {
                        console.error('Error updating draft:', error);
                    } else {
                        setShowDraftSaved(true);
                    }
                } else {
                    // Insert new draft
                    draftData.slug = slugify(formData.name) + '-' + nanoid(6);
                    const { error } = await supabase
                        .from('projects')
                        .insert([draftData]);
                    if (error) {
                        console.error('Error saving draft:', error);
                    } else {
                        setShowDraftSaved(true);
                    }
                }
            } catch (error) {
                console.error('Error saving draft:', error);
            }
        }
        setStep(step + 1);
    };

    // Remove existing media/logo handlers
    const handleRemoveExistingMedia = (url) => {
        setExistingMediaUrls(existingMediaUrls.filter(u => u !== url));
    };
    const handleRemoveExistingLogo = () => {
        setExistingLogoUrl('');
    };

    if (loadingProject) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <div className="container-custom py-12">
                <div className="max-w-2xl mx-auto mt-15">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {isEditing && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                    {searchParams.get('draft') ? 'Continue Editing Draft' : 'Editing Project'}
                                </h3>
                                <p className="text-blue-600 text-sm">
                                    {searchParams.get('draft')
                                        ? 'Complete your draft and submit it to launch your project.'
                                        : 'Make changes to your launched project.'}
                                </p>
                            </div>
                        )}
                        <Snackbar
                            open={!!(formError || uploadError)}
                            autoHideDuration={4000}
                            onClose={() => { setFormError(''); setUploadError(''); }}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            sx={{ mt: '70px' }}
                        >
                            <Alert
                                onClose={() => { setFormError(''); setUploadError(''); }}
                                severity="warning"
                                sx={{ width: '100%' }}
                            >
                                {formError || uploadError}
                            </Alert>
                        </Snackbar>
                        {/* Snackbar for auto-save */}
                        <Snackbar open={showAutoSave} autoHideDuration={1200} onClose={() => setShowAutoSave(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ mt: '70px' }}>
                            <Alert severity="info" sx={{ width: '100%' }}>Progress auto-saved locally</Alert>
                        </Snackbar>
                        {/* Snackbar for draft saved */}
                        <Snackbar open={showDraftSaved} autoHideDuration={3000} onClose={() => setShowDraftSaved(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ mt: '70px' }}>
                            <Alert severity="success" sx={{ width: '100%' }}>Launch saved!</Alert>
                        </Snackbar>
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
                        {step === 1 && (
                            <>
                                <h3 className="text-lg font-semibold mb-6">Tell us more about this launch</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Startup Name */}
                                    <div>
                                        <label className="block font-medium mb-1">Startup Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            maxLength={30}
                                        />
                                    </div>
                                    {/* Website URL */}
                                    <div>
                                        <label className="block font-medium mb-1">Website URL</label>
                                        <input
                                            name="websiteUrl"
                                            value={formData.websiteUrl}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://yourproject.com"
                                        />
                                    </div>
                                    {/* Tagline */}
                                    <div>
                                        <label className="block font-medium mb-1">Tagline</label>
                                        <input
                                            name="tagline"
                                            value={formData.tagline}
                                            onChange={handleTaglineChange}
                                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            maxLength={60}
                                        />
                                        <div className="text-xs text-gray-400 text-right">{taglineCharCount} / 60</div>
                                    </div>
                                    {/* Category(ies) */}
                                    <div>
                                        <label className="block font-semibold mb-1">Category(ies)</label>
                                        <Select
                                            options={categoryOptions}
                                            isClearable={isClearable}
                                            isSearchable={isSearchable}
                                            value={selectedCategory}
                                            onChange={setSelectedCategory}
                                            className="max-w-md"
                                        />
                                    </div>
                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block font-semibold mb-1 mt-6">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleDescriptionChange}
                                            rows={4}
                                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            placeholder="Describe your startup"
                                        />
                                        <div className="text-xs text-gray-400 text-right">{descriptionWordCount} / {DESCRIPTION_WORD_LIMIT}</div>
                                    </div>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <div className="space-y-4">
                                <label className="block text-lg font-semibold text-gray-700">Links</label>
                                {links.map((link, index) => {
                                    const { label, icon } = getLinkType(link);
                                    return (
                                        <div key={index} className="flex items-center space-x-2">
                                            <span className="min-w-[90px] flex items-center gap-1 text-gray-500">
                                                <span>{icon}</span>
                                                <span>{label}</span>
                                            </span>
                                            <input
                                                type="url"
                                                value={link}
                                                onChange={e => updateLink(index, e.target.value)}
                                                placeholder={`Enter ${label} URL`}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                            {links.length > 1 && (
                                                <button type="button" onClick={() => removeLink(index)} className="p-2 text-red-600">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <button type="button" onClick={addLink} className="flex items-center text-blue-900">
                                    <Plus className="w-5 h-5 mr-1" />
                                    Add another link
                                </button>
                            </div>
                        )}
                        {step === 3 && (
                            <form onSubmit={e => {
                                e.preventDefault();
                                const valid1 = validateStep1();
                                const valid3 = validateStep3();
                                const validLogo = validateLogo();
                                if (valid1 && valid3 && validLogo) handleSubmit(e);
                            }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                className="space-y-6">
                                <div className="space-y-6">
                                    {/* Logo upload */}
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                                            Logo
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Recommended size: 240x240 | JPG, PNG, GIF. Max size: 2MB
                                        </p>
                                        {/* Show existing logo preview if editing and logo exists */}
                                        {existingLogoUrl && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img
                                                    src={existingLogoUrl}
                                                    alt="Logo preview"
                                                    className="w-24 h-24 object-contain rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveExistingLogo}
                                                    className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={handleLogoChange}
                                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {logoFile && (
                                            <div className="mt-2">
                                                <img
                                                    src={URL.createObjectURL(logoFile)}
                                                    alt="Logo preview"
                                                    className="w-24 h-24 object-contain rounded border"
                                                />
                                            </div>
                                        )}
                                        {logoError && (
                                            <p className="text-red-500 text-sm mt-1">{logoError}</p>
                                        )}
                                    </div>
                                    {/* Media upload */}
                                    {/* Show existing media previews if editing */}
                                    {existingMediaUrls.length > 0 && (
                                        <div className="mb-2 flex flex-wrap gap-4">
                                            {existingMediaUrls.map((url, idx) => (
                                                <div key={idx} className="relative group">
                                                    {/* Show image or file icon */}
                                                    {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                        <img src={url} alt="Media preview" className="w-24 h-24 object-cover rounded border" />
                                                    ) : (
                                                        <a href={url} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">File</a>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingMedia(url)}
                                                        className="absolute top-1 right-1 bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs opacity-80 group-hover:opacity-100"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                                            Upload Media
                                            <span className="text-red-500 ml-1  w-auto h-auto">*</span>
                                        </label>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Add images, logos, or other media files (max {formatBytes(MAX_FILE_SIZE)} each, up to {MAX_FILES} files)
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">1270x760px or higher recommended. The first image will be used as preview.</p>
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
                                                                ({(file.size / 1024 / 1024).toFixed(3)} MB)
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
                                <div className="flex justify-between mt-8 pt-4 border-t">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="px-6 py-3 bg-gray-100 rounded-lg"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveDraft}
                                            className="px-6 py-3 bg-yellow-500 text-white rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-blue-900 text-white rounded-lg"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                        {step < 3 && (
                            <div className="flex justify-between mt-8 pt-4 border-t">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="px-6 py-3 bg-gray-100 rounded-lg"
                                    >
                                        Previous
                                    </button>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSaveDraft}
                                        className="px-6 py-3 bg-yellow-500 text-white rounded-lg"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-6 py-3 bg-blue-900 text-white rounded-lg"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
