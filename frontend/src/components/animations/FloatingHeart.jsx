import React from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';

const FloatingHeart = ({ isHovered, isAnalyzing }) => {
  const variants = {
    floating: {
      y: [0, 10, 0],
      x: [0, -5, 0],
      scale: [1, 1.1, 1, 1.1, 1],
      filter: "drop-shadow(0 0 8px rgba(231, 76, 60, 0.3))",
      transition: {
        y: { duration: 5, ease: "easeInOut", repeat: Infinity },
        x: { duration: 6, ease: "easeInOut", repeat: Infinity },
        scale: { duration: 2.5, ease: "easeInOut", repeat: Infinity }
      }
    },
    analyzing: {
      y: [0, 15, 0],
      scale: [1, 1.25, 1, 1.25, 1],
      filter: "drop-shadow(0 0 20px rgba(231, 76, 60, 0.8))",
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
      }
    },
    hovered: {
      x: -30,
      y: -10,
      opacity: 0.08,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="floating-element"
      style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '7rem',
        color: '#e74c3c',
        opacity: 0.12,
        zIndex: 1,
        pointerEvents: 'none',
      }}
      variants={variants}
      initial="floating"
      animate={isHovered ? "hovered" : (isAnalyzing ? "analyzing" : "floating")}
    >
      <FaHeartbeat />
    </motion.div>
  );
};

export default FloatingHeart;
