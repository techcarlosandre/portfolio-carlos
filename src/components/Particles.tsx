"use client";

import React, { useState } from "react";

export const Particles = () => {
  const [particles] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 0.8,
      left: Math.random() * 100,
      dur: Math.random() * 28 + 16,
      delay: Math.random() * -20,
    }))
  );

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
