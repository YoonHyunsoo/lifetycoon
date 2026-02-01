import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 border-2 border-white px-4 py-2 text-white text-sm shadow-xl z-50 animate-bounce-small">
            {message}
        </div>
    );
};

export default Toast;
