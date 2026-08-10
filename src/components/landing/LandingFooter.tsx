"use client";
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="py-12 bg-[#030308] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-white font-bold tracking-tight text-xl mb-6 md:mb-0">
          ZENTRIVO
        </div>
        
        <div className="flex space-x-8 text-sm font-medium text-[#475569]">
          <Link href="#platform" className="hover:text-white transition-colors">Platform</Link>
          <Link href="#company" className="hover:text-white transition-colors">Company</Link>
          <Link href="#legal" className="hover:text-white transition-colors">Legal</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 text-center md:text-left text-xs font-medium text-[#475569]">
        © 2026 Quantara. All rights reserved.
      </div>
    </footer>
  );
}
