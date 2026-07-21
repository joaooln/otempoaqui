# O Tempo Aqui — Protótipo de Redesign

Este é um protótipo visual e funcional independente para o portal **O Tempo Aqui** (site de meteorologia do estado do Acre mantido por Davi Friale). O projeto foi construído para apresentar uma proposta de redesign moderna, limpa e responsiva, sem qualquer acoplamento com o WordPress em produção durante a execução (runtime).

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 15+ (App Router)** & TypeScript
- **Tailwind CSS v4** (estilização rápida e moderna)
- **Recharts** (gráficos interativos de temperatura)
- **Lucide React & Tabler Icons** (pacote de ícones outline consistentes)
- **WordPress REST API** (importação estática de conteúdo)

---

## 📁 Estrutura de Dados Estáticos

Para garantir desacoplamento total e desempenho extremo, o protótipo consome arquivos JSON estáticos salvos no diretório `/data`:
1. `/data/cidades.json`: Lista das 5 cidades cobertas e metadados geográficos.
2. `/data/posts.json`: Publicações reais importadas e estruturadas via script.
3. `/data/posts.example.json`: Conjunto de dados de backup (fallback) caso o site original esteja fora do ar ou bloqueie requisições.

---

## 🚀 Como Rodar Localmente

### 1. Clonar e Instalar as Dependências
No terminal, execute:
```bash
npm install
```

### 2. Importar Posts do WordPress (Opcional)
Você pode atualizar o banco de dados estático executando o script de importação. Ele conectará à API REST pública do portal original, estruturará as informações de clima usando expressões regulares e atualizará o arquivo `/data/posts.json`:
```bash
node scripts/import-posts.mjs
```
*Nota: Se a conexão falhar ou houver bloqueio pelo servidor original, o script utilizará automaticamente o arquivo de fallback `/data/posts.example.json` para que o app continue funcionando.*

### 3. Executar o Servidor de Desenvolvimento
Inicie o servidor local:
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## ☁️ Como Fazer Deploy na Vercel

O deploy deste protótipo na Vercel é extremamente simples e não exige banco de dados ou variáveis de ambiente.

1. Faça o commit e envie seu código para um repositório Git (GitHub, GitLab ou Bitbucket).
2. Acesse a dashboard da [Vercel](https://vercel.com) e crie um novo projeto.
3. Importe o repositório criado.
4. Clique em **Deploy**.

Como as chamadas ao WordPress são estáticas (rodadas no script local), a Vercel compilará as páginas em arquivos estáticos (Static Site Generation), garantindo carregamento instantâneo e custo de infraestrutura zero.

---

## 📐 Critério de Aceite Visual

Ao abrir a Home (`/`):
- O usuário deve entender em menos de 5 segundos a previsão atual e a temperatura máxima esperada para a cidade ativa.
- A navegação entre as 5 cidades do Acre (Rio Branco, Cruzeiro do Sul, Brasiléia, Sena Madureira, Tarauacá) atualiza dinamicamente o Hero, as métricas de clima, o histórico do gráfico e o feed de posts.
- Os boletins passados e artigos analíticos estão distribuídos em grids de cards limpos, fugindo do modelo antigo de texto corrido longo.
- O card de Pix gera um QR Code real e disponibiliza um botão interativo de cópia para doações.
