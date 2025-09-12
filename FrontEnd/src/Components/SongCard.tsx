import React, {useEffect, useState} from "react";
import { FaBookmark, FaPlay, FaHeart } from "react-icons/fa";
import { useUserData } from "../context/UserContext.tsx";
import { useSongData } from "../context/SongContext.tsx";
import {toast} from "react-hot-toast";

interface SongCardProps {
    image: string;
    name: string;
    desc: string;
    id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
    const { addToPlaylist, isAuth ,fetchUser} = useUserData();
    const { setSelectedSong, setIsplaying, selectedSong, isplaying } = useSongData();
    const [isAdded , setIsAdded] = useState<boolean>()



    const saveToPlayListHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToPlaylist(id)
        setIsAdded(!isAdded)
        toast.success('Song added to playlist')
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSong(id);
        setIsplaying(true);
    };

    const isCurrentSong = selectedSong === id && isplaying;

    return (
        <div className="group mr-4 relative min-w-[200px] p-4 rounded-2xl cursor-pointer bg-gradient-to-b from-white/5 to-transparent hover:from-white/10 hover:to-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Image Container with Enhanced Overlays */}
            <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                    src={image || "/download.jpg"}
                    className="w-full h-44 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                    alt={name}
                />

                {/* Playing Indicator Overlay */}
                {isCurrentSong && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                        <div className="flex space-x-1">
                            <div className="w-1 h-6 bg-green-400 animate-pulse rounded-full"></div>
                            <div className="w-1 h-6 bg-green-400 animate-pulse rounded-full" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1 h-6 bg-green-400 animate-pulse rounded-full" style={{animationDelay: '0.4s'}}></div>
                            <div className="w-1 h-6 bg-green-400 animate-pulse rounded-full" style={{animationDelay: '0.6s'}}></div>
                        </div>
                    </div>
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Action Buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {/* Play Button */}
                    <button
                        className="w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/30 hover:scale-110 transition-all duration-200 group/btn"
                        onClick={handlePlay}
                    >
                        <FaPlay className="text-black text-sm ml-0.5 group-hover/btn:scale-110 transition-transform duration-200" />
                    </button>

                    {/* Bookmark Button */}
                    {isAuth && (
                        <button
                            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-white/10 hover:scale-110 transition-all duration-200 border border-white/20 group/bookmark"
                            onClick={saveToPlayListHandler}
                        >
                            <FaBookmark className={`text-white text-sm group-hover/bookmark:text-yellow-400 group-hover/bookmark:scale-110 transition-all duration-200 ${isAdded ? 'text-yellow-400' : ''}`}/>
                        </button>
                    )}
                </div>

                {/* Top Corner Badge for Currently Playing */}
                {isCurrentSong && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-black text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        Now Playing
                    </div>
                )}

                {/* Love/Like Button (Top Right) */}
                <button className="absolute top-3 right-3 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 group/heart">
                    <FaHeart className="text-white/70 text-sm group-hover/heart:text-red-400 group-hover/heart:scale-110 transition-all duration-200" />
                </button>
            </div>

            {/* Content Section */}
            <div className="space-y-2">
                {/* Song Name */}
                <h3 className={`font-bold text-lg leading-tight transition-colors duration-300 ${
                    isCurrentSong ? 'text-green-400' : 'text-white group-hover:text-green-400'
                }`}>
                    {name.length > 18 ? name.slice(0, 18) + "..." : name}
                </h3>

                {/* Description/Artist */}
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {desc.length > 26 ? desc.slice(0, 26) + "..." : desc}
                </p>

                {/* Status Indicator */}
                {isCurrentSong && (
                    <div className="flex items-center gap-2 pt-1">
                        <div className="flex space-x-1">
                            <div className="w-1 h-3 bg-green-400 animate-pulse rounded-full"></div>
                            <div className="w-1 h-3 bg-green-400 animate-pulse rounded-full" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-1 h-3 bg-green-400 animate-pulse rounded-full" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-green-400 text-xs font-medium">Playing</span>
                    </div>
                )}
            </div>

            {/* Enhanced Glow Effects */}
            <div className="absolute -inset-px bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="absolute -inset-4 bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"></div>

            {/* Special glow for currently playing */}
            {isCurrentSong && (
                <div className="absolute -inset-2 bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent rounded-3xl blur-lg -z-20"></div>
            )}
        </div>
    );
};

export default SongCard;