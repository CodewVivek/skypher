import { useEffect, useState } from "react"
import React from 'react';

const News = () => {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        fetch(`  https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWSDATA_API_KEY}&category=technology,science,business&language=en`)

            .then(res => res.json())
            .then(data => {
                const articles = data.results || [];
                setArticles(articles.slice(0, 9));
            })
            .catch(error => console.error("error in news fetching", error))
    }, [])
    const [showFullDescription, setshowFullDescription] = useState(false);


    return (
        <>
            <div className='min-h-screen m-20'>
                <div className="text-2xl font-black mb-10">
                    News Here Latest ABout Tech Startup and Many More...
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <div key={index} className="font-bold bg-white shadow-2xl mb-4 mr-4">
                            <div className="text-2xl" >
                                {article.title}
                            </div>

                            <a className="text-md" target="_blank" rel="noopener noreferrer" href={article.link}>
                                {article.description.slice(0, 210)}...<span className="text-blue-500 text-sm " >View article for more information</span>
                            </a>

                            {article.image_url && (
                                <div className="p-2">
                                    <img src={article.image_url || 'no image For This Article'} />
                                </div>
                            )}
                            <div>
                              
                                <span>{article.pubDate}</span><br />
                                <span>{article.source_id}</span><br />
                                <span>{article.category}</span><br />
                                <span>{article.creator}</span><br />
                                <button className="p-2 bg-red-800 text-white" onClick={() => window.open(article.link, '_blank', 'noopener,noreferrer')}>
                                    View Article
                                </button>
                            </div>
                        </div>

                    ))}

                </div>
            </div >

        </>
    )
}

export default News;
