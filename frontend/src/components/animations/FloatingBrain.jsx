import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain } from 'react-icons/fa';

const FloatingBrain = ({ isHovered, isAnalyzing }) => {
  const variants = {
    floating: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1],
      filter: "drop-shadow(0 0 10px rgba(67, 24, 255, 0.4))",
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }
    },
    analyzing: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.15, 1],
      filter: "drop-shadow(0 0 25px rgba(67, 24, 255, 0.9))",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }
    },
    hovered: {
      x: -20,
      y: -20,
      scale: 0.95,
      opacity: 0.1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="floating-element"
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '14rem',
        color: '#4318ff',
        opacity: 0.15,
        zIndex: 1,
        pointerEvents: 'none',
      }}
      variants={variants}
      initial="floating"
      animate={isHovered ? "hovered" : (isAnalyzing ? "analyzing" : "floating")}
    >
      <FaBrain />
    </motion.div>
  );
};

export default FloatingBrain;
