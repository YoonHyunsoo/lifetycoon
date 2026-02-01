import React from 'react';

interface MenuPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const MenuPopup: React.FC<MenuPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleNotImplemented = () => {
        alert("Coming Soon! (준비중)");
    };

    const handleMainMenu = () => {
        if (confirm("Return to Main Menu? Unsaved progress will be lost.")) {
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-800 border-4 border-gray-600 rounded-lg p-4 w-64 shadow-2xl animate-fade-in relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full border-2 border-red-700 flex items-center justify-center text-xs font-bold hover:bg-red-600 z-10"
                >
                    X
                </button>

                <h2 className="text-xl font-bold text-white text-center mb-4 border-b-2 border-gray-600 pb-2">
                    SYSTEM MENU
                </h2>

                <div className="flex flex-col gap-3">
                    <MenuButton label="Settings" onClick={handleNotImplemented} icon="⚙️" />
                    <MenuButton label="Language" onClick={handleNotImplemented} icon="🌐" />
                    <div className="h-px bg-gray-700 my-1" />
                    <MenuButton label="Return to Title" onClick={handleMainMenu} icon="🏠" color="red" />
                </div>
            </div>
        </div>
    );
};

interface MenuButtonProps {
    label: string;
    onClick: () => void;
    icon: string;
    color?: 'default' | 'red';
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, onClick, icon, color = 'default' }) => {
    const baseClass = "w-full py-3 px-4 rounded border-2 flex items-center gap-3 transition-all active:scale-95 font-pixel text-sm";
    const colorClass = color === 'red'
        ? "bg-red-900/50 border-red-600 text-red-100 hover:bg-red-800"
        : "bg-gray-700 border-gray-500 text-gray-200 hover:bg-gray-600 hover:text-white";

    return (
        <button onClick={onClick} className={`${baseClass} ${colorClass}`}>
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
        </button>
    );
};

export default MenuPopup;
