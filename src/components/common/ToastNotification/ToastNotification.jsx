import React, { useEffect } from 'react';
import {
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineXCircle,
    HiOutlineInformationCircle,
    HiOutlineXMark
} from 'react-icons/hi2';

const ICONS = {
    success: HiOutlineCheckCircle,
    warning: HiOutlineExclamationTriangle,
    error: HiOutlineXCircle,
    info: HiOutlineInformationCircle,
};

const STYLES = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const ICON_STYLES = {
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-rose-500',
    info: 'text-blue-500',
};

/**
 * ToastNotification Component
 * Displays a floating notification in the top right corner.
 */
const ToastNotification = ({
    message,
    status = 'info',
    isVisible,
    onClose,
    autoCloseTimeout = 5000
}) => {

    useEffect(() => {
        if (isVisible && autoCloseTimeout) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseTimeout);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseTimeout, onClose]);

    if (!isVisible) return null;

    const IconComponent = ICONS[status] || ICONS.info;
    const styleClasses = STYLES[status] || STYLES.info;
    const iconClasses = ICON_STYLES[status] || ICON_STYLES.info;

    return (
        <div className="fixed top-20 right-4 md:right-8 z-[100] animate-fade-in-down max-w-sm w-full">
            <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg shadow-black/5 ${styleClasses}`}>
                <IconComponent className={`w-6 h-6 shrink-0 mt-0.5 ${iconClasses}`} />

                <div className="flex-1 pr-2 mt-1">
                    <p className="text-sm font-medium leading-relaxed">{message}</p>
                </div>

                <button
                    onClick={onClose}
                    className="shrink-0 p-1 -mr-1 -mt-1 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10"
                    aria-label="Close message"
                >
                    <HiOutlineXMark className="w-5 h-5 mt-1 opacity-70" />
                </button>
            </div>
        </div>
    );
};

export default ToastNotification;
