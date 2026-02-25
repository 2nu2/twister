// Script para atualizar URLs dos filmes automaticamente
const https = require('https');
const fs = require('fs');

// Lista de filmes com seus slugs do HLS
const movies = [
  {
    id: "Velozes",
    titulo: "Velozes e Furiosos",
    capa: "https://i.assistir.biz/t/p/w342/1kzW2GImY1YVmLRx3NLhXFBfLLO.jpg",
    slug: "velozes-e-furiosos-desafio-em-toquio"
  },
  {
    id: "Piratas1",
    titulo: "Piratas do Caribe",
    capa: "https://i.assistir.biz/t/p/w342/zUpeLvZJw5Tf22BAjraOZFex9E0.jpg",
    slug: "piratas-do-caribe-a-maldicao-do-perola-negra"
  },
  {
    id: "Piratas3",
    titulo: "Piratas do Caribe: No Fim do Mundo",
    capa: "https://i.assistir.biz/t/p/w342/2vgdFnsThB3acNVSUN9TzpUwLg5.jpg",
    slug: "piratas-do-caribe-no-fim-do-mundo"
  },
  {
    id: "Piratas4",
    titulo: "Piratas do Caribe: Navegando em Águas Misteriosas",
    capa: "https://i.assistir.biz/t/p/w342/mQuyx1qXOc6ftTctYVG3gcvWrEH.jpg",
    slug: "piratas-do-caribe-navegando-em-aguas-misteriosas"
  },
  {
    id: "Pitatas2",
    titulo: "Piratas do Caribe: O Baú da Morte",
    capa: "https://i.assistir.biz/t/p/w342/dCXOveWolVMMbJZQ0cNslpqohPM.jpg",
    slug: "piratas-do-caribe-o-bau-da-morte"
  },
  {
    id: "Aeradogelo5",
    titulo: "A Era do Gelo: O Big Bang",
    capa: "https://upload.wikimedia.org/wikipedia/pt/c/c5/Ice_age_collision_course.jpg",
    slug: "a-era-do-gelo-o-big-bang"
  },
  {
    id: "aeradogelo4",
    titulo: "A Era do Gelo 4",
    capa: "https://upload.wikimedia.org/wikipedia/pt/6/6c/Ice_Age_Continental_Drift.jpg",
    slug: "a-era-do-gelo-4"
  },
  {
    id: "aeradogelo3",
    titulo: "A Era do Gelo 3",
    capa: "https://upload.wikimedia.org/wikipedia/pt/9/99/Dawn_of_the_Dinosaurs.jpg",
    slug: "a-era-do-gelo-3"
  },
  {
    id: "carros3",
    titulo: "Carros 3",
    capa: "https://i.assistir.biz/t/p/w342/lVPFdORefTKXKFiSktrXbiFDNAK.jpg",
    slug: "carros-3"
  },
  {
    id: "Motoquieo1",
    titulo: "Motoqueiro Fantasma",
    capa: "https://upload.wikimedia.org/wikipedia/pt/d/d7/Ghostrider_cartaz.jpg",
    slug: "motoqueiro-fantasma"
  },
  {
    id: "av1",
    titulo: "Aviões",
    capa: "https://raw.githubusercontent.com/win64k-lgtm/twister/refs/heads/main/4KrnsveRY7O6YR2X0j1vGrEksIZ.jpg",
    slug: "avioes"
  },
  {
    id: "v6",
    titulo: "Velozes & Furiosos 6",
    capa: "https://i.assistir.biz/t/p/w342/h8SD0Kkqv3PUBneQX9tFsDrFu8.jpg",
    slug: "velozes-e-furiosos-6"
  },
  {
    id: "v9",
    titulo: "Velozes & Furiosos 9",
    capa: "https://i.assistir.biz/t/p/w342/6TuEPZ3ItlBO8WmH8BmY2aGLhes.jpg",
    slug: "velozes-e-furiosos-9"
  },
  {
    id: "v11",
    titulo: "Velozes & Furiosos: Hobbs & Shaw",
    capa: "https://i.assistir.biz/t/p/w342/w5HWdAJyAbfpXbXDmEt5OIpf6kQ.jpg",
    slug: "velozes-e-furiosos-hobbs-e-shaw"
  }
];

// Função para buscar URL atualizada
function getUpdatedUrl(slug) {
  return new Promise((resolve) => {
    // Tenta primeiro hls-proxy.astr.digital
    const proxyUrl = `https://hls-proxy.astr.digital/hls/${slug}/master.m3u8`;
    
    const req = https.get(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': 'https://assistir.biz/'
      },
      timeout: 15000
    }, (res) => {
      // Seguir redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        console.log(`✓ ${slug}: ${redirectUrl}`);
        resolve(redirectUrl);
      } else if (res.statusCode === 200) {
        console.log(`✓ ${slug}: ${proxyUrl}`);
        resolve(proxyUrl);
      } else {
        // Tenta hls.astr.digital
        const altUrl = `https://hls.astr.digital/hls/${slug}/master.m3u8`;
        https.get(altUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
            'Referer': 'https://assistir.biz/'
          },
          timeout: 15000
        }, (altRes) => {
          if (altRes.statusCode === 301 || altRes.statusCode === 302) {
            const redirectUrl = altRes.headers.location;
            console.log(`✓ ${slug}: ${redirectUrl} (alt)`);
            resolve(redirectUrl);
          } else if (altRes.statusCode === 200) {
            console.log(`✓ ${slug}: ${altUrl} (alt)`);
            resolve(altUrl);
          } else {
            console.log(`✗ ${slug}: Status ${altRes.statusCode}`);
            resolve(null);
          }
        }).on('error', () => {
          console.log(`✗ ${slug}: Erro na URL alternativa`);
          resolve(null);
        });
      }
    });

    req.on('error', (err) => {
      console.error(`✗ ${slug}: ${err.message}`);
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      console.error(`✗ ${slug}: Timeout`);
      resolve(null);
    });
  });
}

// Função principal
async function updateMovies() {
  console.log('=== Atualizando URLs dos filmes ===\n');
  
  const updatedMovies = [];
  
  for (const movie of movies) {
    console.log(`Buscando: ${movie.titulo}...`);
    const url = await getUpdatedUrl(movie.slug);
    
    updatedMovies.push({
      id: movie.id,
      titulo: movie.titulo,
      capa: movie.capa,
      url: url || ""
    });
    
    // Delay para não sobrecarregar o servidor
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Salvar no arquivo JSON
  const jsonContent = JSON.stringify(updatedMovies, null, 2);
  fs.writeFileSync('filmes.json', jsonContent, 'utf8');
  
  console.log('\n✓ Arquivo filmes.json atualizado!');
  console.log(`Total de filmes: ${updatedMovies.length}`);
  console.log(`URLs válidas: ${updatedMovies.filter(m => m.url).length}`);
  console.log(`URLs inválidas: ${updatedMovies.filter(m => !m.url).length}`);
}

// Executar
updateMovies().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
