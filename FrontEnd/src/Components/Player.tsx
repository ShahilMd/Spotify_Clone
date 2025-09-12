import React, { useEffect, useRef, useState } from "react";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay, FaVolumeUp, FaVolumeMute, FaHeart, FaRandom, FaRedo } from "react-icons/fa";
import { useSongData } from "../context/SongContext.tsx";

const Player = () => {
    const {
        song,
        fetchSingleSong,
        selectedSong,
        isplaying,
        setIsplaying,
        prevSong,
        nextSong,
    } = useSongData();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [volume, setVolume] = useState<number>(1);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isShuffled, setIsShuffled] = useState<boolean>(false);
    const [isRepeated, setIsRepeated] = useState<boolean>(false);


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isplaying) {
            audio.play().catch(e => console.error("play error", e));
        } else {
            audio.pause();
        }
    }, [isplaying, song]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleLoadedMetaData = () => {
            setDuration(audio.duration || 0);
        };

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime || 0);
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetaData);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [song]);

    const handlePlayPause = () => {
        setIsplaying(!isplaying);
    };

    const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value) / 100;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (audioRef.current) {
            audioRef.current.volume = newMuted ? 0 : volume;
        }
    };

    const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = (parseFloat(e.target.value) / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
        setProgress(newTime);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        fetchSingleSong();
    }, [selectedSong, fetchSingleSong]);

    return (
        <div>
            {song && (
                <div className="h-20 bg-gradient-to-r from-slate-900 via-black to-slate-900 border-t border-white/10 backdrop-blur-sm">
                    {/* Progress Bar at Top */}
                    <div className="w-full bg-white/10 h-1 relative overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300 relative"
                            style={{ width: `${(progress / duration) * 100 || 0}%` }}
                        >
                            <div className="absolute right-0 top-0 w-3 h-3 bg-green-400 rounded-full transform translate-y-[-50%] translate-x-[50%] opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            value={(progress / duration) * 100 || 0}
                            onChange={durationChange}
                        />
                    </div>

                    {/* Main Player Content */}
                    <div className="flex justify-between items-center text-white px-4 py-3 h-full">
                        {/* Left Section - Song Info */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="relative group">
                                <img
                                    src={song.thumbnail || "/download.jpg"}
                                    className="w-14 h-14 rounded-lg object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                                    alt={song.title}
                                />
                                {/* Playing Animation Overlay */}
                                {isplaying && (
                                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                                        <div className="flex space-x-0.5">
                                            <div className="w-1 h-3 bg-green-400 animate-pulse rounded-full"></div>
                                            <div className="w-1 h-3 bg-green-400 animate-pulse rounded-full" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-1 h-3 bg-green-400 animate-pulse rounded-full" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-white truncate hover:text-green-400 transition-colors duration-200 cursor-default">
                                    {song.title}
                                </h4>
                                <p className="text-white/60 text-sm truncate hover:text-white/80 transition-colors duration-200 cursor-default">
                                    {song.discription?.slice(0, 40)}...
                                </p>
                            </div>

                            {/* Like Button */}
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                                    isLiked ? 'text-red-500' : 'text-white/60 hover:text-white'
                                }`}
                            >
                                <FaHeart className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Center Section - Controls */}
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
                            {song.audio && (
                                <audio ref={audioRef} src={song.audio} />
                            )}

                            {/* Control Buttons */}
                            <div className="flex items-center gap-4">
                                {/* Shuffle */}
                                <button
                                    onClick={() => setIsShuffled(!isShuffled)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                                        isShuffled ? 'text-green-400' : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    <FaRandom className="w-4 h-4" />
                                </button>

                                {/* Previous */}
                                <button
                                    onClick={prevSong}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 hover:scale-110"
                                >
                                    <GrChapterPrevious className="w-5 h-5" />
                                </button>

                                {/* Play/Pause */}
                                <button
                                    className="w-12 h-12 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
                                    onClick={handlePlayPause}
                                >
                                    {isplaying ? (
                                        <FaPause className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
                                    ) : (
                                        <FaPlay className="w-5 h-5 ml-0.5 group-hover:scale-110 transition-transform duration-150" />
                                    )}
                                </button>

                                {/* Next */}
                                <button
                                    onClick={nextSong}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 hover:scale-110"
                                >
                                    <GrChapterNext className="w-5 h-5" />
                                </button>

                                {/* Repeat */}
                                <button
                                    onClick={() => setIsRepeated(!isRepeated)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                                        isRepeated ? 'text-green-400' : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    <FaRedo className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Time Display */}
                            <div className="flex items-center gap-2 text-xs text-white/60 min-w-[120px] justify-center">
                                <span className="min-w-[35px] text-right">{formatTime(progress)}</span>
                                <span>/</span>
                                <span className="min-w-[35px] text-left">{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Right Section - Volume */}
                        <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                            <button
                                onClick={toggleMute}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
                            >
                                {isMuted || volume === 0 ? (
                                    <FaVolumeMute className="w-4 h-4" />
                                ) : (
                                    <FaVolumeUp className="w-4 h-4" />
                                )}
                            </button>

                            <div className="flex items-center gap-2 group">
                                <div className="relative">
                                    <input
                                        type="range"
                                        className="w-20 md:w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer volume-slider"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={isMuted ? 0 : volume * 100}
                                        onChange={volumeChange}
                                        style={{
                                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${isMuted ? 0 : volume * 100}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume * 100}%, rgba(255,255,255,0.2) 100%)`
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-white/50 min-w-[30px] text-right hidden md:block">
                                    {Math.round((isMuted ? 0 : volume) * 100)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Player;