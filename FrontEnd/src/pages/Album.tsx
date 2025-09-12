import { useParams } from "react-router-dom";

import { useSongData } from "../context/SongContext";

import { FaBookmark, FaPlay, FaClock } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import React, { useEffect} from "react";
import Loading from "../Components/Loding.tsx";

const Album = () => {
    const {
        fetchAlbumSong,
        albumSong,
        albumData,
        setIsplaying,
        setSelectedSong,
        loading,
        selectedSong,
        isplaying,
    } = useSongData();

    const { isAuth, addToPlaylist } = useUserData();

    const params = useParams<{ id: string }>();
    useEffect(() => {
        if (params.id) {
            fetchAlbumSong(params.id);
        }
    }, [params.id]);

    const formatDuration = (seconds: number = 180) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };


    const playSong = (e:React.MouseEvent) => {
        e.stopPropagation();
        console.log('clicked')
        setIsplaying(true);
        setSelectedSong(albumSong[0].id.toString());
    }

    return (
        <div>
                {albumData && (
                    <>
                        {loading ? (
                            <Loading />
                        ) : (
                            <>
                                {/* Hero Section with Gradient Background */}
                                <div className="relative mt-10 mb-16">
                                    {/* Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-800/20 to-transparent rounded-3xl blur-3xl"></div>

                                    <div className="relative flex gap-8 flex-col md:flex-row md:items-end p-8 bg-gradient-to-br from-slate-900/80 to-black/60 backdrop-blur-sm rounded-3xl border border-white/10">
                                        {albumData.thumbnail && (
                                            <div className="group relative">
                                                <img
                                                    src={albumData.thumbnail}
                                                    className="w-56 h-56 rounded-2xl shadow-2xl object-cover transform transition-transform duration-300 group-hover:scale-105"
                                                    alt=""
                                                />
                                                <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        )}

                                        <div className="flex flex-col space-y-4 flex-1">
                                            <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/80 w-fit">
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                                PlayList
                                            </div>
                                            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
                                                {albumData.title}
                                            </h1>
                                            <p className="text-lg text-white/70 font-medium max-w-2xl leading-relaxed">
                                                {albumData.discription}
                                            </p>
                                            <div className="flex items-center gap-4 pt-4">
                                                <img
                                                    src="/logo.png"
                                                    className="w-8 h-8 rounded-full ring-2 ring-white/20"
                                                    alt=""
                                                />
                                                <span className="text-white font-semibold">Music App</span>
                                                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                                                <span className="text-white/60">{albumSong.length} songs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-6 mb-8 px-2">
                                    <button onClick={playSong} className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 group">
                                        <FaPlay className="text-black text-lg ml-1 group-hover:scale-110 transition-transform duration-200" />
                                    </button>
                                    <button className="flex items-center justify-center w-12 h-12 border-2 border-white/20 hover:border-white/40 rounded-full transition-all duration-300 hover:scale-110 group">
                                        <FaBookmark className="text-white/70 group-hover:text-white transition-colors duration-200" />
                                    </button>
                                </div>

                                {/* Songs List */}
                                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                                    {/* Header */}
                                    <div className="grid grid-cols-[16px_1fr_1fr_60px] gap-4 px-6 py-4 text-sm font-medium text-white/50 border-b border-white/5">
                                        <span>#</span>
                                        <span>Title</span>
                                        <span className="hidden sm:block">Description</span>
                                        <span className="flex items-center justify-center">
                                            <FaClock className="w-4 h-4" />
                                        </span>
                                    </div>

                                    {/* Song Items */}
                                    <div className="divide-y divide-white/5">
                                        {albumSong &&
                                            albumSong.map((song, index) => {
                                                const isCurrentSong = selectedSong === song.id && isplaying;
                                                return (
                                                    <div
                                                        className="group grid grid-cols-[16px_1fr_1fr_60px] gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-200 cursor-pointer items-center"
                                                        key={index}
                                                    >
                                                        {/* Track Number / Play Icon */}
                                                        <div className="flex items-center justify-center">
                                                            {isCurrentSong ? (
                                                                <div className="flex space-x-1">
                                                                    <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                                                                    <div className="w-1 h-4 bg-green-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                                                    <div className="w-1 h-4 bg-green-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-white/50 group-hover:hidden text-sm font-medium">
                                                                    {index + 1}
                                                                </span>
                                                            )}
                                                            <button
                                                                className="hidden group-hover:block text-white hover:scale-110 transition-transform duration-200"
                                                                onClick={() => {
                                                                    setSelectedSong(song.id);
                                                                    setIsplaying(true);
                                                                }}
                                                            >
                                                                <FaPlay className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Song Info */}
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="relative">
                                                                <img
                                                                    src={song.thumbnail || "/download.jpeg"}
                                                                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                                                                    alt=""
                                                                />
                                                                {isCurrentSong && (
                                                                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                                                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className={`font-semibold truncate transition-colors duration-200 ${
                                                                    isCurrentSong ? 'text-green-400' : 'text-white group-hover:text-white'
                                                                }`}>
                                                                    {song.title}
                                                                </p>
                                                                <p className="text-sm text-white/50 truncate">
                                                                    Artist Name
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        <div className="hidden sm:block min-w-0">
                                                            <p className="text-white/60 text-sm truncate group-hover:text-white/80 transition-colors duration-200">
                                                                {song.discription?.slice(0, 50)}...
                                                            </p>
                                                        </div>

                                                        {/* Actions & Duration */}
                                                        <div className="flex items-center justify-center gap-3">
                                                            {isAuth && (
                                                                <button
                                                                    className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
                                                                    onClick={() => addToPlaylist(song.id)}
                                                                >
                                                                    <FaBookmark className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <span className="text-white/50 text-sm font-medium min-w-[35px] text-center">
                                                                {formatDuration()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* Footer Spacing */}
                                <div className="h-32"></div>
                            </>
                        )}
                    </>
                )}
        </div>
    );
};

export default Album;