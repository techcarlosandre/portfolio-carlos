"use client";

import React, { useState, useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState<string[]>(Array(text.length).fill(""));
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]~^";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const charTimers: ReturnType<typeof setTimeout>[] = [];
    const charIntervals: ReturnType<typeof setInterval>[] = [];

    const delayTimeout = setTimeout(() => {
      text.split("").forEach((targetChar, i) => {
        const charDelay = i * 35;
        const timer = setTimeout(() => {
          let frame = 0;
          const totalFrames = 6;
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
  }, [started, text, delay]);

  return (
    <span ref={ref} className={className}>
      {displayedText.map((char, i) => (
        <span key={i}>{char || "\u00A0"}</span>
      ))}
    </span>
  );
};
