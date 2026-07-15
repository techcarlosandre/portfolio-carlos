"use client";

import React, { useEffect, useState } from "react";

export const TypewriterTitle = ({ words, start = true }: { words: readonly string[]; start?: boolean }) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync index and text when words prop changes (like translation toggle)
  useEffect(() => {
    setDisplayed("");
    setIsDeleting(false);
    setIndex(0);
  }, [words]);

  useEffect(() => {
    if (!start) return;
    const word = words[index];
    if (!word) return;

    const delay = isDeleting 
      ? 40 
      : displayed === word 
        ? 2200 
        : 75;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayed !== word) {
          setDisplayed(word.slice(0, displayed.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (displayed !== "") {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index, words, start]);

  return (
    <span className="typewriter-text">{displayed}</span>
  );
};
