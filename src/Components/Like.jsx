import React, { use, useState } from 'react'
import { Heart } from 'lucide-react'

const Like = () => {
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const handleLike = () => {
        if (liked) {
            setLiked(false);
            setCount(count - 1);
        } else {
            setLiked(true);
            setCount(count + 1);
        }

    }

    return (
        <>
            <div>
                <div>
                    <button onClick={handleLike} className="flex items-center gap-2">
                        <Heart fill={liked ? 'red' : 'none'} />
                    </button>
                </div>
                <div className='flex items-center justify-center'>
                    {count}
                </div>
            </div>
        </>
    )
}

export default Like;
