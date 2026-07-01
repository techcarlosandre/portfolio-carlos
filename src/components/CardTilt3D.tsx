"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CardTilt3DProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTilt3D: React.FC<CardTilt3DProps> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(true);

  // Check mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth < 768;
      setIsMobile(hasTouch || isSmall);
    };
    checkMobile();
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 22 });

  // Map mouse movement to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setHovering(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  // Render a simple flat container on mobile to prevent GPU strain
  if (isMobile) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: hovering ? 1.025 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
