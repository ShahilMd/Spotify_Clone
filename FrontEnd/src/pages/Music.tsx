import React, { useState, useEffect } from 'react';
import { FaMusic, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import SongCard from '../components/SongCard'; // Adjust path as needed
import { useSongData } from '../context/SongContext'; // Adjust path as needed

interface Song {
    id: string;
    name: string;
    desc: string;
    image: string;
    type: 'music' | 'podcast';
    // Add other properties as needed
}

const Music: React.FC = () => {
    const { songs, loading } = useSongData(); // Assuming you have songs data in context
    const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'recent' | 'popular'>('name');
    const [isSearchFocused, setIsSearchFocused] = useState(false);




    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (sortType: 'name' | 'recent' | 'popular') => {
        setSortBy(sortType);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white/70 text-lg">Loading Music...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col space-y-6 mb-8">
                    {/* Title and Stats */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                <FaMusic className="text-black text-xl" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Music Collection
                                </h1>
                                <p className="text-white/60 text-lg">
                                    Discover your favorite tracks • {filteredSongs.length} songs available
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                                <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                    isSearchFocused ? 'text-green-400' : 'text-white/40'
                                }`} />
                                <input
                                    type="text"
                                    placeholder="Search music..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                {searchTerm && (
                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                        <p className="text-white/80">
                            {songs.length > 0
                                ? `Found ${songs.length} song${songs.length !== 1 ? 's' : ''} for "${searchTerm}"`
                                : `No music found for "${searchTerm}"`
                            }
                        </p>
                    </div>
                )}

                {/* Music Grid */}
                {songs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-54 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {songs.map((song) => (
                            <SongCard
                                key={song.id}
                                id={song.id}
                                name={song.title}
                                desc={song.discription}
                                image={song.thumbnail}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <FaMusic className="text-white/40 text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Music Found</h3>
                        <p className="text-white/60 text-center max-w-md">
                            {searchTerm
                                ? `We couldn't find any music matching "${searchTerm}". Try a different search term.`
                                : "No music tracks available at the moment. Check back later for new additions!"
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition-colors duration-200"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Music;