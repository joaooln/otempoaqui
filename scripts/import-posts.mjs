import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sanitizeHtml from 'sanitize-html';
import he from 'he';

const { decode } = he;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const POSTS_JSON = path.join(DATA_DIR, 'posts.json');
const EXAMPLE_JSON = path.join(DATA_DIR, 'posts.example.json');
const WP_API_URL = 'https://otempoaqui.com.br/index.php?rest_route=/wp/v2';
const MAX_POSTS = 300;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// User-agent headers to bypass basic scraper blocks
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
};

async function fetchJSON(endpoint, params = {}) {
  let url = `${WP_API_URL}${endpoint}`;
  const searchParams = new URLSearchParams(params);
  const searchString = searchParams.toString();
  if (searchString) {
    url += `&${searchString}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status} URL: ${url}`);
  }
  return await res.json();
}

function cleanHTML(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim();
}

function sanitizeContent(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li',
      'h2', 'h3', 'h4', 'blockquote', 'img', 'figure', 'figcaption', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading']
    },
    exclusiveFilter: (frame) => frame.tag === 'div' && frame.text.trim() === ''
  });
}

function inferCity(title, content) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('cruzeiro do sul')) return 'Cruzeiro do Sul';
  if (titleLower.includes('brasiléia') || titleLower.includes('brasileia')) return 'Brasiléia';
  if (titleLower.includes('sena madureira')) return 'Sena Madureira';
  if (titleLower.includes('tarauacá') || titleLower.includes('tarauaca')) return 'Tarauacá';
  if (titleLower.includes('rio branco')) return 'Rio Branco';
  
  const contentLower = content.toLowerCase();
  if (contentLower.includes('cruzeiro do sul')) return 'Cruzeiro do Sul';
  if (contentLower.includes('brasiléia') || contentLower.includes('brasileia')) return 'Brasiléia';
  if (contentLower.includes('sena madureira')) return 'Sena Madureira';
  if (contentLower.includes('tarauacá') || contentLower.includes('tarauaca')) return 'Tarauacá';
  if (contentLower.includes('rio branco')) return 'Rio Branco';
  
  return 'Rio Branco'; // Default fallback
}

function parseDiarioTemperatures(cleanText, cidade) {
  const result = { tempMinima: null, tempMaxima: null };

  const cidadeEscaped = cidade.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Use \s+ instead of literal space to support non-breaking spaces (\xa0)
  const menoresBlockMatch = cleanText.match(/MENORES\s+TEMPERATURAS([\s\S]*?)(?:MAIORES\s+TEMPERATURAS|$)/i);
  const maioresBlockMatch = cleanText.match(/MAIORES\s+TEMPERATURAS([\s\S]*?)(?:CAPITAIS|ACRE|CHUVAS|$)/i);

  const cityLineRegex = new RegExp(
    `${cidadeEscaped}\\s*:?\\s*(\\d+(?:[.,]\\d+)?)\\s*(?:°|º)?\\s*C`,
    'i'
  );

  if (menoresBlockMatch) {
    const match = menoresBlockMatch[1].match(cityLineRegex);
    if (match) result.tempMinima = parseFloat(match[1].replace(',', '.'));
  }

  if (maioresBlockMatch) {
    const match = maioresBlockMatch[1].match(cityLineRegex);
    if (match) result.tempMaxima = parseFloat(match[1].replace(',', '.'));
  }

  return result;
}

