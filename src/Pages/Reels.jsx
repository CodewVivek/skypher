import React from 'react';
import { CircleUserRound, Heart, MessageCircleCode, Forward } from 'lucide-react';
import Like from '../Components/Like';


const Reels = () => {
    return (
        <div className="flex justify-center items-center m-10">
            <div className="bg-gray-400 flex flex-col justify-between w-[484.9px] h-[800px] p-4">
                <div className="flex-1 flex items-center justify-center">
                    reel
                </div>
                <div className="flex justify-between items-end gap-4 mb-6">
                    <div>
                        <h3 className="flex items-center gap-1 font-semibold ">
                            <CircleUserRound />
                            CompanyName
                        </h3>
                        <p className="text-sm ">short description of reel</p>
                    </div>
                    <div className="flex flex-col gap-4 items-center">
                        <Like className="cursor-pointer" />
                        <MessageCircleCode className="cursor-pointer" />
                        <Forward className="cursor-pointer" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Reels;
