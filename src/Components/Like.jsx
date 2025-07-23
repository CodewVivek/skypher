import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Like = ({ projectId }) => {
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [user, setUser] = useState(null);
    const [animateRocket, setAnimateRocket] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndLike = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: likedData } = await supabase
                    .from('project_likes')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('project_id', projectId)
                    .maybeSingle();
                setLiked(!!likedData);
            } else {
                setLiked(false);
            }
        };

        const fetchLikes = async () => {
            const { count } = await supabase
                .from('project_likes')
                .select('id', { count: 'exact', head: true })
                .eq('project_id', projectId);
            setCount(count || 0);
        };

        fetchUserAndLike();
        fetchLikes();
    }, [projectId]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/UserRegister');
            return;
        }

        if (liked) {
            await supabase
                .from('project_likes')
                .delete()
                .eq('user_id', user.id)
                .eq('project_id', projectId);
            setLiked(false);
            setCount(count - 1);
        } else {
            await supabase
                .from('project_likes')
                .insert([{ user_id: user.id, project_id: projectId }]);
            setLiked(true);
            setCount(count + 1);
            setAnimateRocket(true); // trigger rocket animation
            setTimeout(() => setAnimateRocket(false), 800); // reset after 800ms
        }
    };

    return (

        <div className="flex items-center gap-2 transition-all duration-200">
            <button
                onClick={handleLike}
                className={`group relative p-2 rounded-full shadow-sm 
            transition-transform duration-300 focus:outline-none
            hover:scale-110 hover:bg-red-100
            ${liked ? 'bg-red-100' : 'bg-white'}`}

            >
                <Rocket
                    className={`
                w-6 h-6 stroke-red-500 transition-all duration-200 
                group-hover:scale-110 
                ${liked ? 'animate-launch' : ''}
            `}
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {liked ? 'Boosted' : 'Boost'}
                </div>

            </button>
            <span className="text-lg font-medium text-gray-700 ">{count}</span>
        </div>

    );
};

export default Like;
