import { useEffect, useState } from "react";
import React from "react";
import { CalendarDays, Newspaper, UserSearch, AlertTriangle } from "lucide-react";

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWSDATA_API_KEY}&category=technology,science,business&language=en`)
            .then((res) => res.json())
            .then((data) => {
                const articles = data.results || [];
                setArticles(articles.slice(0, 9));
                setLoading(false);
            })
            .catch((error) => {
                console.error("error in news fetching", error);
                setError("Failed to load news. Please try again later.");
                setLoading(false);
            });
    }, []);

    const formatDate = (datestring) => {
        return new Date(datestring).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen m-10">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-10 text-center mt-20">
                📰 Latest Tech, Startup, and Software News....
            </h1>


            {loading && (
                <div className="text-lg text-center font-medium text-gray-500">
                    Loading news articles...
                </div>
            )}


            {error && (
                <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-6 border border-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}


            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden transition hover:shadow-2xl duration-300 flex flex-col"
                        >

                            <img
                                src={article.image_url || "https://via.placeholder.com/400x200.png?text=No+Image+Available"}
                                alt="Article"
                                className="w-full h-48 object-cover"
                            />

                            <div className="p-5 flex flex-col justify-between flex-grow">

                                <h2 className="text-xl font-bold mb-2 text-gray-900">
                                    {article.title}
                                </h2>

                                {/* Description */}
                                <p className="text-gray-700 text-sm mb-3 font-medium">
                                    {article.description ? (
                                        <>
                                            {article.description.slice(0, 200)}...
                                            <a
                                                href={article.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 text-sm ml-1 underline"
                                            >
                                                View article for more info
                                            </a>
                                        </>
                                    ) : (
                                        <span className="text-gray-400">No description available</span>
                                    )}
                                </p>


                                <div className="text-sm text-gray-600 space-y-1 mb-4">
                                    <div className="flex items-center gap-1">
                                        <CalendarDays className="w-4 h-4" />
                                        {formatDate(article.pubDate)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Newspaper className="w-4 h-4" />
                                        {article.source_id || "Unknown Source"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <UserSearch className="w-4 h-4" />
                                        {article.creator || "Unknown Author"}
                                    </div>
                                </div>


                                <button
                                    className="mt-auto bg-blue-700 hover:bg-blue-800 text-white text-sm py-2 px-4 rounded transition w-full font-semibold"
                                    onClick={() =>
                                        window.open(article.link, "_blank", "noopener,noreferrer")
                                    }
                                >
                                    🔗 Read Full Article
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
            <div className="mt-10 text-justify text-red-700">
                ⚠️ Disclaimer: The news content displayed on this platform is fetched from third-party sources (e.g., NewsData.io). We do not take responsibility for the accuracy, completeness, or reliability of any information presented. We do not endorse or support any views, opinions, or representations expressed in the articles. Users are advised to verify information independently.
            </div>
        </div >
    );
};

export default News;
