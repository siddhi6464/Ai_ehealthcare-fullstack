import React from 'react';
import { motion } from 'framer-motion';
import { FaDna } from 'react-icons/fa6';

const FloatingDNA = ({ isHovered, isAnalyzing }) => {
  const variants = {
    floating: {
      y: [0, -12, 0],
      x: [0, 8, 0],
      rotate: [0, 360],
      filter: "drop-shadow(0 0 8px rgba(46, 204, 113, 0.3))",
      transition: {
        y: { duration: 6, ease: "easeInOut", repeat: Infinity },
        x: { duration: 7, ease: "easeInOut", repeat: Infinity },
        rotate: { duration: 25, ease: "linear", repeat: Infinity },
      }
    },
    analyzing: {
      rotate: [0, 360],
      scale: [1, 1.15, 1],
      filter: "drop-shadow(0 0 20px rgba(46, 204, 113, 0.8))",
      transition: {
        rotate: { duration: 8, ease: "linear", repeat: Infinity },
        scale: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
      }
    },
    hovered: {
      x: 30,
      y: 20,
      opacity: 0.08,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="floating-element"
      style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        fontSize: '8rem',
        color: '#2ecc71',
        opacity: 0.12,
        zIndex: 1,
        pointerEvents: 'none',
      }}
      variants={variants}
      initial="floating"
      animate={isHovered ? "hovered" : (isAnalyzing ? "analyzing" : "floating")}
    >
      <FaDna />
    </motion.div>
  );
};

export default FloatingDNA;
