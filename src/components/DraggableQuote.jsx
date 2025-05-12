import React, { useState, useEffect, useRef } from 'react';
import { Heart, X } from 'lucide-react';

const DraggableQuote = ({ quote, onClose }) => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const quoteRef = useRef(null);

  const handleMouseDown = (e) => {
    if (quoteRef.current) {
      const rect = quoteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
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

  return (
    <div
      ref={quoteRef}
      className="fixed w-11/12 sm:w-64 bg-gray-900/60 backdrop-blur-md rounded-xl p-4 sm:p-4 shadow-lg border border-gray-800/50 z-20 transition-all duration-500 hover:shadow-indigo-500/20 cursor-move"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      aria-label="Draggable quote card"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-1 mb-2">
          <Heart size={14} className="text-indigo-400" />
          <span className="text-indigo-400 font-medium text-xs">Quotes</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close quote"
        >
          <X size={14} />
        </button>
      </div>
      <p className="text-gray-200 italic text-xs sm:text-sm unselectable">"{quote.text}"</p>
      <p className="text-indigo-400 text-right mt-1 font-medium text-xs unselectable">— {quote.author}</p>
    </div>
  );
};

export default DraggableQuote;