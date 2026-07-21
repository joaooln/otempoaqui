'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { IconCopy, IconCheck, IconQrcode } from '@tabler/icons-react';

export default function PixCard() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // The actual CPF listed on Davi Friale's portal
  const pixKey = '711.849.992-79';
  
  // A realistic static Pix payload (BRCode) for demonstration
  const pixPayload = `00020101021126360014br.gov.bcb.pix0114711849992795204000053039865802BR5911DAVI FRIALE6010RIO BRANCO62070503***6304E64A`;

  useEffect(() => {
    QRCode.toDataURL(pixPayload, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f172a',  // slate-900
        light: '#ffffff'  // white
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Erro ao gerar QRCode do Pix', err));
  }, [pixPayload]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar código', err);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-slate-850 flex items-center justify-center gap-1.5 font-display">
          <IconQrcode className="w-5 h-5 text-sky-600 animate-weather" />
          <span>Apoie "O Tempo Aqui"</span>
        </h3>
        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed max-w-[240px] mx-auto">
          Contribua para manter as atualizações diárias do meteorologista Davi Friale.
        </p>
      </div>

      {/* QR Code Container */}
      <div className="bg-white/40 p-3 rounded-xl border border-white/30 flex items-center justify-center select-none shadow-xs">
        {qrCodeUrl ? (
          <img 
            src={qrCodeUrl} 
            alt="QR Code Pix do portal O Tempo Aqui" 
            className="w-[150px] h-[150px] object-contain rounded"
          />
        ) : (
          <div className="w-[150px] h-[150px] bg-slate-100/50 rounded animate-pulse" />
        )}
      </div>

      {/* Details list */}
      <div className="text-xs space-y-0.5 text-slate-700 font-bold bg-white/40 py-2 px-3 rounded-lg w-full border border-white/30 shadow-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Beneficiário:</span>
          <span>Davi Friale</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Chave CPF:</span>
          <span>{pixKey}</span>
        </div>
      </div>

      {/* Copy Pix button */}
      <button
        onClick={handleCopy}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-350 flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
          copied 
            ? 'bg-emerald-600 text-white shadow-emerald-500/20 border border-emerald-500' 
            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 hover:scale-[1.02]'
        }`}
      >
        {copied ? (
          <>
            <IconCheck className="w-4 h-4" />
            <span>Código Copiado!</span>
          </>
        ) : (
          <>
            <IconCopy className="w-4 h-4" />
            <span>Copiar Pix Copia e Cola</span>
          </>
        )}
      </button>

      <div className="text-[9px] text-slate-400 font-semibold leading-normal">
        *Este QR Code é um demonstrativo com dados reais. Substituiremos pela chave final na migração.
      </div>
    </div>
  );
}
