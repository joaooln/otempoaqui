'use client';

import React, { useState } from 'react';
import { PostSummary } from '../types';
import { IconAlertTriangle, IconDropletHalf2, IconFlame, IconSnowflake, IconX } from '@tabler/icons-react';

interface WeatherAlertBannerProps {
  post?: PostSummary;
  cityName: string;
}

export default function WeatherAlertBanner({ post, cityName }: WeatherAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !post) return null;

  const umidade = post.dadosMeteorologicos?.umidadePct;
  const minTemp = post.dadosMeteorologicos?.tempMinima;
  const maxTemp = post.dadosMeteorologicos?.tempMaxima;
  const titleLower = (post.titulo || '') + ' ' + (post.resumo || '');
  const searchLower = titleLower.toLowerCase();

  let alertConfig: {
    title: string;
    description: string;
    type: 'humidity' | 'cold' | 'heat' | 'storm';
    icon: React.ComponentType<{ className?: string }>;
    bgClass: string;
    borderClass: string;
    textClass: string;
  } | null = null;

  if (umidade !== null && umidade !== undefined && umidade <= 35) {
    alertConfig = {
      title: 'Aviso de Umidade Baixa',
      description: `Umidade relativa em ${umidade}% em ${cityName}. Recomendado hidratar-se constantemente e evitar exercícios intensos ao ar livre.`,
      type: 'humidity',
      icon: IconDropletHalf2,
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-400/40',
      textClass: 'text-amber-800 border-amber-200 bg-amber-100/60',
    };
  } else if (minTemp !== null && minTemp !== undefined && minTemp <= 17) {
    alertConfig = {
      title: 'Alerta de Friagem / Queda Térmica',
      description: `Mínimas de até ${Math.round(minTemp)}°C registradas em ${cityName}. Mantenha agasalhos à mão.`,
      type: 'cold',
      icon: IconSnowflake,
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-400/40',
      textClass: 'text-sky-800 border-sky-200 bg-sky-100/60',
    };
  } else if (maxTemp !== null && maxTemp !== undefined && maxTemp >= 36) {
    alertConfig = {
      title: 'Alerta de Calor Forte',
      description: `Temperaturas atingindo ${Math.round(maxTemp)}°C em ${cityName}. Evite exposição direta ao sol entre 11h e 16h.`,
      type: 'heat',
      icon: IconFlame,
      bgClass: 'bg-orange-500/10',
      borderClass: 'border-orange-400/40',
      textClass: 'text-orange-800 border-orange-200 bg-orange-100/60',
    };
  } else if (searchLower.includes('alerta') || searchLower.includes('chuvas fortes') || searchLower.includes('temporal')) {
    alertConfig = {
      title: 'Atenção para Condições Adversas',
      description: `Boletim recente aponta possibilidade de chuvas intensas ou rajadas de vento em ${cityName}.`,
      type: 'storm',
      icon: IconAlertTriangle,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-400/40',
      textClass: 'text-blue-800 border-blue-200 bg-blue-100/60',
    };
  }

  if (!alertConfig) return null;

  const IconComponent = alertConfig.icon;

  return (
    <div className={`w-full rounded-2xl p-4 border backdrop-blur-md transition-all duration-300 ${alertConfig.bgClass} ${alertConfig.borderClass} flex items-start justify-between gap-3 shadow-xs mb-6`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl border ${alertConfig.textClass} shrink-0 mt-0.5`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display flex items-center gap-2">
            <span>{alertConfig.title}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
          </h4>
          <p className="text-xs text-slate-700 font-semibold mt-0.5 leading-relaxed">
            {alertConfig.description}
          </p>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg hover:bg-slate-900/10 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
        title="Fechar aviso"
        aria-label="Fechar aviso de clima"
      >
        <IconX className="w-4 h-4" />
      </button>
    </div>
  );
}
