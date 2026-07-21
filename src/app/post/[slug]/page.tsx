import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getCities } from '../../../utils/db';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import ShareButton from '../../../components/ShareButton';
import { getWeatherCondition } from '../../../utils/weatherIcons';
import { 
  IconArrowLeft, 
  IconCalendar, 
  IconUser, 
  IconMapPin,
  IconTemperature,
  IconCloudRain,
  IconWind,
  IconDroplet
} from '@tabler/icons-react';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Publicação Não Encontrada | O Tempo Aqui'
    };
  }

  return {
    title: `${post.titulo} | O Tempo Aqui`,
    description: post.resumo,
    openGraph: {
      title: post.titulo,
      description: post.resumo,
      type: 'article',
      publishedTime: post.data,
      authors: [post.autor]
    }
  };
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const cities = getCities();
  const condition = getWeatherCondition(post);
  const WeatherIcon = condition.icon;

  const showStats = (post.tipo === 'previsao' || post.tipo === 'diario') && post.dadosMeteorologicos;
  const { tempMinima, tempMaxima, chuvaMm, ventoKmh, umidadePct } = post.dadosMeteorologicos || {};

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Compute skyClass dynamically based on this post's weather condition
  let skyClass = 'sky-ensolarado';
  if (condition.label === 'Friagem / Frio') skyClass = 'sky-friagem';
  else if (condition.label === 'Pancadas de Chuva') skyClass = 'sky-chuvoso';
  else if (condition.label === 'Calor Intenso') skyClass = 'sky-calor';
  else if (condition.label === 'Parcialmente Nublado') skyClass = 'sky-nublado';

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-1000 ${skyClass}`}>
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Column: Article Content */}
        <div className="flex-1 glass-card rounded-2xl p-6 md:p-8 space-y-6">
          
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a página inicial</span>
          </Link>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="text-sky-705 bg-sky-50/50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                {post.tipo === 'previsao' ? 'Previsão' : post.tipo === 'diario' ? 'Diário' : 'Artigo'}
              </span>
              <div className="flex items-center gap-1">
                <IconMapPin className="w-3.5 h-3.5" />
                <span>{post.cidade}</span>
              </div>
              <div className="flex items-center gap-1">
                <IconCalendar className="w-3.5 h-3.5" />
                <span>{formatDate(post.data)}</span>
              </div>
              <div className="flex items-center gap-1">
                <IconUser className="w-3.5 h-3.5" />
                <span>{post.autor}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight font-display">
              {post.titulo}
            </h1>

            {/* Sharing Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <ShareButton title={post.titulo} slug={post.slug} />
            </div>
          </div>

          {/* Structured Weather Dashboard Card if Forecast/Diary */}
          {showStats && (
            <div className="bg-white/40 backdrop-blur-md rounded-xl border border-white/30 p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border border-white/50 bg-white/40 shadow-xs ${condition.colorClass}`}>
                  <WeatherIcon className="w-4 h-4 animate-weather" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Dados Meteorológicos Consolidados</h3>
                  <p className="text-[9px] text-slate-400 font-semibold">Extraídos do boletim original</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Temp Min */}
                <div className="bg-white/50 border border-white/40 p-3 rounded-lg text-center shadow-xs">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mínima</div>
                  <div className="text-base font-black text-sky-600 mt-1 flex items-center justify-center gap-0.5 font-display">
                    <IconTemperature className="w-4 h-4" />
                    <span>{tempMinima !== null && tempMinima !== undefined ? `${tempMinima}°C` : '--'}</span>
                  </div>
                </div>

                {/* Temp Max */}
                <div className="bg-white/50 border border-white/40 p-3 rounded-lg text-center shadow-xs">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Máxima</div>
                  <div className="text-base font-black text-amber-600 mt-1 flex items-center justify-center gap-0.5 font-display">
                    <IconTemperature className="w-4 h-4" />
                    <span>{tempMaxima !== null && tempMaxima !== undefined ? `${tempMaxima}°C` : '--'}</span>
                  </div>
                </div>

                {/* Chuva */}
                <div className="bg-white/50 border border-white/40 p-3 rounded-lg text-center shadow-xs">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chuva</div>
                  <div className="text-base font-black text-blue-600 mt-1 flex items-center justify-center gap-0.5 font-display">
                    <IconCloudRain className="w-4 h-4" />
                    <span>{chuvaMm !== null && chuvaMm !== undefined ? `${chuvaMm}mm` : '--'}</span>
                  </div>
                </div>

                {/* Vento */}
                <div className="bg-white/50 border border-white/40 p-3 rounded-lg text-center shadow-xs">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Vento</div>
                  <div className="text-base font-black text-slate-700 mt-1 flex items-center justify-center gap-0.5 font-display">
                    <IconWind className="w-4 h-4" />
                    <span>{ventoKmh !== null && ventoKmh !== undefined ? `${ventoKmh}km/h` : '--'}</span>
                  </div>
                </div>

                {/* Umidade */}
                <div className="bg-white/50 border border-white/40 p-3 rounded-lg text-center col-span-2 sm:col-span-1 shadow-xs">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Umidade</div>
                  <div className="text-base font-black text-teal-600 mt-1 flex items-center justify-center gap-0.5 font-display">
                    <IconDroplet className="w-4 h-4" />
                    <span>{umidadePct !== null && umidadePct !== undefined ? `${umidadePct}%` : '--'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Article HTML Body */}
          <div 
            className="wp-content prose max-w-none text-slate-750"
            dangerouslySetInnerHTML={{ __html: post.conteudo }}
          />

          {/* Footer Share */}
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center gap-4">
            <ShareButton title={post.titulo} slug={post.slug} />
            <Link
              href="/"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
            >
              Ver outras previsões
            </Link>
          </div>

        </div>

        {/* Right Side Column: Sidebar */}
        <Sidebar cities={cities} />

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-semibold mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} O Tempo Aqui - Protótipo de Redesign.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-slate-650 hover:underline">Voltar ao Início</Link>
            <span>•</span>
            <a href="https://otempoaqui.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-slate-650 hover:underline">Site Original</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
