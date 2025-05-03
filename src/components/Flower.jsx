import React from 'react';

const Flower = ({ left, top }) => {
  return (
    <div
      className="bg-flower absolute pointer-events-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: '50px',
        height: '50px',
        transform: 'translate(-50%, -50%)',
        opacity: 0.8,
      }}
    ></div>
  );
};

export default Flower;