import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { FaChevronLeft, FaChevronRight, FaCrown, FaDownload, FaUser, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuth, logoutUser } = useUserData();
    const [activeFilter, setActiveFilter] = useState('all');

    const logoutUserHandler = () => {
        logoutUser();
    };

    const filterCategories = [
        { id: 'all', label: 'All', path: null },
        { id: 'music', label: 'Music', path: null },
        { id: 'podcasts', label: 'Podcasts', path: null },
    ];

    const handleFilterClick = (filter: any) => {
        setActiveFilter(filter.id);
        if (filter.path) {
            navigate(filter.path);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Main Navigation Bar */}
            <div className="w-full flex justify-between items-center">
                {/* Navigation Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                    >
                        <FaChevronLeft className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-200" />
                    </button>
                    <button
                        onClick={() => navigate(+1)}
                        className="w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                    >
                        <FaChevronRight className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-200" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Premium Button */}
                    <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold text-sm rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25 group">
                        <FaCrown className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        Explore Premium
                    </button>

                    {/* Install App Button */}
                    <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white font-semibold text-sm rounded-full transition-all duration-200 hover:scale-105 group">
                        <FaDownload className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        Install App
                    </button>

                    {/* User Authentication */}
                    {isAuth ? (
                        <div className="flex items-center gap-3">
                            {/* User Avatar */}
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <FaUser className="w-5 h-5 text-white" />
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={logoutUserHandler}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-semibold text-sm rounded-full transition-all duration-200 hover:scale-105 group"
                            >
                                <FaSignOutAlt className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-black font-semibold text-sm rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg group"
                        >
                            <FaSignInAlt className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
                {filterCategories.map((category) => {
                    const isActive = activeFilter === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => handleFilterClick(category)}
                            className={`flex-shrink-0 px-4 py-2.5 font-semibold text-sm rounded-full transition-all duration-200 hover:scale-105 relative overflow-hidden group  ${
                                category.id === 'playlist' ? 'md:hidden block' : ''
                            } ${
                                isActive
                                    ? 'bg-white text-black shadow-lg'
                                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white hover:text-white'
                            }`}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white animate-pulse"></div>
                            )}

                            <span className="relative z-10">{category.label}</span>

                            {/* Hover glow effect */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            )}
                        </button>
                    );
                })}

                {/* Mobile Playlist Button */}
                <button
                    onClick={() => navigate("/playlist")}
                    className={`flex-shrink-0 px-4 py-2.5 font-semibold text-sm rounded-full transition-all duration-200 hover:scale-105 relative overflow-hidden group md:hidden ${
                        activeFilter === 'playlist'
                            ? 'bg-white text-black shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white'
                    }`}
                >
                    <span className="relative z-10">Playlists</span>
                    {activeFilter !== 'playlist' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                </button>

                {/* Gradient fade for scrollable area */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none md:hidden"></div>
            </div>

        </div>
    );
};

export default Navbar;