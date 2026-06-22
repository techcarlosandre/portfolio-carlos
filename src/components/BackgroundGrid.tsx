"use client";

import React, { useEffect, useRef, useState } from "react";

export const BackgroundGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const handleMove = (x: number, y: number) => {
      const rect = container.getBoundingClientRect();
      const relativeX = x - rect.left;
      const relativeY = y - rect.top;
      spotlight.style.left = `${relativeX}px`;
      spotlight.style.top = `${relativeY}px`;
    };

    const onMouseMove = (e: MouseEvent) => {
      setOpacity(1);
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setOpacity(1);
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setOpacity(1);
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      setOpacity(0);
    };

    const onTouchEnd = () => {
      setOpacity(0);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden bg-bg">
      {/* Interactive Spotlight Glow */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18)_0%,rgba(239,68,68,0.08)_30%,transparent_70%)] transition-opacity duration-500 ease-out"
        style={{
          width: "600px",
          height: "600px",
          opacity: opacity,
          left: "-9999px",
          top: "-9999px",
        }}
      />
      {/* Dynamic Grid Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />
      {/* Light highlights */}
      <div className="absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(128,0,0,0.15),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-red-900/5 blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 right-1/4 h-[400px] w-[400px] rounded-full bg-red-950/5 blur-[150px]" />
    </div>
  );
};
