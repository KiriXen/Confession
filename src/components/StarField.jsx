import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Star, Music } from 'lucide-react';

const StarField = ({ starCount, isLowEnd, animationSpeed }) => {
  const [position, setPosition] = useState({
    x: Math.random() * window.innerWidth * 0.8,
    y: Math.random() * window.innerHeight * 0.8,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicVisible, setMusicVisible] = useState(false);
  const imageRef = useRef(null);
  const audioRef = useRef(null);

  const baseDuration = 1 / animationSpeed;

  const handleMouseDown = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleClick = (e) => {
    if (!isDragging) {
      toggleMusic();
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
      setMusicVisible(true);
      setTimeout(() => setMusicVisible(false), 3000);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const stars = useMemo(() => {
    const starElements = Array.from({ length: starCount }, (_, index) => {
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.6 + 0.4;
      const animationDuration = (Math.random() * 6 + 4) * baseDuration;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 4;

      const starType = Math.random();

      if (starType < 0.2) {
        return (
          <div
            key={`star-${index}`}
            className="absolute"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              animation: `pulse ${animationDuration}s infinite ${delay}s`,
              zIndex: 5,
              willChange: 'opacity, transform',
            }}
          >
            <Star
              size={size * 2.5}
              className="text-white"
              style={{
                opacity,
                filter: `drop-shadow(0 0 ${size / 2}px rgba(255, 255, 255, 0.6))`,
              }}
            />
          </div>
        );
      } else if (starType < 0.4) {
        return (
          <div
            key={`glow-${index}`}
            className="absolute rounded-full"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              width: `${size * 1.2}px`,
              height: `${size * 1.2}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
              opacity,
              animation: `pulse ${animationDuration}s infinite ${delay}s`,
              zIndex: 5,
              willChange: 'opacity, transform',
            }}
          />
        );
      } else {
        return (
          <div
            key={`dot-${index}`}
            className="absolute rounded-full bg-white"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: `0 0 ${size}px ${size / 3}px rgba(255, 255, 255, ${opacity})`,
              opacity,
              animation: `twinkle ${animationDuration}s infinite ${delay}s`,
              zIndex: 5,
              willChange: 'opacity, transform',
            }}
          />
        );
      }
    });

    const shootingStarCount = isLowEnd || starCount < 50 ? 2 : 4;
    const shootingStars = Array.from({ length: shootingStarCount }, (_, index) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45 - 22.5;
      const delay = Math.random() * 20 + 10;

      return (
        <div
          key={`shooting-${index}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${startY}%`,
            left: `${startX}%`,
            boxShadow: '0 0 3px 1px rgba(255, 255, 255, 0.6)',
            opacity: 0,
            transform: `rotate(${angle}deg)`,
            animation: `shootingStar ${4 * baseDuration}s infinite ${delay}s linear`,
            zIndex: 10,
            willChange: 'transform, opacity',
          }}
        >
          <div
            className="absolute h-px"
            style={{
              width: '40px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
              transform: 'translateX(-100%)',
              right: '0',
            }}
          />
        </div>
      );
    });

    const constellationCount = isLowEnd || starCount < 50 ? 2 : 5;
    const constellations = Array.from({ length: constellationCount }, (_, index) => {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;
      const starsInConstellation = 4 + Math.floor(Math.random() * 3);

      const constellationStars = Array.from({ length: starsInConstellation }, (_, starIndex) => {
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        const size = Math.random() * 2 + 1;

        return (
          <div
            key={`constellation-${index}-star-${starIndex}`}
            className="absolute rounded-full bg-white"
            style={{
              top: `calc(${y}% + ${offsetY}px)`,
              left: `calc(${x}% + ${offsetX}px)`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.8,
              animation: `pulse ${(Math.random() * 5 + 3) * baseDuration}s infinite ${Math.random() * 2}s`,
              zIndex: 6,
              willChange: 'opacity, transform',
            }}
          />
        );
      });

      return (
        <div key={`constellation-${index}`} className="absolute">
          {constellationStars}
          {constellationStars.map((_, starIndex) => {
            if (starIndex < starsInConstellation - 1) {
              const nextStarIndex = starIndex + 1;
              const offsetX1 = (Math.random() - 0.5) * 10;
              const offsetY1 = (Math.random() - 0.5) * 10;
              const offsetX2 = (Math.random() - 0.5) * 10;
              const offsetY2 = (Math.random() - 0.5) * 10;

              return (
                <div
                  key={`constellation-line-${index}-${starIndex}`}
                  className="absolute"
                  style={{
                    top: `calc(${y}% + ${offsetY1}px)`,
                    left: `calc(${x}% + ${offsetX1}px)`,
                    width: Math.sqrt((offsetX2 - offsetX1) ** 2 + (offsetY2 - offsetY1) ** 2) + 'px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.3)',
                    transform: `rotate(${
                      Math.atan2(offsetY2 - offsetY1, offsetX2 - offsetX1) * (180 / Math.PI)
                    }deg)`,
                    transformOrigin: '0 0',
                    zIndex: 5,
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      );
    });

    const planetCount = isLowEnd || starCount < 50 ? 1 : 4;
    const planets = Array.from({ length: planetCount }, (_, index) => {
      const x = Math.random() * 90 + 5;
      const y = Math.random() * 90 + 5;
      const size = Math.random() * 3 + 2;
      const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const orbitDuration = (Math.random() * 10 + 10) * baseDuration;

      return (
        <div
          key={`planet-${index}`}
          className="absolute rounded-full"
          style={{
            top: `${y}%`,
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            boxShadow: `0 0 ${size * 1.5}px ${size / 2}px ${color}80`,
            opacity: 0.9,
            zIndex: 7,
            willChange: 'transform, opacity',
            animation: isLowEnd || starCount < 50 ? 'none' : `orbit ${orbitDuration}s linear infinite`,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              top: '50%',
              left: '50%',
              width: `${size * 1.5}px`,
              height: `${size * 0.2}px`,
              background: 'transparent',
              border: `1px solid ${color}40`,
              transform: 'translate(-50%, -50%) rotate(45deg)',
              opacity: 0.5,
            }}
          />
        </div>
      );
    });

    const clusterCount = isLowEnd || starCount < 50 ? 0 : 3;
    const clusters = Array.from({ length: clusterCount }, (_, index) => {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;
      const clusterStars = 5 + Math.floor(Math.random() * 5);

      return (
        <div key={`cluster-${index}`} className="absolute">
          {Array.from({ length: clusterStars }, (_, starIndex) => {
            const offsetX = (Math.random() - 0.5) * 8;
            const offsetY = (Math.random() - 0.5) * 8;
            const size = Math.random() * 1.5 + 0.5;

            return (
              <div
                key={`cluster-${index}-star-${starIndex}`}
                className="absolute rounded-full bg-white"
                style={{
                  top: `calc(${y}% + ${offsetY}px)`,
                  left: `calc(${x}% + ${offsetX}px)`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.7,
                  animation: `twinkle-cluster ${(Math.random() * 3 + 2) * baseDuration}s infinite ${Math.random() * 2}s`,
                  zIndex: 6,
                  willChange: 'opacity, transform',
                }}
              />
            );
          })}
        </div>
      );
    });

    const fireEffectsCount = 40;
    const fireEffects = Array.from({ length: fireEffectsCount }, (_, index) => {
      const angle = (index / fireEffectsCount) * 360;
      const randomOffset = Math.random() * 20 - 10;
      const actualAngle = angle + randomOffset;
      
      const animDuration = (Math.random() * 2 + 1) * baseDuration;
      const delay = Math.random() * 2;
      
      const particleType = Math.random();
      let particle;
      
      if (particleType < 0.3) {
        const size = Math.random() * 12 + 8;
        const distance = Math.random() * 20 + 80;
        
        const colors = [
          'rgba(255,120,50,0.8)',
          'rgba(255,80,0,0.8)',
          'rgba(255,50,0,0.8)',
          'rgba(255,180,50,0.8)',
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle = (
          <div
            key={`flame-${index}`}
            className="absolute"
            style={{
              left: `${Math.cos(actualAngle * (Math.PI / 180)) * distance + 100}px`,
              top: `${Math.sin(actualAngle * (Math.PI / 180)) * distance + 100}px`,
              width: `${size}px`,
              height: `${size * 1.5}px`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `radial-gradient(ellipse at bottom, ${color} 0%, rgba(255,30,0,0.2) 80%, rgba(255,0,0,0) 100%)`,
              transform: `translate(-50%, -50%) rotate(${actualAngle + 90}deg)`,
              animation: `flame-particle ${animDuration}s infinite ${delay}s`,
              zIndex: 14,
              willChange: 'opacity, transform',
              filter: 'blur(2px)',
            }}
          />
        );
      } else if (particleType < 0.7) {
        const size = Math.random() * 4 + 2;
        const distance = Math.random() * 30 + 75;
        
        const colors = [
          'rgba(255,220,180,0.9)',
          'rgba(255,255,200,0.9)',
          'rgba(255,200,120,0.9)',
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle = (
          <div
            key={`ember-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.cos(actualAngle * (Math.PI / 180)) * distance + 100}px`,
              top: `${Math.sin(actualAngle * (Math.PI / 180)) * distance + 100}px`,
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              boxShadow: `0 0 ${size * 2}px ${size}px ${color}`,
              transform: 'translate(-50%, -50%)',
              animation: `ember-particle ${animDuration * 0.7}s infinite ${delay}s`,
              zIndex: 15,
              willChange: 'opacity, transform',
            }}
          />
        );
      } else {
        const size = Math.random() * 15 + 10;
        const distance = Math.random() * 20 + 85;
        
        const opacity = Math.random() * 0.3 + 0.1;
        
        particle = (
          <div
            key={`smoke-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.cos(actualAngle * (Math.PI / 180)) * distance + 100}px`,
              top: `${Math.sin(actualAngle * (Math.PI / 180)) * distance + 100}px`,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, rgba(255,140,20,${opacity}) 0%, rgba(220,100,20,${opacity/2}) 50%, rgba(150,50,10,0) 100%)`,
              transform: 'translate(-50%, -50%)',
              animation: `smoke-particle ${animDuration * 1.5}s infinite ${delay}s`,
              zIndex: 13,
              willChange: 'opacity, transform',
              filter: 'blur(4px)',
            }}
          />
        );
      }
      
      return particle;
    });

    const characterWithEffects = (
      <div
        key="character-container"
        className="absolute pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
          width: '200px',
          height: '200px',
          animation: `float ${8 * baseDuration}s ease-in-out infinite`,
          willChange: 'transform',
          zIndex: 15,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {fireEffects}
        <img
          ref={imageRef}
          src="https://imgs.search.brave.com/_cGE4DPrwBtye-Qe5zh9gCfXPI14VO35GZXjmAEutas/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtd2l4bXAtZWQz/MGE4NmI4YzRjYTg4/Nzc3MzU5NGMyLndp/eG1wLmNvbS9mLzBm/YTNjMWU4LThjN2Et/NGE5NC1iNmM2LTI3/N2Y5MjQ4OTlmMS9k/aDIxa2dvLThkZTJh/MmJkLThiMTgtNDdh/OC1hM2FhLTQyZDEw/YmM1NWVkYy5wbmcv/djEvZmlsbC93XzEy/ODAsaF8xNDA2L3Bl/cHBhX3BpZ19wbmdf/YnlfZXNwb25qYTIw/MDVfZGgyMWtnby1m/dWxsdmlldy5wbmc_/dG9rZW49ZXlKMGVY/QWlPaUpLVjFRaUxD/SmhiR2NpT2lKSVV6/STFOaUo5LmV5Snpk/V0lpT2lKMWNtNDZZ/WEJ3T2pkbE1HUXhP/RGc1T0RJeU5qUXpO/ek5oTldZd1pEUXhO/V1ZoTUdReU5tVXdJ/aXdpYVhOeklqb2lk/WEp1T21Gd2NEbzNa/VEJrTVRnNE9UZ3lN/alkwTXpjellUVm1N/R1EwTVRWbFlUQmtN/alpsTUNJc0ltOWlh/aUk2VzF0N0ltaGxh/V2RvZENJNklqdzlN/VFF3TmlJc0luQmhk/R2dpT2lKY0wyWmNM/ekJtWVROak1XVTRM/VGhqTjJFdE5HRTVO/QzFpTm1NMkxUSTNO/Mlk1TWpRNE9UbG1N/Vnd2WkdneU1XdG5i/eTA0WkdVeVlUSmla/QzA0WWpFNExUUTNZ/VGd0WVROaFlTMDBN/bVF4TUdKak5UVmxa/R011Y0c1bklpd2lk/MmxrZEdnaU9pSThQ/VEV5T0RBaWZWMWRM/Q0poZFdRaU9sc2lk/WEp1T25ObGNuWnBZ/MlU2YVcxaFoyVXVi/M0JsY21GMGFXOXVj/eUpkZlEubWNyOFZN/STJRb1ZqYlFSUU43/akRUNkRWUjJIMTN6/WjdST25GZEFnSk8x/UQ"
          alt="Draggable character"
          className="absolute w-full h-full cursor-grab"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: 15,
          }}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
        />

        {/* Music note icon indicator */}
        <div 
          className={`absolute top-0 right-0 transform translate-x-8 translate-y-0 transition-opacity duration-500 ${musicVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 20 }}
        >
          <Music size={24} className="text-white" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8))' }}/>
        </div>
        
        {/* Hidden audio element */}
        <audio 
          ref={audioRef} 
          src="http://aniblog.fwh.is/assets/waku.mp3" 
          loop={true} 
        />
      </div>
    );

    return [...starElements, ...shootingStars, ...constellations, ...planets, ...clusters, characterWithEffects];
  }, [starCount, isLowEnd, animationSpeed, position, isDragging]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes twinkle-cluster {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.2; }
        }
        
        @keyframes shootingStar {
          0% { 
            transform: translateX(0) translateY(0) rotate(var(--angle, 0deg)); 
            opacity: 0;
          }
          10% { opacity: 1; }
          20% { opacity: 0; }
          100% { 
            transform: translateX(calc(100vw / 3)) translateY(calc(100vw / 6)) rotate(var(--angle, 0deg)); 
            opacity: 0;
          }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(var(--rotate, 0deg)); }
          50% { transform: translate(-50%, -50%) translateY(-10px) rotate(var(--rotate, 0deg)); }
        }
        
        @keyframes flame-particle {
          0% { 
            opacity: 0.9; 
            transform: translate(-50%, -50%) rotate(var(--rotate, 90deg)) scaleY(1); 
          }
          25% {
            opacity: 1;
            transform: translate(-50%, -60%) rotate(var(--rotate, 90deg)) scaleY(1.2);
          }
          50% { 
            opacity: 0.7; 
            transform: translate(-50%, -70%) rotate(var(--rotate, 90deg)) scaleY(1); 
          }
          75% {
            opacity: 0.9;
            transform: translate(-50%, -60%) rotate(var(--rotate, 90deg)) scaleY(1.1);
          }
          100% { 
            opacity: 0.9; 
            transform: translate(-50%, -50%) rotate(var(--rotate, 90deg)) scaleY(1); 
          }
        }
        
        @keyframes ember-particle {
          0% { 
            opacity: 0.9; 
            transform: translate(-50%, -50%) translateY(0) scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: translate(-50%, -65%) translateX(var(--translate-x, 5px)) scale(1.1); 
          }
          100% { 
            opacity: 0.9; 
            transform: translate(-50%, -50%) translateY(0) scale(1); 
          }
        }
        
        @keyframes smoke-particle {
          0% { 
            opacity: 0.6; 
            transform: translate(-50%, -50%) scale(1); 
          }
          50% { 
            opacity: 0.3; 
            transform: translate(-50%, -60%) scale(1.2); 
          }
          100% { 
            opacity: 0.6; 
            transform: translate(-50%, -50%) scale(1); 
          }
        }
      `}</style>
      {stars}
    </div>
  );
};

export default StarField;