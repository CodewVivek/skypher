import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Like = ({ projectId }) => {
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [user, setUser] = useState(null);
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
        }
    };

    return (
        <div>
            <div className='flex gap-2 hover:border-red-900 transition-all duration-150 items-center'>
                <button
                    onClick={handleLike}
                    className={`transition-all duration-150 rounded-full p-2 
                        ${liked ? 'bg-white' : 'bg-white'} 
                        hover:scale-110 hover:bg-red-200 focus:outline-none`}
                    aria-label={liked ? 'Unlike' : 'Like'}
                    title={liked ? 'Unlike' : 'Like'}
                >
                    <Heart fill={liked ? 'red' : 'none'} className={`w-6 h-6 transition-all duration-150`} />
                </button>
                <span className="text-[20px]  rounded-full  text-gray-700">
                    {count}
                </span>
            </div>
        </div>
    );
};

export default Like;