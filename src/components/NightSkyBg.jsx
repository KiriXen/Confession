import React, { useState, useEffect, useMemo } from 'react';

const NightSkyBg = ({ theme, isLowEnd, starCount, nebulaOpacity, animationSpeed }) => {
  const [isNebulaLoaded, setNebulaLoaded] = useState(false);
  const baseDuration = 1 / animationSpeed;

  useEffect(() => {
    const timer = setTimeout(() => setNebulaLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const nightSkyElements = useMemo(() => {
    const cloudLayers = [
      { top: '20%', left: '-30%', width: '90%', height: '160px', opacity: 0.12, speed: `${260 * baseDuration}s`, delay: '-20s', blur: 'blur-xl' },
      { top: '40%', left: '40%', width: '100%', height: '200px', opacity: 0.08, speed: `${300 * baseDuration}s`, delay: '-150s', blur: 'blur-2xl' },
      { top: '65%', left: '-20%', width: '70%', height: '100px', opacity: 0.15, speed: `${200 * baseDuration}s`, delay: '-30s', blur: 'blur-lg' },
      { top: '10%', left: '30%', width: '60%', height: '90px', opacity: 0.12, speed: `${220 * baseDuration}s`, delay: '-90s', blur: 'blur-xl' },
    ];

    const getThemeStyles = () => {
      switch (theme) {
        case 'Starry Night':
          return {
            background: 'bg-gradient-to-b from-blue-950 via-blue-900 to-gray-900',
            nebula: null,
            clouds: cloudLayers.map(layer => ({
              ...layer,
              background: `radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)`,
            })),
          };
        case 'Cosmic Dust':
          return {
            background: 'bg-gradient-to-b from-red-950 via-orange-900 to-gray-900',
            nebula: (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  top: '15%',
                  left: '30%',
                  width: '50%',
                  height: '30%',
                  background: `radial-gradient(ellipse at center, rgba(255,69,0,${nebulaOpacity}) 0%, rgba(139,0,0,${nebulaOpacity / 2}) 50%, rgba(0,0,0,0) 70%)`,
                  filter: 'blur(8px)',
                  zIndex: 2,
                  willChange: 'opacity',
                }}
              />
            ),
            clouds: cloudLayers.map(layer => ({
              ...layer,
              background: `radial-gradient(ellipse at center, rgba(255,99,71,${nebulaOpacity / 2}) 0%, rgba(255,69,0,${nebulaOpacity / 4}) 70%)`,
            })),
          };
        case 'Aurora':
          return {
            background: 'bg-gradient-to-b from-emerald-950 via-teal-900 to-gray-900',
            nebula: (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  top: '5%',
                  left: '25%',
                  width: '70%',
                  height: '50%',
                  background: `radial-gradient(ellipse at center, rgba(16,185,129,${nebulaOpacity}) 0%, rgba(147,51,234,${nebulaOpacity / 2}) 50%, rgba(0,0,0,0) 70%)`,
                  filter: 'blur(12px)',
                  zIndex: 2,
                  willChange: 'opacity',
                }}
              />
            ),
            clouds: cloudLayers.map(layer => ({
              ...layer,
              background: `radial-gradient(ellipse at center, rgba(16,185,129,${nebulaOpacity / 2}) 0%, rgba(147,51,234,${nebulaOpacity / 4}) 70%)`,
            })),
          };
        case 'Galactic Core':
          return {
            background: 'bg-gradient-to-b from-yellow-950 via-orange-950 to-gray-900',
            nebula: (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  top: '20%',
                  left: '35%',
                  width: '40%',
                  height: '25%',
                  background: `radial-gradient(ellipse at center, rgba(255,204,0,${nebulaOpacity}) 0%, rgba(255,69,0,${nebulaOpacity / 2}) 50%, rgba(0,0,0,0) 70%)`,
                  filter: 'blur(6px)',
                  zIndex: 2,
                  willChange: 'opacity',
                }}
              />
            ),
            clouds: cloudLayers.map(layer => ({
              ...layer,
              background: `radial-gradient(ellipse at center, rgba(255,204,0,${nebulaOpacity / 2}) 0%, rgba(255,69,0,${nebulaOpacity / 4}) 70%)`,
            })),
          };
        case 'Midnight Serenity':
          return {
            background: 'bg-gradient-to-b from-blue-950 via-blue-950 to-gray-900',
            nebula: (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  top: '30%',
                  left: '40%',
                  width: '30%',
                  height: '20%',
                  background: `radial-gradient(ellipse at center, rgba(59,130,246,${nebulaOpacity / 2}) 0%, rgba(29,78,216,${nebulaOpacity / 4}) 50%, rgba(0,0,0,0) 70%)`,
                  filter: 'blur(10px)',
                  zIndex: 2,
                  willChange: 'opacity',
                }}
              />
            ),
            clouds: cloudLayers.map(layer => ({
              ...layer,
              background: `radial-gradient(ellipse at center, rgba(59,130,246,${nebulaOpacity / 4}) 0%, rgba(29,78,216,${nebulaOpacity / 8}) 70%)`,
            })),
          };
        case 'Nebula':
        default:
          return {
            background: 'bg-gradient-to-b from-nebula-blue via-blue-950 to-gray-900',
            nebula: (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  top: '10%',
                  left: '20%',
                  width: '60%',
                  height: '40%',
                  background: `radial-gradient(ellipse at center, rgba(147,112,219,${nebulaOpacity}) 0%, rgba(75,0,130,${nebulaOpacity / 2}) 50%, rgba(0,0,0,0) 70%)`,
                  filter: 'blur(10px)',
                  zIndex: 2,
                  willChange: 'opacity',
                }}
              />
            ),
            clouds: cloudLayers,
          };
      }
    };

    const { background, nebula, clouds } = getThemeStyles();

    return (
      <>
        <div className={`absolute inset-0 ${background}`} />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-nebula-dark/20 to-transparent" />
        {isNebulaLoaded && nebula}
        <div className="absolute inset-0 overflow-hidden">
          {clouds.map((cloud, index) => (
            <div
              key={`cloud-${index}`}
              className={`absolute ${cloud.blur} rounded-full`}
              style={{
                top: cloud.top,
                left: cloud.left,
                width: cloud.width,
                height: cloud.height,
                opacity: cloud.opacity,
                animation: isLowEnd || starCount < 50 ? 'none' : `moveCloud ${cloud.speed} linear infinite ${cloud.delay}`,
                background: cloud.background || `radial-gradient(ellipse at center, rgba(138,162,255,${nebulaOpacity / 2}) 0%, rgba(99,102,241,${nebulaOpacity / 4}) 70%)`,
                transform: `scale(${1 + index * 0.03}) rotate(${index * 8}deg)`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
        <div className="absolute top-20 right-20 w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="absolute inset-0 rounded-full bg-white/85" />
          <div className="absolute -inset-3 rounded-full bg-white/15 blur-sm" />
          <div className="absolute -inset-6 rounded-full bg-white/08 blur-lg" />
          <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-gray-300/50" />
          <div className="absolute top-7 left-5 w-1.5 h-1.5 rounded-full bg-gray-300/50" />
          <div className="absolute top-5 right-3 w-2.5 h-2.5 rounded-full bg-gray-300/50" />
        </div>
      </>
    );
  }, [isNebulaLoaded, theme, isLowEnd, starCount, nebulaOpacity, animationSpeed]);

  return (
    <div className="fixed inset-0 z-0">
      {nightSkyElements}
    </div>
  );
};

export default NightSkyBg;