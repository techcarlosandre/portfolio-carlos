"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Beam {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
}

export const BackgroundBeams: React.FC = () => {
  const [beams, setBeams] = useState<Beam[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const isMobileDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    setIsMobile(isMobileDevice);

    // Generate random glowing vertical data beams across the layout
    const count = isMobileDevice ? 2 : 6;
    const initialBeams = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`, // Random positions across width
      delay: Math.random() * 10,
      duration: isMobileDevice ? (10 + Math.random() * 10) : (7 + Math.random() * 10),
      size: 1 + Math.random() * 1.5,
    }));
    setBeams(initialBeams);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {beams.map((beam) => (
        <motion.div
          key={beam.id}
          className="absolute top-0 h-[25vh] bg-gradient-to-b from-transparent via-accent/40 to-transparent filter blur-[1px]"
          style={{
            left: beam.left,
            width: `${beam.size}px`,
            boxShadow: isMobile ? "none" : "0 0 12px 1px rgba(224, 48, 48, 0.2)",
          }}
          initial={{ y: "-100%" }}
          animate={{ y: "110vh" }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            delay: beam.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
