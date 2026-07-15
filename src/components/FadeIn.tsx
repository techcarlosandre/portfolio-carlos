"use client";

import React from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "../lib/useIsMobile";

export const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  triggerOnMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  triggerOnMount?: boolean;
}) => {
  const isMobile = useIsMobile();

  const dirs = {
    up: { y: isMobile ? 25 : 40, x: 0 },
    down: { y: isMobile ? -25 : -40, x: 0 },
    left: { x: isMobile ? 25 : 40, y: 0 },
    right: { x: isMobile ? -25 : -40, y: 0 },
  };

  // If triggerOnMount is enabled, animate directly on mount instead of scroll triggers
  if (triggerOnMount) {
    return (
      <motion.div
        initial={{ opacity: 0, ...dirs[direction], filter: isMobile ? "none" : "blur(8px)" }}
        animate={{ opacity: 1, x: 0, y: 0, filter: isMobile ? "none" : "blur(0px)" }}
        transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? delay * 0.5 : delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction], filter: isMobile ? "none" : "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: isMobile ? "none" : "blur(0px)" }}
      viewport={{ once: true, margin: isMobile ? "-20px" : "-60px" }}
      transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? delay * 0.5 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
