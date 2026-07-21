'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '../types';
import { getWeatherCondition } from '../utils/weatherIcons';
import { IconArrowRight } from '@tabler/icons-react';

interface HeroForecastProps {
  post?: Post;
  cityName: string;
}

export default function HeroForecast({ post, cityName }: HeroForecastProps) {
  const condition = getWeatherCondition(post);
  const Icon = condition.icon;

  const minTemp = post?.dadosMeteorologicos?.tempMinima;
  const maxTemp = post?.dadosMeteorologicos?.tempMaxima;

  // Format date nicely: YYYY-MM-DD to e.g., "20 de Julho"
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex-1 space-y-4">
        {/* Top bar info */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Previsão Principal</span>
          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
          <span className="text-xs text-slate-500 font-semibold">{formatDate(post?.data)}</span>
        </div>

        {/* City and Condition Status */}
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display">{cityName}</h1>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-white/40 bg-white/30 ${condition.colorClass} shadow-xs`}>
            <Icon className="w-4 h-4 animate-weather" />
            <span>{condition.label}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-slate-650 leading-relaxed max-w-xl text-sm md:text-base font-semibold">
          {post ? post.resumo : `Aguardando novas atualizações de previsão do tempo para ${cityName}.`}
        </p>

        {/* Read Full Forecast Link */}
        {post && (
          <Link
            href={`/post/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <span>Ler boletim meteorológico completo</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Temperature Display Column */}
      <div className="flex items-center md:items-end justify-center md:justify-end gap-6 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8 min-w-[200px]">
        {maxTemp !== undefined && maxTemp !== null ? (
          <div className="text-center md:text-right">
            <div className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter relative select-none font-display">
              {Math.round(maxTemp)}
              <span className="text-3xl font-light text-slate-400 absolute -top-1">°C</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">Temperatura Máxima</div>
            
            {minTemp !== undefined && minTemp !== null && (
              <div className="flex items-center justify-center md:justify-end gap-1.5 mt-3 text-slate-600 text-xs font-bold">
                <span className="text-sky-600 bg-sky-50/50 border border-sky-100 px-2 py-0.5 rounded-md">Mín: {Math.round(minTemp)}°C</span>
                <span className="text-slate-300">|</span>
                <span className="text-amber-600 bg-amber-50/50 border border-amber-100 px-2 py-0.5 rounded-md">Máx: {Math.round(maxTemp)}°C</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center md:text-right py-4 text-slate-400 text-xs font-semibold italic">
            Dados não especificados.
          </div>
        )}
      </div>
    </div>
  );
}
