"use client";

import React, { useState, useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]~^";

  useEffect(() => {
    // Reset displayed text on mounting or text change (e.g. language toggle)
    setDisplayedText(Array(text.length).fill(""));

    const charTimers: ReturnType<typeof setTimeout>[] = [];
    const charIntervals: ReturnType<typeof setInterval>[] = [];

    const delayTimeout = setTimeout(() => {
      text.split("").forEach((targetChar, i) => {
        const charDelay = i * 30; // slightly faster animation
        const timer = setTimeout(() => {
          let frame = 0;
          const totalFrames = 5;
          const interval = setInterval(() => {
            frame++;
            setDisplayedText((prev) => {
              const next = [...prev];
              if (frame >= totalFrames) {
                next[i] = targetChar;
              } else {
                next[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
              }
              return next;
            });
            if (frame >= totalFrames) {
              clearInterval(interval);
            }
          }, 30);
          charIntervals.push(interval);
        }, charDelay);
        charTimers.push(timer);
      });
    }, delay * 1000);

    return () => {
      clearTimeout(delayTimeout);
      charTimers.forEach(clearTimeout);
      charIntervals.forEach(clearInterval);
    };
  }, [text, delay]);

  return (
    <span className={className}>
      {displayedText.map((char, i) => (
        <span key={i}>{char || "\u00A0"}</span>
      ))}
    </span>
  );
};
