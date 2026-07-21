'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PostSummary } from '../types';
import { getWeatherCondition } from '../utils/weatherIcons';
import { 
  IconCalendar, 
  IconChevronRight, 
  IconNews, 
  IconSun, 
  IconHistory 
} from '@tabler/icons-react';

interface PostFeedProps {
  posts: PostSummary[];
}

export default function PostFeed({ posts }: PostFeedProps) {
  const [activeTab, setActiveTab] = useState<'previsao' | 'diario' | 'artigos'>('previsao');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Filter posts based on active category tab
  const filteredPosts = useMemo(() => {
    return posts.filter(post => post.tipo === activeTab);
  }, [posts, activeTab]);

  // Slice visible posts for pagination
  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  // Reset pagination count on tab change
  const handleTabChange = (tab: 'previsao' | 'diario' | 'artigos') => {
    setActiveTab(tab);
    setVisibleCount(10);
  };

  const tabsConfig = [
    { id: 'previsao', label: 'Previsões', icon: IconSun },
    { id: 'diario', label: 'Diário do Tempo', icon: IconHistory },
    { id: 'artigos', label: 'Artigos', icon: IconNews }
  ] as const;

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category Tab Switcher */}
      <div className="flex gap-1.5 p-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 max-w-md shadow-xs">
        {tabsConfig.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-650 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-slate-900/10 text-slate-500'}`}>
                {posts.filter(p => p.tipo === tab.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid List */}
      {visiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visiblePosts.map(post => {
            const condition = getWeatherCondition(post);
            const WeatherIcon = condition.icon;
            
            return (
              <article 
                key={post.id}
                className="glass-card rounded-xl p-5 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header metadata */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      {post.cidade}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <IconCalendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.data)}</span>
                    </div>
                  </div>

                  {/* Weather type badge in the card */}
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border border-white/50 bg-white/40 shadow-xs ${condition.colorClass}`}>
                      <WeatherIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{condition.label}</span>
                  </div>

                  {/* Title and Excerpt */}
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug font-display hover:text-sky-600 transition-colors">
                      <Link href={`/post/${post.slug}`} className="hover:underline">
                        {post.titulo}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-semibold">
                      {post.resumo}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
                  <Link
                    href={`/post/${post.slug}`}
                    className="inline-flex items-center gap-0.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    <span>Ler publicação</span>
                    <IconChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-450 text-xs font-semibold italic">
          Nenhuma publicação encontrada para esta categoria.
        </div>
      )}

      {/* Load More Button */}
      {filteredPosts.length > visibleCount && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="px-6 py-2 rounded-xl border border-white/45 bg-white/30 hover:bg-white/60 hover:border-white/55 text-xs font-bold text-slate-700 hover:text-slate-950 transition-all duration-200 cursor-pointer shadow-xs"
          >
            Carregar mais publicações
          </button>
        </div>
      )}

    </div>
  );
}
