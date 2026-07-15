"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [text, setText] = useState("");
  const full = "CARLOS.";
  const duration = 1200; // Fast 1.2s loading animation for all devices

  useEffect(() => {
    let i = 0;
    const intervalTime = Math.floor((duration * 0.3) / full.length); // Dynamic speed based on duration
    const interval = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(interval);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  // Animation duration inline style (excluding the last 400ms fade-out buffer)
  const animSecs = `${(duration - 400) / 1000}s`;

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <div className="loading-logo">
        {text.slice(0, -1)}
        <span>{text.slice(-1)}</span>
      </div>
      <div className="loading-bar-track">
        <div 
          className="loading-bar-fill" 
          style={{ 
            animation: `loading-fill ${animSecs} cubic-bezier(0.4, 0, 0.2, 1) forwards, shimmer-bar 1.5s linear infinite`
          }} 
        />
      </div>
      <p className="loading-tagline">Full-Stack Developer</p>
    </motion.div>
  );
};
