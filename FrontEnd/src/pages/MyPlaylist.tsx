import React, { useState, useEffect } from 'react';
import { useSongData, type Song } from "../context/SongContext";
import {  FaPlay, FaPause, FaSearch, FaTrash, FaClock, FaMusic } from 'react-icons/fa';
import axios from "axios";
import { useUserData } from '../context/UserContext';

const MyPlaylistPage = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const {setSelectedSong , setIsplaying ,selectedSong, isplaying} = useSongData();
    const {removeFromPlaylist} = useUserData();





    const fetchPlaylist = async () => {
        try {
            const { data } = await axios.get<Song[]>(
                `http://localhost:4000/api/v1/user/myplaylist`,
                {
                    headers:{
                        token:localStorage.getItem("token")
                    }
                }
            );
            setSongs(data);

        } catch (error) {
            console.error("Error fetching playlist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);// The empty dependency array is crucial here

    const handleRemoveFromPlaylist = async (songId: string) => {
        await removeFromPlaylist(songId);
        fetchPlaylist();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    const playSong = (e:React.MouseEvent) => {
        e.stopPropagation();
        setIsplaying(true);
        setSelectedSong(songs[0].id.toString());
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-black text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Hero Section with Gradient Background */}
                <div className="relative mt-10 mb-16">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-800/20 to-transparent rounded-3xl blur-3xl"></div>

                    <div className="relative flex gap-8 flex-col md:flex-row md:items-end p-8 bg-gradient-to-br from-slate-900/80 to-black/60 backdrop-blur-sm rounded-3xl border border-white/10">
                        {/* Playlist Cover */}
                        <div className="group relative">
                            <div className="w-56 h-56 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                                <FaMusic className="text-white text-6xl" />
                            </div>
                            <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="flex flex-col space-y-4 flex-1">
                            <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/80 w-fit">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                Playlist
                            </div>
                            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
                                My Playlist
                            </h1>
                            <p className="text-lg text-white/70 font-medium max-w-2xl leading-relaxed">
                                Your personal collection of favorite tracks, curated with love and saved for those perfect moments.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <img
                                    src="/logo.png"
                                    className="w-8 h-8 rounded-full ring-2 ring-white/20"
                                    alt="Music App"
                                />
                                <span className="text-white font-semibold">Music App</span>
                                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                                <span className="text-white/60">{songs.length} songs</span>
                                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                                <span className="text-white/60">{0.0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 mb-8 px-2">
                    <button
                        onClick={playSong}
                        className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 group"
                    >
                        <FaPlay className="text-black text-lg ml-1 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                        <FaSearch className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search in your playlist..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                    />
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
                        {songs.length > 0 ? (
                            songs.map((song, index) => {
                                const isCurrentSong = selectedSong === song.id && isplaying;
                                return (
                                    <div
                                        className="group grid grid-cols-[16px_1fr_1fr_60px] gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-200 cursor-pointer items-center"
                                        key={song.id}
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
                                            onClick={() =>{
                                                setSelectedSong(song.id);
                                                setIsplaying(!isplaying);
                                            }
                                            }
                                                className="hidden group-hover:block text-white hover:scale-110 transition-transform duration-200"

                                            >

                                                    {isplaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Song Info */}
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="relative">
                                                <img
                                                    src={song.thumbnail || "/download.jpeg"}
                                                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                                                    alt={song.title}
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
                                                    ...
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
                                            <button
                                            onClick={()=>handleRemoveFromPlaylist(song.id)}

                                                className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-red-400 transition-all duration-200 hover:scale-110"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                            <span className="text-white/50 text-sm font-medium min-w-[35px] text-center">
                        {formatDuration(Math.floor(song.duration))}
                      </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaMusic className="text-white/50 text-2xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No songs found</h3>
                                <p className="text-white/60 mb-6">
                                    Try adjusting your search terms or browse for new music to add.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {songs.length === 0 && (
                    <div className="text-center py-16 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 mt-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaMusic className="text-white text-3xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Your playlist is empty</h2>
                        <p className="text-white/60 mb-8 text-lg max-w-md mx-auto">
                            Start building your collection by saving your favorite songs and creating the perfect soundtrack for your life.
                        </p>
                        <button className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25">
                            Browse Music
                        </button>
                    </div>
                )}

                {/* Footer Spacing */}
                <div className="h-32"></div>
            </div>
        </div>
    );
};

export default MyPlaylistPage;