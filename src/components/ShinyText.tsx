"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block text-zinc-400 bg-clip-text ${
        disabled
          ? ""
          : "bg-[linear-gradient(120deg,rgba(255,255,255,0)_40%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_60%)] bg-[length:200%_100%] animate-shimmer"
      } ${className}`}
      style={{
        animationDuration: disabled ? undefined : animationDuration,
        backgroundImage: disabled ? "none" : undefined,
      }}
    >
      {text}
    </span>
  );
};
