"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "../lib/useIsMobile";

const StackingSectionDesktop = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.9]);

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.div
        id={id}
        style={{ scale, opacity }}
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};
export const StackingSection = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div id={id} className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <StackingSectionDesktop className={className} id={id}>
      {children}
    </StackingSectionDesktop>
  );
};
