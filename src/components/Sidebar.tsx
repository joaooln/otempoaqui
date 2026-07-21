'use client';

import React from 'react';
import Link from 'next/link';
import PixCard from './PixCard';
import { City } from '../types';
import { 
  IconBrandFacebook, 
  IconArrowUpRight, 
  IconTrendingUp, 
  IconMapPin 
} from '@tabler/icons-react';

interface SidebarProps {
  cities: City[];
}

export default function Sidebar({ cities }: SidebarProps) {
  // 5 highly realistic topics from the actual portal
  const popularPosts = [
    {
      id: 'p1',
      title: 'Friagem histórica no Acre pode atingir Rio Branco com 11°C',
      slug: 'frente-fria-chega-ao-acre-e-derruba-temperaturas-para-15c' // Points to polar front post
    },
    {
      id: 'p2',
      title: 'Entenda o motivo de Julho ser o mês mais seco no Acre',
      slug: 'julho-o-mes-mais-frio-e-seco-no-acre'
    },
    {
      id: 'p3',
      title: 'Recorde de calor em Tarauacá: termômetros chegam a 37°C',
      slug: 'tarauaca-lidera-temperaturas-maximas-na-regiao'
    },
    {
      id: 'p4',
      title: 'Massa de ar seco afasta chuvas de Tarauacá',
      slug: 'massa-de-ar-seco-afasta-chuvas-de-tarauaca'
    },
    {
      id: 'p5',
      title: 'O que é o fenômeno da friagem que ocorre na Amazônia?',
      slug: 'o-que-e-o-fenomeno-da-friagem-que-ocorre-no-acre'
    }
  ];

  return (
    <aside className="w-full lg:w-[320px] flex flex-col gap-6">
      
      {/* Pix Card */}
      <PixCard />

      {/* Quick City Links */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-455 uppercase tracking-wider flex items-center gap-1.5 font-display">
          <IconMapPin className="w-4 h-4 text-sky-600 animate-weather" />
          <span>Previsão por Cidade</span>
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {cities.map(city => (
            <Link
              key={city.slug}
              href={`/previsao/${city.slug}`}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white/40 hover:bg-white/70 rounded-lg border border-white/30 transition-all duration-150 flex items-center justify-between shadow-xs"
            >
              <span>{city.nome}</span>
              <IconArrowUpRight className="w-3.5 h-3.5 text-slate-450" />
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-455 uppercase tracking-wider flex items-center gap-1.5 font-display">
          <IconTrendingUp className="w-4 h-4 text-sky-600" />
          <span>Mais Lidas da Semana</span>
        </h3>

        <ul className="divide-y divide-slate-100/50">
          {popularPosts.map((post, idx) => (
            <li key={post.id} className="py-2.5 first:pt-0 last:pb-0">
              <Link 
                href={`/post/${post.slug}`}
                className="group flex gap-3 text-xs leading-normal font-bold text-slate-700 hover:text-sky-600 transition-colors"
              >
                <span className="text-sm font-black text-slate-300 group-hover:text-sky-400 transition-colors">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Advertisements & Social Links */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        {/* Advert widget */}
        <div className="border border-dashed border-slate-300/60 rounded-lg p-4 text-center bg-white/40 shadow-xs">
          <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider mb-1">Anunciante Parceiro</div>
          <div className="text-xs font-black text-slate-750 leading-tight font-display">Curso Pré-Vestibular Acre</div>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Matrículas abertas para a Turma de Elite 2026.</p>
        </div>

        {/* Facebook link */}
        <a
          href="https://facebook.com/otempoaqui"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl border border-white/40 hover:bg-white/40 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
        >
          <IconBrandFacebook className="w-5 h-5 text-blue-600 fill-blue-600" />
          <span>Acompanhe no Facebook</span>
        </a>
      </div>

    </aside>
  );
}
