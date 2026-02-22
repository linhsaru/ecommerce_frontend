import { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const showTooltip = (e) => {
    setIsVisible(true);
    setPosition({
      top: e.target.offsetTop - 8,
      left: e.target.offsetLeft + e.target.offsetWidth / 2,
    });
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        {children}
      </div>
      {isVisible && (
        <div
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%)',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
