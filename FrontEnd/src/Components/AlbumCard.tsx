import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

interface AlbumCardProps {
    image: string;
    name: string;
    desc: string;
    id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/album/" + id)}
            className="group mr-4 relative min-w-[200px] p-4 rounded-2xl cursor-pointer bg-gradient-to-b from-white/5 to-transparent hover:from-white/10 hover:to-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
        >
            {/* Image Container with Overlay */}
            <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                    src={image}
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={name}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                {/* Play Button Overlay */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/25 hover:scale-110 transition-all duration-200">
                        <FaPlay className="text-black text-sm ml-0.5" />
                    </div>
                </div>

                {/* Gradient Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                {/* Album Name */}
                <h3 className="font-bold text-white text-lg leading-tight group-hover:text-green-400 transition-colors duration-300">
                    {name.length > 16 ? name.slice(0, 16) + "..." : name}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {desc.length > 24 ? desc.slice(0, 24) + "..." : desc}
                </p>
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute -inset-px bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-purple-600/20 via-transparent to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"></div>
        </div>
    );
};

export default AlbumCard;