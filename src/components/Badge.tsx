import React from "react";

export const Badge = ({
  children,
  pulsing = false,
}: {
  children: React.ReactNode;
  pulsing?: boolean;
}) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/40 border border-border text-[10px] font-black uppercase tracking-[0.15em] text-txt-muted">
    {pulsing && (
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
    )}
    {children}
  </div>
);
