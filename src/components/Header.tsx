'use client';

import React from 'react';
import Link from 'next/link';
import { IconSun } from '@tabler/icons-react';

export default function Header() {
  return (
    <header className="w-full glass-header py-3 px-4 sticky top-0 z-45">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo and Brand Title */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="Logo O Tempo Aqui com Davi Friale" 
            className="h-14 md:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] rounded-lg"
          />
        </Link>

        {/* Small subtitle or info badges */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-bold text-slate-450">
            Protótipo de Redesign
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50/50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-xs">
            WordPress API Integrada
          </span>
        </div>

      </div>
    </header>
  );
}
