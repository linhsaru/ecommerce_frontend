import { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay for the animation to finish before removing from DOM
      const timer = setTimeout(() => setIsVisible(false), 300); // 300ms matches the transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    isVisible && (
      <div
        className={`modal-overlay fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        onClick={handleOutsideClick}
      >
        <div
          className={`transform rounded bg-white p-6 shadow-lg transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