function parseMeteorologicalData(title, cleanContent, cidade, tipo, rawHtml) {
  const data = {
    tempMinima: null,
    tempMaxima: null,
    chuvaMm: null,
    ventoKmh: null,
    umidadePct: null
  };

  const textToParse = `${title} ${cleanContent}`;

  if (tipo === 'diario') {
    const diarioTemps = parseDiarioTemperatures(textToParse, cidade);
    data.tempMinima = diarioTemps.tempMinima;
    data.tempMaxima = diarioTemps.tempMaxima;
  }

  // Parse Temp Minima
  // Examples: "mínima de 21°C", "mínima entre 20°C e 22°C", "mínimas oscilam entre 19 e 21°C"
  if (data.tempMinima === null) {
    const minRegexes = [
      /mínima(?:s)?\s+(?:de|entre|fica\s+em|atinge\s+a)?\s*(\d+(?:[.,]\d+)?)\s*(?:°|º|o)?\s*C/i,
      /temperatura\s+mínima\s+(?:de\s+)?(\d+(?:[.,]\d+)?)/i,
      /mínima(?:s)?\s+(?:de\s+)?(\d+(?:[.,]\d+)?)\s*graus/i
    ];
    for (const regex of minRegexes) {
      const match = textToParse.match(regex);
      if (match) {
        data.tempMinima = parseFloat(match[1].replace(',', '.'));
        break;
      }
    }
  }

  // Parse Temp Maxima
  // Examples: "máxima de 36°C", "máximas chegam a 35°C", "temperatura máxima de 32 graus"
  if (data.tempMaxima === null) {
    const maxRegexes = [
      /máxima(?:s)?\s+(?:de|entre|fica\s+em|atinge\s+a|chega\s+a)?\s*(\d+(?:[.,]\d+)?)\s*(?:°|º|o)?\s*C/i,
      /temperatura\s+máxima\s+(?:de\s+)?(\d+(?:[.,]\d+)?)/i,
      /máxima(?:s)?\s+(?:de\s+)?(\d+(?:[.,]\d+)?)\s*graus/i
    ];
    for (const regex of maxRegexes) {
      const match = textToParse.match(regex);
      if (match) {
        data.tempMaxima = parseFloat(match[1].replace(',', '.'));
        break;
      }
    }
  }

  // Fallback for "22°C a 34°C" or "22 a 34 graus" (first number is min, second is max)
  if (data.tempMinima === null && data.tempMaxima === null) {
    const rangeRegex = /(\d+(?:[.,]\d+)?)\s*(?:°C|°|º|graus)?\s*(?:a|e)\s*(\d+(?:[.,]\d+)?)\s*(?:°C|°|º|graus)\b/i;
    const match = textToParse.match(rangeRegex);
    if (match) {
      const v1 = parseFloat(match[1].replace(',', '.'));
      const v2 = parseFloat(match[2].replace(',', '.'));
      if (v1 < v2) {
        data.tempMinima = v1;
        data.tempMaxima = v2;
      } else {
        data.tempMinima = v2;
        data.tempMaxima = v1;
      }
    }
  }

  // Parse Chuva
  // Examples: "chuva de 15mm", "acumulado de 10 mm", "precipitação de 5mm"
  const rainRegex = /(\d+(?:[.,]\d+)?)\s*mm/i;
  const rainMatch = textToParse.match(rainRegex);
  if (rainMatch) {
    data.chuvaMm = parseFloat(rainMatch[1].replace(',', '.'));
  } else if (textToParse.includes('sem chuva') || textToParse.includes('ausência de chuva') || textToParse.includes('tempo seco')) {
    data.chuvaMm = 0;
  }

  // Parse Vento
  // Examples: "vento de 15km/h", "ventos de até 25 km/h"
  const windRegex = /(\d+(?:[.,]\d+)?)\s*km\s*\/\s*h/i;
  const windMatch = textToParse.match(windRegex);
  if (windMatch) {
    data.ventoKmh = parseFloat(windMatch[1].replace(',', '.'));
  }

  // Parse Umidade
  // Examples: "umidade de 40%", "umidade mínima de 35 por cento"
  const humidityRegex = /(\d+(?:[.,]\d+)?)\s*(?:%|por\s+cento)/i;
  const humidityMatch = textToParse.match(humidityRegex);
  if (humidityMatch) {
    data.umidadePct = parseFloat(humidityMatch[1].replace(',', '.'));
  }

  return data;
}

