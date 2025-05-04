import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, X } from 'lucide-react';
import { quotes } from './quotes';
import '../components/Flower';

const StarField = () => {
  const stars = useMemo(() => {
    const starElements = Array.from({ length: 100 }, (_, i) => {
      const size = Math.random() * 4 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const animationDuration = Math.random() * 5 + 3;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const starType = Math.random();
      
      if (starType < 0.2) {
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${y}%`,
              left: `${x}%`, 
              animation: `pulse ${animationDuration}s infinite ${delay}s`,
              zIndex: 5
            }}
          >
            <Star 
              size={size * 3} 
              className="text-white" 
              style={{ 
                opacity, 
                filter: `drop-shadow(0 0 ${size}px rgba(255, 255, 255, 0.8))` 
              }} 
            />
          </div>
        );
      } else if (starType < 0.4) {
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              width: `${size * 1.5}px`,
              height: `${size * 1.5}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)`,
              opacity,
              animation: `pulse ${animationDuration}s infinite ${delay}s`,
              zIndex: 5
            }}
          />
        );
      } else {
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: `0 0 ${size * 1.5}px ${size / 2}px rgba(255, 255, 255, ${opacity})`,
              opacity,
              animation: `twinkle ${animationDuration}s infinite ${delay}s`,
              zIndex: 5
            }}
          />
        );
      }
    });

    const shootingStars = Array.from({ length: 3 }, (_, i) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45 - 22.5;
      const delay = Math.random() * 15 + 5;
      
      return (
        <div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${startY}%`,
            left: `${startX}%`,
            boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.7)',
            opacity: 0,
            transform: `rotate(${angle}deg)`,
            animation: `shootingStar 3s infinite ${delay}s linear`,
            zIndex: 10
          }}
        >
          <div 
            className="absolute h-px" 
            style={{
              width: '50px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
              transform: 'translateX(-100%)',
              right: '0'
            }}
          />
        </div>
      );
    });

    const starClusters = Array.from({ length: 5 }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 80 + 40;
      
      return (
        <div
          key={`cluster-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${y}%`,
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)`,
            filter: 'blur(5px)',
            zIndex: 1
          }}
        />
      );
    });

    return [...starElements, ...shootingStars, ...starClusters];
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars}
    </div>
  );
};

const NightSkyBg = () => {
  const nightSkyElements = useMemo(() => {
    const cloudLayers = [
      { top: '20%', left: '-30%', width: '90%', height: '180px', opacity: 0.15, speed: '240s', delay: '-20s', blur: 'blur-2xl' },
      { top: '40%', left: '40%', width: '110%', height: '220px', opacity: 0.1, speed: '280s', delay: '-150s', blur: 'blur-3xl' },
      { top: '65%', left: '-20%', width: '75%', height: '120px', opacity: 0.2, speed: '180s', delay: '-30s', blur: 'blur-xl' },
      { top: '10%', left: '30%', width: '65%', height: '100px', opacity: 0.15, speed: '200s', delay: '-90s', blur: 'blur-2xl' },
      { top: '5%', left: '-10%', width: '50%', height: '80px', opacity: 0.08, speed: '160s', delay: '-40s', blur: 'blur-lg' },
      { top: '75%', left: '0%', width: '60%', height: '90px', opacity: 0.05, speed: '190s', delay: '-70s', blur: 'blur-xl' }
    ];

    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-nebula-blue via-blue-950 to-gray-900" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-nebula-dark/30 to-transparent"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          {cloudLayers.map((cloud, index) => (
            <div
              key={`cloud-${index}`}
              className={`absolute ${cloud.blur} rounded-full`}
              style={{
                top: cloud.top,
                left: cloud.left,
                width: cloud.width,
                height: cloud.height,
                opacity: cloud.opacity,
                animation: `moveCloud ${cloud.speed} linear infinite ${cloud.delay}`,
                background: index % 2 === 0 
                  ? 'radial-gradient(ellipse at center, rgba(138,162,255,0.1) 0%, rgba(99,102,241,0.05) 30%, rgba(76,81,191,0) 70%)'
                  : 'radial-gradient(ellipse at center, rgba(168,162,255,0.08) 0%, rgba(129,140,248,0.04) 40%, rgba(99,102,241,0) 70%)',
                transform: `scale(${1 + index * 0.05}) rotate(${index * 10}deg)`,
              }}
            />
          ))}
        </div>
        
        <div
          className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-300"
        >
          <div className="absolute inset-0 rounded-full bg-white/90"></div>
          <div className="absolute -inset-4 rounded-full bg-white/20 blur-md"></div>
          <div className="absolute -inset-8 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -inset-12 rounded-full bg-blue-50/5 blur-2xl"></div>
          <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-gray-300/60"></div>
          <div className="absolute top-8 left-6 w-1.5 h-1.5 rounded-full bg-gray-300/60"></div>
          <div className="absolute top-5 right-3 w-3 h-3 rounded-full bg-gray-300/60"></div>
          <div className="absolute bottom-4 right-5 w-1 h-1 rounded-full bg-gray-400/40"></div>
          <div className="absolute top-6 left-2 w-1 h-1 rounded-full bg-gray-400/40"></div>
        </div>
      </>
    );
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {nightSkyElements}
    </div>
  );
};

const DraggableQuote = ({ quote, onClose }) => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const quoteRef = React.useRef(null);

  const handleMouseDown = (e) => {
    if (quoteRef.current) {
      const rect = quoteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
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

  return (
    <div 
      ref={quoteRef}
      className="fixed w-11/12 sm:w-80 bg-gray-900/60 backdrop-blur-md rounded-xl p-4 sm:p-5 shadow-lg border border-gray-800/50 z-20 transition-all duration-500 hover:shadow-indigo-500/20 cursor-move"
      style={{ 
        left: position.x, 
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 mb-3">
          <Heart size={16} className="text-indigo-400" />
          <span className="text-indigo-400 font-medium text-sm">Quotes</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <p className="text-gray-200 italic text-sm sm:text-base unselectable">"{quote.text}"</p>
      <p className="text-indigo-400 text-right mt-2 font-medium text-sm unselectable">— {quote.author}</p>
    </div>
  );
};

const LandingPage = () => {
  const [isContainer, setIsContainer] = useState(true);
  const [quote, setQuote] = useState(null);
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContainer(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-y-auto transition-all duration-500 ${isContainer ? 'container' : ''}`}>
      <NightSkyBg />
      <StarField />
      
      {quote && quoteVisible && (
        <DraggableQuote quote={quote} onClose={() => setQuoteVisible(false)} />
      )}

      <div className="flowers">
        <div className="flower flower--1">
          <div className="flower__leafs flower__leafs--1">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>
            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
            <div className="flower__line__leaf flower__line__leaf--5"></div>
            <div className="flower__line__leaf flower__line__leaf--6"></div>
          </div>
        </div>
        <div className="flower flower--2">
          <div className="flower__leafs flower__leafs--2">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>
            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>
        <div className="flower flower--3">
          <div className="flower__leafs flower__leafs--3">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>
            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>
        <div className="grow-ans" style={{ "--d": "1.2s" }}>
          <div className="flower__g-long">
            <div className="flower__g-long__top"></div>
            <div className="flower__g-long__bottom"></div>
          </div>
        </div>
        <div className="growing-grass">
          <div className="flower__grass flower__grass--1">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__leaf flower__grass__leaf--5"></div>
            <div className="flower__grass__leaf flower__grass__leaf--6"></div>
            <div className="flower__grass__leaf flower__grass__leaf--7"></div>
            <div className="flower__grass__leaf flower__grass__leaf--8"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>
        <div className="growing-grass">
          <div className="flower__grass flower__grass--2">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>
        <div className="grow-ans" style={{ "--d": "2.4s" }}>
          <div className="flower__g-right flower__g-right--1">
            <div className="leaf"></div>
          </div>
        </div>
        <div className="grow-ans" style={{ "--d": "2.8s" }}>
          <div className="flower__g-right flower__g-right--2">
            <div className="leaf"></div>
          </div>
        </div>
        <div className="grow-ans" style={{ "--d": "2.8s" }}>
          <div className="flower__g-front">
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--1">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--2">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--3">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--4">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--5">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--6">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--7">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--8">
              <div className="flower__g-front__leaf"></div>
            </div>
            <div className="flower__g-front__line"></div>
          </div>
        </div>
        <div className="grow-ans" style={{ "--d": "3.2s" }}>
          <div className="flower__g-fr">
            <div className="leaf"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--1"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--2"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--3"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--4"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--5"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--6"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--7"></div>
            <div className="flower__g-fr__leaf flower__g-fr__leaf--8"></div>
          </div>
        </div>
        <div className="long-g long-g--0">
          <div className="grow-ans" style={{ "--d": "3s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "2.2s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.4s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.6s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
        <div className="long-g long-g--1">
          <div className="grow-ans" style={{ "--d": "3.6s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "2.8s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.2s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
        <div className="long-g long-g--2">
          <div className="grow-ans" style={{ "--d": "4s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.2s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.6s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4.4s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
        <div className="long-g long-g--3">
          <div className="grow-ans" style={{ "--d": "4.2s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.4s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.8s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4.6s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
        <div className="long-g long-g--4">
          <div className="grow-ans" style={{ "--d": "4.4s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.6s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4.8s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
        <div className="long-g long-g--5">
          <div className="grow-ans" style={{ "--d": "4.6s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "3.8s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4.2s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "5s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
        <div className="long-g long-g--6">
          <div className="grow-ans" style={{ "--d": "4.8s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4.4s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "5.2s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
        <div className="long-g long-g--7">
          <div className="grow-ans" style={{ "--d": "5s" }}>
            <div className="leaf leaf--0"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4.2s" }}>
            <div className="leaf leaf--1"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "4.6s" }}>
            <div className="leaf leaf--2"></div>
          </div>
          <div className="grow-ans" style={{ "--d": "5.4s" }}>
            <div className="leaf leaf--3"></div>
          </div>
        </div>
      </div>

      <div className="text-center z-10 p-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4 tracking-tight">
          Welcome to Sam's Basement
        </h1>
        <p className="text-xl text-gray-300 max-w-md mx-auto mb-6">
          Step into a starry haven where flowers bloom under the cosmos and confessions light up the night sky.
        </p>
        <Link to="/home">
          <button className="relative overflow-hidden bg-black text-white font-bold py-3 px-6 rounded-lg shadow-lg group transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center space-x-2">
              <Heart className="text-indigo-400" size={20} />
              <span>Enter the Cosmos</span>
            </span>
            <span className="absolute inset-0 border-2 border-transparent rounded-lg bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 -z-10 group-hover:blur-sm transition-all duration-300"></span>
            <span className="absolute inset-0 -z-20 bg-gradient-to-r from-indigo-500/0 via-blue-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;