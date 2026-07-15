"use client";

import React, { useEffect, useRef } from "react";
import { useIsMobile } from "../lib/useIsMobile";

export const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const outer = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (innerRef.current) {
        innerRef.current.style.left = `${e.clientX}px`;
        innerRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isHoverable = el.closest("a, button, [data-hover]");
      outerRef.current?.classList.toggle("hovering", !!isHoverable);
      innerRef.current?.classList.toggle("hovering", !!isHoverable);
    };

    let rafId: number;
    const animate = () => {
      outer.current.x += (pos.current.x - outer.current.x) * 0.12;
      outer.current.y += (pos.current.y - outer.current.y) * 0.12;
      if (outerRef.current) {
        outerRef.current.style.left = `${outer.current.x}px`;
        outerRef.current.style.top = `${outer.current.y}px`;
      }
      rafId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onHover);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onHover);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={outerRef} className="custom-cursor-outer" />
      <div ref={innerRef} className="custom-cursor-inner" />
    </>
  );
};
