"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useApp } from "../app/providers";

export const MigrationOverlay = () => {
  const { t } = useApp();
  const [countdown, setCountdown] = useState(3);
  const targetUrl = "https://portfolio.techcarlos.com.br";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center p-6 text-center dot-grid">
      <div className="max-w-md w-full bg-surface/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertTriangle className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-txt">
          {t.migration.title}
        </h2>
        <p className="text-txt-muted text-xs leading-relaxed mb-6">
          {t.migration.desc}
        </p>
        <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-primary">
          {t.migration.redirecting.replace("{seconds}", countdown.toString())}
        </div>
        <a
          href={targetUrl}
          className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-accent text-txt text-xs font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/35"
        >
          {t.migration.cta} <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
