import React, { useEffect, useRef, useState } from 'react';
import { X, Settings } from 'lucide-react';
import debounce from 'lodash.debounce';

const SettingsModal = ({
  isOpen,
  onClose,
  starCount,
  setStarCount,
  theme,
  setTheme,
  animationSpeed,
  setAnimationSpeed,
  nebulaOpacity,
  setNebulaOpacity,
}) => {
  const modalRef = useRef(null);
  const modalTopRef = useRef(0);
  const [showStarWarning, setShowStarWarning] = useState(false);

  const themes = [
    'Nebula',
    'Starry Night',
    'Cosmic Dust',
    'Aurora',
    'Galactic Core',
    'Midnight Serenity',
  ];

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('starCount', starCount);
      localStorage.setItem('skyTheme', theme);
      localStorage.setItem('animationSpeed', animationSpeed);
      localStorage.setItem('nebulaOpacity', nebulaOpacity);
    }
  }, [starCount, theme, animationSpeed, nebulaOpacity, isOpen]);

  const updateModalPosition = () => {
    if (!modalRef.current) return;
    const viewportHeight = window.innerHeight;
    const modalHeight = modalRef.current.offsetHeight;
    const scrollY = window.scrollY;
    const topPosition = scrollY + (viewportHeight - modalHeight) / 2;
    modalTopRef.current = topPosition;
    modalRef.current.style.top = `${topPosition}px`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = debounce(updateModalPosition, 100);
    const handleResize = debounce(updateModalPosition, 100);

    updateModalPosition();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      handleScroll.cancel();
      handleResize.cancel();
    };
  }, [isOpen]);

  const handleStarCountChange = (value) => {
    const newStarCount = Number(value);
    setStarCount(newStarCount);
    const hasDismissedWarning = localStorage.getItem('starWarningDismissed') === 'true';
    if (newStarCount > 900 && !hasDismissedWarning) {
      setShowStarWarning(true);
    }
  };

  const dismissStarWarning = () => {
    setShowStarWarning(false);
    localStorage.setItem('starWarningDismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40">
      <div
        ref={modalRef}
        className="absolute left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md"
        style={{ top: `${modalTopRef.current}px` }}
      >
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-800/50 shadow-lg relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Settings size={20} className="text-indigo-400" />
              <h2 className="text-xl text-white font-semibold">Night Sky Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Number of Stars: {starCount}</label>
              <input
                type="range"
                min="10"
                max="2000"
                value={starCount}
                onChange={(e) => handleStarCountChange(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                aria-label="Star count slider"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10</span>
                <span>2000</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300"
                aria-label="Theme selector"
              >
                {themes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Animation Speed: {animationSpeed.toFixed(2)}x</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                aria-label="Animation speed slider"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0.1x</span>
                <span>2x</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nebula Opacity: {(nebulaOpacity * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={nebulaOpacity}
                onChange={(e) => setNebulaOpacity(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                aria-label="Nebula opacity slider"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {showStarWarning && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800/90 backdrop-blur-md rounded-xl p-4 w-10/12 max-w-sm border border-gray-700/50 shadow-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-yellow-400">⚠️</span>
                  <h3 className="text-lg text-white font-semibold">Performance Warning</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Setting the number of stars above 900 may cause lag on your device. This is not recommended for optimal performance.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={dismissStarWarning}
                    className="bg-indigo-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300"
                    aria-label="Acknowledge warning"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;