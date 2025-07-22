import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Clock, RefreshCw, TrendingUp, Newspaper } from 'lucide-react';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try NewsData API first
            const newsDataApiKey = import.meta.env.VITE_NEWSDATA_API_KEY;

            if (newsDataApiKey) {
                try {
                    const newsDataUrl = `https://newsdata.io/api/1/news?apikey=${newsDataApiKey}&q=startup+technology&language=en&size=10`;
                    const response = await fetch(newsDataUrl);

                    if (response.ok) {
                        const data = await response.json();

                        if (data.status === 'success' && data.results && data.results.length > 0) {
                            const articles = data.results.map(article => ({
                                title: article.title,
                                description: article.description,
                                url: article.link,
                                publishedAt: article.pubDate,
                                source: { name: article.source_id || 'NewsData' },
                                image: article.image_url
                            }));

                            setNews(articles);
                            setSource('NewsData API');
                            return;
                        }
                    }
                } catch (err) {
                    console.log('NewsData API failed, trying fallback...');
                }

            }
            setNews([]);
            // If no API key or API call fails, set an error
            setError("Failed to fetch news. Please check your API key or try again later.");
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return formatDate(dateString);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto py-12 px-4">
                {/* Header Section */}
                <div className="text-center mb-12 mt-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
                        <Newspaper className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h1>
                    <p className="text-lg text-gray-600 mb-6">Stay up to date with the latest startup news, tech trends, and industry insights.</p>

                    {source && (
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Source: {source}</span>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Newspaper className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-red-800">Unable to Load News</h3>
                        </div>
                        <button
                            onClick={fetchNews}
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                )}
                {!error && news.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Startup & Tech News</h2>
                            <button
                                onClick={fetchNews}
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.map((article, index) => (
                                <article key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    {article.image && (
                                        <div className="mb-4">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {article.title}
                                            </a>
                                        </h3>
                                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                                    </div>

                                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                        {article.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {getTimeAgo(article.publishedAt)}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs">
                                            {article.source?.name || 'Unknown Source'}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;