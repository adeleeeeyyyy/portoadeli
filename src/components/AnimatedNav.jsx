import React from 'react';
import { House, Cpu, Terminal } from 'lucide-react-motion';

export default function AnimatedNav() {
  return (
    <nav className="px-6 py-4 flex items-center justify-between border-b border-[#cacacb] bg-white sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[#111111] flex items-center gap-2">
          <Terminal className="w-5 h-5" strokeWidth={2} mode="signature" />
          <span 
            id="nav-title" 
            style={{ fontFamily: "'Space Mono', monospace", letterSpacing: ".05em", fontWeight: 700, fontSize: "1.05rem" }}
          >
            ./profile.sh
          </span>
          <span className="nav-cursor">_</span>
        </span>
      </div>
      
      <div className="flex items-center gap-6" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", fontWeight: 700 }}>
        <a href="/" className="nav-link group">
          <House className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2} />
          HOME
        </a>
        <a href="/tools" className="nav-link group">
          <Cpu className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2} />
          TOOLS
        </a>
      </div>
    </nav>
  );
}
