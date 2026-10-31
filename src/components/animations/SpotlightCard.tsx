'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  tiltIntensity?: number;
  layoutId?: string;
  onClick?: () => void;
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(79, 70, 229, 0.22)',
  tiltIntensity = 12,
  layoutId,
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Normalized values for 3D tilt (-0.5 to 0.5)
  const xPct = useMotionValue(0);
  const yPct = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { stiffness: 220, damping: 20, mass: 0.5 };
  const smoothXPct = useSpring(xPct, springConfig);
  const smoothYPct = useSpring(yPct, springConfig);

  // Map to 3D rotation angles
  const rotateX = useTransform(smoothYPct, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(smoothXPct, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    xPct.set(x / rect.width - 0.5);
    yPct.set(y / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    xPct.set(0);
    yPct.set(0);
  };

  // Dynamic spotlight background
  const spotlightBackground = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  return (
    <motion.div
      ref={cardRef}
      layoutId={layoutId}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] shadow-xl transition-colors duration-200 ${className}`}
    >
      {/* Radial Gradient Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          background: spotlightBackground,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Card Content with elevated transform */}
      <div className="relative z-10 h-full w-full" style={{ transform: 'translateZ(15px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
