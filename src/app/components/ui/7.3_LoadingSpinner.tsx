import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-t-yellow-400 border-gray-600 rounded-full animate-spin"></div>
            <div className="text-xs text-yellow-400 animate-pulse">LOADING...</div>
        </div>
    );
};

export default LoadingSpinner;
