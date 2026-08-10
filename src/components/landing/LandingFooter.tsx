"use client";
import React from 'react';

export function LandingFooter() {
  return (
    <footer className="py-8 text-center text-sm font-medium text-slate-600 bg-[#030308] border-t border-white/5">
      <p>© {new Date().getFullYear()} Zentrivo Inc. All rights reserved.</p>
    </footer>
  );
}
