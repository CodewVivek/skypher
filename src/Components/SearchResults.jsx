import React, { useState } from "react";
import { Search, X, Loader2, User, Rocket, Tag, ExternalLink, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ isOpen, onClose, searchResults, isSearching, searchQuery }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");

    if (!isOpen) return null;

    const handleResultClick = (type, item) => {
        if (type === 'project') {
            navigate(`/launches/${item.slug}`);
        } else if (type === 'user') {
            navigate(`/profile/${item.username}`);
        } else if (type === 'category') {
            // Navigate to category page or filter by category
            navigate(`/?category=${encodeURIComponent(item)}`);
        }
        onClose();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const totalResults = (searchResults.projects?.length || 0) +
        (searchResults.users?.length || 0) +
        (searchResults.categories?.length || 0);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-gray-500" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Search Results for "{searchQuery}"
                        </h2>
                        {isSearching && (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
                    {isSearching ? (
                        <div className="p-6 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Searching...</p>
                        </div>
                    ) : totalResults === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No results found</p>
                            <p className="text-sm mt-2">Try different keywords or check your spelling.</p>
                        </div>
                    ) : (
                        <div className="p-4">
                            {/* Tabs */}
                            <div className="flex gap-1 mb-4 border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "all"
                                            ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    All ({totalResults})
                                </button>
                                {searchResults.projects?.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab("projects")}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "projects"
                                                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Projects ({searchResults.projects.length})
                                    </button>
                                )}
                                {searchResults.users?.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab("users")}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "users"
                                                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Users ({searchResults.users.length})
                                    </button>
                                )}
                                {searchResults.categories?.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab("categories")}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "categories"
                                                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Categories ({searchResults.categories.length})
                                    </button>
                                )}
                            </div>

                            {/* Results */}
                            <div className="space-y-4">
                                {/* Projects */}
                                {(activeTab === "all" || activeTab === "projects") && searchResults.projects?.length > 0 && (
                                    <div>
                                        {activeTab === "all" && <h3 className="text-sm font-semibold text-gray-700 mb-2">Projects</h3>}
                                        <div className="space-y-2">
                                            {searchResults.projects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    onClick={() => handleResultClick('project', project)}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Rocket className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                                                        <p className="text-sm text-gray-500 truncate">{project.tagline}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Tag className="w-3 h-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500 capitalize">{project.category_type}</span>
                                                            <Calendar className="w-3 h-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">{formatDate(project.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Users */}
                                {(activeTab === "all" || activeTab === "users") && searchResults.users?.length > 0 && (
                                    <div>
                                        {activeTab === "all" && <h3 className="text-sm font-semibold text-gray-700 mb-2">Users</h3>}
                                        <div className="space-y-2">
                                            {searchResults.users.map((user) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => handleResultClick('user', user)}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        {user.avatar_url ? (
                                                            <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                                        ) : (
                                                            <span className="text-white text-sm font-medium">
                                                                {user.username?.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate">@{user.username}</h4>
                                                        <p className="text-sm text-gray-500 truncate">{user.full_name}</p>
                                                    </div>
                                                    <User className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Categories */}
                                {(activeTab === "all" || activeTab === "categories") && searchResults.categories?.length > 0 && (
                                    <div>
                                        {activeTab === "all" && <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories</h3>}
                                        <div className="space-y-2">
                                            {searchResults.categories.map((category, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => handleResultClick('category', category)}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Tag className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
                                                        <p className="text-sm text-gray-500">Browse projects in this category</p>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults; 