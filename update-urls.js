// Script para atualizar URLs dos filmes automaticamente
const https = require('https');
const fs = require('fs');

// Lista de filmes para buscar URLs atualizadas
const movies = [
  {
    id: "piratas_caribe_3",
    titulo: "Piratas do Caribe 3",
    searchQuery: "piratas-do-caribe-no-fim-do-mundo",
    capa: "https://image.tmdb.org/t/p/w500/jGWpG4YhpQwVE6YXPO7RjFKgoZr.jpg"
  },
  {
    id: "velozes_furiosos_tokyo",
    titulo: "Velozes e Furiosos: Desafio em Tóquio",
    searchQuery: "velozes-e-furiosos-desafio-em-toquio",
    capa: "https://image.tmdb.org/t/p/w500/1kzW2GImY1YVmLRx3NLhXFBfLLO.jpg"
  }
  // Adicione mais filmes aqui
];

// Função para buscar URL atualizada do HLS proxy
function getUpdatedUrl(searchQuery) {
  return new Promise((resolve, reject) => {
    const url = `https://hls-proxy.astr.digital/hls/${searchQuery}/master.m3u8`;
    
    https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000 
    }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 302) {
        // Pega a URL final (com hash e expires)
        const finalUrl = res.headers.location || url;
        console.log(`✓ ${searchQuery}: URL obtida`);
        resolve(finalUrl);
      } else {
        console.log(`✗ ${searchQuery}: Status ${res.statusCode}`);
        resolve(null);
      }
    }).on('error', (err) => {
      console.error(`✗ ${searchQuery}: ${err.message}`);
      resolve(null);
    }).on('timeout', () => {
      console.error(`✗ ${searchQuery}: Timeout`);
      resolve(null);
    });
  });
}

// Função principal
async function updateMovies() {
  console.log('=== Atualizando URLs dos filmes ===\n');
  
  const updatedMovies = [];
  
  for (const movie of movies) {
    const url = await getUpdatedUrl(movie.searchQuery);
    
    updatedMovies.push({
      id: movie.id,
      titulo: movie.titulo,
      capa: movie.capa,
      url: url || ""
    });
    
    // Delay para não sobrecarregar o servidor
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Salvar no arquivo JSON
  const jsonContent = JSON.stringify(updatedMovies, null, 2);
  fs.writeFileSync('filmes.json', jsonContent, 'utf8');
  
  console.log('\n✓ Arquivo filmes.json atualizado!');
  console.log(`Total de filmes: ${updatedMovies.length}`);
  console.log(`URLs válidas: ${updatedMovies.filter(m => m.url).length}`);
}

// Executar
updateMovies().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
