import React from 'react';

interface SavePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const SavePopup: React.FC<SavePopupProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-800 border-4 border-blue-600 rounded-lg p-6 w-80 shadow-2xl animate-fade-in relative flex flex-col items-center gap-4">
                {/* Title */}
                <h2 className="text-xl font-bold text-white text-center border-b-2 border-blue-600 pb-2 w-full">
                    SAVE GAME
                </h2>

                {/* Message */}
                <div className="text-center">
                    <p className="text-gray-300 text-sm mb-2">Save current progress?</p>
                    <p className="text-red-400 text-xs font-bold">
                        Existing save data will be overwritten.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 w-full mt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700 border-2 border-gray-500 text-gray-300 py-3 rounded hover:bg-gray-600 transition-colors font-bold text-sm"
                    >
                        BACK
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 bg-blue-700 border-2 border-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors font-bold text-sm"
                    >
                        SAVE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavePopup;
