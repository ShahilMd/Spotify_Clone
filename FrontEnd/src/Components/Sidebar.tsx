import { useNavigate } from "react-router-dom";
import PlaylistCard from "./PlaylistCard.tsx";
import { FaHome, FaSearch, FaBookOpen, FaPlus, FaChevronRight, FaPodcast, FaMusic, FaHeart, FaHistory } from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('home');

    const navigationItems = [
        { id: 'home', label: 'Home', icon: FaHome, path: '/' },
        { id: 'search', label: 'Search', icon: FaSearch, path: '/search' },
    ];

    const libraryItems = [
        { id: 'playlist', label: 'Your Playlists', icon: FaMusic, path: '/playlist' },
        { id: 'liked', label: 'Liked Songs', icon: FaHeart, path: '/liked' },
        { id: 'history', label: 'Recently Played', icon: FaHistory, path: '/history' },
    ];

    const handleNavigation = (path: string, id: string) => {
        setActiveItem(id);
        navigate(path);
    };

    return (
        <div className="w-[25%] h-full p-3 flex flex-col gap-3 text-white hidden lg:flex">
            {/* Main Navigation */}
            <div className="bg-gradient-to-br from-slate-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-1">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                isActive
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'hover:bg-white/5 text-white/70 hover:text-white'
                            }`}
                            onClick={() => handleNavigation(item.path, item.id)}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600 rounded-r-full"></div>
                            )}

                            <div className={`p-2 rounded-lg transition-all duration-300 ${
                                isActive
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-white/5 group-hover:bg-white/10'
                            }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <p className="font-semibold text-sm group-hover:translate-x-1 transition-transform duration-200">
                                {item.label}
                            </p>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </div>
                    );
                })}
            </div>

            {/* Library Section */}
            <div className="bg-gradient-to-br from-slate-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl flex-1 flex flex-col">
                {/* Library Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <FaBookOpen className="w-5 h-5 text-white/80" />
                            </div>
                            <h2 className="font-bold text-lg">Your Library</h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group">
                                <FaChevronRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-200" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 flex-wrap">
                        {libraryItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.path, item.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium text-white/80 hover:text-white transition-all duration-200 group"
                                >
                                    <Icon className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                                    {item.label.split(' ')[0]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Playlist Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div
                        onClick={() => navigate('/playlist')}
                        className="rounded-xl overflow-hidden hover:bg-white/5 transition-all duration-200 cursor-pointer"
                    >
                        <PlaylistCard/>
                    </div>
                </div>

                {/* Podcast Promotion Card */}
                <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-white/10 rounded-xl relative overflow-hidden group">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl"></div>
                        <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-lg"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <FaPodcast className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Discover Podcasts</h3>
                                <p className="text-white/60 text-xs">New episodes weekly</p>
                            </div>
                        </div>

                        <p className="text-white/80 text-sm mb-4 leading-relaxed">
                            Find podcasts that inspire, educate, and entertain you
                        </p>

                        <button className="w-full px-4 py-2.5 bg-white hover:bg-gray-100 text-black font-semibold text-sm rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group">
                            <FaPodcast className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            Browse Podcasts
                        </button>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;