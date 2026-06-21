"use client";

import React from "react";

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-bg">
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