function determinePostType(categoriesList, title) {
  const cats = categoriesList.map(c => c.toLowerCase());
  const titleLower = title.toLowerCase();

  if (cats.includes('previsão') || cats.includes('previsao') || titleLower.includes('previsão') || titleLower.includes('previsao')) {
    return 'previsao';
  }
  if (cats.includes('diário') || cats.includes('diario') || titleLower.includes('diário') || titleLower.includes('diario')) {
    return 'diario';
  }
  if (cats.includes('artigo') || cats.includes('artigos') || cats.includes('análise') || cats.includes('analise')) {
    return 'artigos';
  }
  
  return 'previsao'; // Fallback default
}

async function main() {
  console.log('Iniciando importação de posts de otempoaqui.com.br...');

  try {
    // 1. Fetch categories
    console.log('Buscando categorias do site...');
    const wpCategories = await fetchJSON('/categories', { per_page: 100 });
    const categoryMap = {};
    wpCategories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });
    console.log(`Carregadas ${wpCategories.length} categorias.`);

    // 2. Fetch posts (paginated)
    let posts = [];
    let page = 1;
    let keepFetching = true;

    while (keepFetching && posts.length < MAX_POSTS) {
      console.log(`Buscando posts da página ${page}...`);
      try {
        const pagePosts = await fetchJSON('/posts', { per_page: 100, page });
        if (!pagePosts || pagePosts.length === 0) {
          keepFetching = false;
          break;
        }
        posts = posts.concat(pagePosts);
        console.log(`Carregados +${pagePosts.length} posts. Total até agora: ${posts.length}`);
        page++;
      } catch (err) {
        console.error(`Erro ao buscar página ${page}: ${err.message}`);
        keepFetching = false; // Break on error
      }
    }

    if (posts.length === 0) {
      throw new Error('Nenhum post retornado da API.');
    }

    // 3. Process and sanitize posts
    console.log('Processando e estruturando os posts...');
    const processedPosts = posts.map(post => {
      const title = decode(post.title?.rendered || '');
      const rawContent = post.content?.rendered || '';
      const cleanContent = decode(cleanHTML(rawContent));
      const excerpt = post.excerpt?.rendered || '';
      const date = post.date ? post.date.substring(0, 10) : new Date().toISOString().substring(0, 10);
      
      const postCategories = (post.categories || []).map(catId => categoryMap[catId] || '');
      const tipo = determinePostType(postCategories, title);
      const cidade = inferCity(title, cleanContent);
      const dadosMeteorologicos = parseMeteorologicalData(title, cleanContent, cidade, tipo, rawContent);

      return {
        id: String(post.id),
        slug: post.slug,
        titulo: title,
        tipo,
        cidade,
        data: date,
        resumo: decode(cleanHTML(excerpt) || cleanContent.substring(0, 160) + '...'),
        conteudo: sanitizeContent(rawContent),
        dadosMeteorologicos,
        autor: "Davi Friale" // Meteorologista principal
      };
    });

    // 4. Save to posts.json
    fs.writeFileSync(POSTS_JSON, JSON.stringify(processedPosts, null, 2), 'utf-8');
    console.log(`Sucesso! Salvos ${processedPosts.length} posts em ${POSTS_JSON}`);

  } catch (error) {
    console.error(`\n[AVISO] Falha na importação dos posts via REST API: ${error.message}`);
    console.log('Utilizando arquivo de exemplo (fallback) /data/posts.example.json...');
    
    if (fs.existsSync(EXAMPLE_JSON)) {
      fs.copyFileSync(EXAMPLE_JSON, POSTS_JSON);
      console.log(`Sucesso! Copiado posts.example.json para ${POSTS_JSON}`);
    } else {
      console.error('[ERRO CRÍTICO] Arquivo de fallback (posts.example.json) não foi encontrado! Criando conjunto de dados vazio.');
      fs.writeFileSync(POSTS_JSON, JSON.stringify([], null, 2), 'utf-8');
    }
  }
}

main();
