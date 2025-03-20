import React from "react";

interface ToggleButtonProps {
    isActive: boolean;
    onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onToggle }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={isActive}
                onChange={onToggle}
                className="sr-only peer"
            />
            <div
                className={`relative w-10 h-5 rounded-full shadow-inner transition-all duration-300 ${isActive ? "bg-green-500" : "bg-red-500"
                    }`}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform ${isActive ? "translate-x-5" : ""
                        } transition-all duration-300`}
                ></div>
            </div>
        </label>
    );
};

export default ToggleButton;
