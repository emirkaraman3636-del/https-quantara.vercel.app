"use client";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#272838] bg-[#0B0C15] py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white font-bold text-lg flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#7C3AED] to-[#00F0FF] flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          QUANTARA
        </div>
        <div className="text-sm text-[#64748B]">
          © 2026 Quantara. All rights reserved. Enterprise Data Intelligence.
        </div>
      </div>
    </footer>
  );
}