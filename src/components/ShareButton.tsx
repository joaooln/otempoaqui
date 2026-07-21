'use client';

import React, { useState } from 'react';
import { IconShare, IconCheck, IconCopy } from '@tabler/icons-react';

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Construct dynamic URL (using window.location if client, fallback to slash route)
    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/post/${slug}`
      : `/post/${slug}`;

    // 1. Try Web Share API (native on mobile and modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `O Tempo Aqui - ${title}`,
          text: `Acompanhe este boletim climático no portal O Tempo Aqui:`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // If user cancelled, do nothing. For other errors, proceed to fallback copy.
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // 2. Fallback to copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar link', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
        copied 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
      }`}
    >
      {copied ? (
        <>
          <IconCheck className="w-4 h-4" />
          <span>Link de compartilhamento copiado!</span>
        </>
      ) : (
        <>
          <IconShare className="w-4 h-4 text-sky-600" />
          <span>Compartilhar boletim</span>
        </>
      )}
    </button>
  );
}
