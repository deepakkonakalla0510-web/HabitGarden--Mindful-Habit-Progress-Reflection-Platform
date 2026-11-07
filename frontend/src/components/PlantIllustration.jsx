import React from 'react';
import { motion } from 'framer-motion';

/**
 * Handcrafted SVG botanical illustrations for the 5 plant stages
 * Non-punitive, organic, calming aesthetics
 */
export const PlantIllustration = ({
  stage = 'Seed',
  color = '#2D5A27',
  size = 72,
  animateWater = false,
  isResting = false,
  className = '',
}) => {
  // Common container motion
  const plantMotionVariants = {
    idle: {
      y: [0, -3, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
    watering: {
      scale: [1, 1.15, 0.95, 1.05, 1],
      rotate: [0, -3, 3, -1, 0],
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    resting: {
      scale: [1, 0.98, 1],
      opacity: [1, 0.85, 1],
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const currentVariant = animateWater ? 'watering' : isResting ? 'resting' : 'idle';

  return (
    <motion.div
      variants={plantMotionVariants}
      animate={currentVariant}
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dormancy / Rest glow */}
      {isResting && (
        <span
          className="absolute inset-0 rounded-full blur-md opacity-40 bg-moss pointer-events-none"
          style={{ transform: 'scale(1.2)' }}
        />
      )}

      {/* STAGE 1: SEED */}
      {stage === 'Seed' && (
        <svg
          viewBox="0 0 80 80"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soil mound */}
          <path
            d="M16 64C22 58 58 58 64 64C56 68 24 68 16 64Z"
            fill="#8C7355"
            opacity="0.75"
          />
          {/* Seed pod */}
          <motion.ellipse
            cx="40"
            cy="52"
            rx="11"
            ry="8"
            fill="#6E5033"
            transform="rotate(-15 40 52)"
          />
          {/* Tiny emerging root / micro sprout tip */}
          <path
            d="M40 48C40 44 42 41 45 39"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="45" cy="38" r="2" fill={color} />
        </svg>
      )}

      {/* STAGE 2: SPROUT */}
      {stage === 'Sprout' && (
        <svg
          viewBox="0 0 80 80"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soil */}
          <ellipse cx="40" cy="65" rx="20" ry="5" fill="#8C7355" opacity="0.6" />
          {/* Stem */}
          <path
            d="M40 64C40 50 38 42 40 32"
            stroke="#4A7C43"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Left leaf */}
          <path
            d="M39 42C30 38 24 44 26 50C33 50 37 46 39 42Z"
            fill={color}
            opacity="0.9"
          />
          {/* Right leaf */}
          <path
            d="M40 36C49 31 55 37 53 43C47 44 42 40 40 36Z"
            fill="#80A876"
          />
          {/* Dew drop */}
          <circle cx="28" cy="46" r="1.5" fill="#E8F0E6" opacity="0.9" />
        </svg>
      )}

      {/* STAGE 3: BUD */}
      {stage === 'Bud' && (
        <svg
          viewBox="0 0 80 80"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soil */}
          <ellipse cx="40" cy="67" rx="22" ry="5" fill="#8C7355" opacity="0.6" />
          {/* Stalk */}
          <path
            d="M40 66C39 52 42 40 40 24"
            stroke="#4A7C43"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Broad Lower Leaves */}
          <path
            d="M39 50C26 46 22 56 26 62C34 60 38 54 39 50Z"
            fill="#608056"
          />
          <path
            d="M41 44C54 40 58 50 54 56C46 54 42 48 41 44Z"
            fill="#7FA575"
          />
          {/* The Bud */}
          <path
            d="M40 24C34 18 36 10 40 8C44 10 46 18 40 24Z"
            fill={color}
          />
          <path
            d="M37 22C33 18 35 12 38 10C37 15 37 19 37 22Z"
            fill="#D97757"
            opacity="0.85"
          />
          <path
            d="M43 22C47 18 45 12 42 10C43 15 43 19 43 22Z"
            fill="#E58B6D"
            opacity="0.85"
          />
        </svg>
      )}

      {/* STAGE 4: BLOOM */}
      {stage === 'Bloom' && (
        <svg
          viewBox="0 0 80 80"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soil & Grass */}
          <ellipse cx="40" cy="68" rx="24" ry="5" fill="#8C7355" opacity="0.5" />
          {/* Stem */}
          <path
            d="M40 67C41 52 39 40 40 28"
            stroke="#4A7C43"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Stem Leaves */}
          <path
            d="M39 52C27 50 24 58 28 63C35 61 38 56 39 52Z"
            fill="#608056"
          />
          <path
            d="M41 46C53 43 57 51 52 57C46 55 42 50 41 46Z"
            fill="#7FA575"
          />
          {/* Blossom Petals */}
          <circle cx="40" cy="20" r="7" fill="#FAF7F2" />
          <circle cx="40" cy="12" r="7.5" fill={color} opacity="0.9" />
          <circle cx="48" cy="18" r="7.5" fill={color} opacity="0.85" />
          <circle cx="46" cy="27" r="7.5" fill={color} opacity="0.9" />
          <circle cx="34" cy="27" r="7.5" fill={color} opacity="0.85" />
          <circle cx="32" cy="18" r="7.5" fill={color} opacity="0.9" />
          {/* Flower Center Stamen */}
          <circle cx="40" cy="20" r="4.5" fill="#E5A63F" />
          <circle cx="40" cy="20" r="2.5" fill="#FAF7F2" opacity="0.7" />
        </svg>
      )}

      {/* STAGE 5: LUSH TREE */}
      {stage === 'Lush Tree' && (
        <svg
          viewBox="0 0 80 80"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soil Mound */}
          <ellipse cx="40" cy="70" rx="28" ry="6" fill="#8C7355" opacity="0.6" />
          {/* Trunk & Roots */}
          <path
            d="M36 70C38 58 37 46 38 38H42C43 46 42 58 44 70"
            fill="#63452B"
          />
          <path
            d="M36 70C31 71 27 72 25 73M44 70C49 71 53 72 55 73"
            stroke="#63452B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Lush Canopy Foliage Layers */}
          <circle cx="40" cy="30" r="22" fill={color} opacity="0.95" />
          <circle cx="28" cy="34" r="14" fill="#4A7C43" opacity="0.9" />
          <circle cx="52" cy="34" r="14" fill="#608056" opacity="0.9" />
          <circle cx="40" cy="20" r="14" fill="#7FA575" opacity="0.85" />
          <circle cx="33" cy="24" r="10" fill="#A8C3A0" opacity="0.75" />
          {/* Tiny Fruit / Blossom dots */}
          <circle cx="36" cy="32" r="2" fill="#D97757" />
          <circle cx="47" cy="26" r="2" fill="#D97757" />
          <circle cx="42" cy="38" r="2.2" fill="#D97757" />
          <circle cx="27" cy="36" r="1.8" fill="#D97757" />
        </svg>
      )}
    </motion.div>
  );
};

