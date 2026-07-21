export interface MeteorologicalData {
  tempMinima: number | null;
  tempMaxima: number | null;
  chuvaMm: number | null;
  ventoKmh: number | null;
  umidadePct: number | null;
}

export interface Post {
  id: string;
  slug: string;
  titulo: string;
  tipo: 'previsao' | 'diario' | 'artigos';
  cidade: string;
  data: string;
  resumo: string;
  conteudo: string;
  dadosMeteorologicos: MeteorologicalData;
  autor: string;
}

export interface City {
  nome: string;
  slug: string;
  latitude: number;
  longitude: number;
  regiao: string;
}
