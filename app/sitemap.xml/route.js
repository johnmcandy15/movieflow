// app/sitemap.xml/route.js - FIXED VERSION
import { NextResponse } from 'next/server';

const BASE_URL = 'https://MoviesFlow.netlify.app';

// Function untuk generate XML sitemap
function generateSitemapXml(urls) {
  const urlEntries = urls.map(url => `
    <url>
      <loc>${url.url}</loc>
      <lastmod>${url.lastModified}</lastmod>
      <changefreq>${url.changeFrequency}</changefreq>
      <priority>${url.priority}</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;
}

// Function untuk generate slug SEO-friendly
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// AMBIL DATA REAL DARI TMDB API - FIXED ENV VARIABLE
async function getTMDBContent() {
  // GUNAKAN NEXT_PUBLIC_TMDB_API_KEY bukan TMDB_API_KEY
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  console.log('🔍 DEBUG - API Key Status:', apiKey ? `✅ Set (${apiKey.substring(0, 10)}...)` : '❌ NOT SET');
  
  if (!apiKey) {
    console.error('❌ NEXT_PUBLIC_TMDB_API_KEY not found in environment variables');
    return getSampleContent();
  }

  try {
    console.log('🔄 Fetching data from TMDB API...');
    
    // Fetch Popular Movies
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1&region=US`
    );
    
    if (!movieResponse.ok) {
      throw new Error(`TMDB API error: ${movieResponse.status}`);
    }
    
    const movieData = await movieResponse.json();
    
    // Fetch Popular TV Shows
    const tvResponse = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    
    if (!tvResponse.ok) {
      throw new Error(`TV API error: ${tvResponse.status}`);
    }
    
    const tvData = await tvResponse.json();
    
    // Fetch Popular People
    const peopleResponse = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    
    const peopleData = peopleResponse.ok ? await peopleResponse.json() : { results: [] };

    console.log(`✅ TMDB Data Success: ${movieData.results.length} movies, ${tvData.results.length} TV shows, ${peopleData.results?.length || 0} people`);

    return {
      movies: movieData.results.slice(0, 50), // Limit untuk testing
      tvShows: tvData.results.slice(0, 30),
      people: peopleData.results?.slice(0, 20) || []
    };

  } catch (error) {
    console.error('❌ Error fetching from TMDB:', error.message);
    return getSampleContent();
  }
}

// Fallback sample data
function getSampleContent() {
  console.log('🔄 Using sample data as fallback...');
  
  const sampleMovies = [
    { id: 1, title: 'Avengers: Endgame', release_date: '2019-04-26' },
    { id: 2, title: 'Spider-Man: No Way Home', release_date: '2021-12-17' },
    { id: 3, title: 'The Batman', release_date: '2022-03-04' },
  ];

  const sampleTVShows = [
    { id: 1, name: 'Stranger Things', first_air_date: '2016-07-15' },
    { id: 2, name: 'The Mandalorian', first_air_date: '2019-11-12' },
  ];

  const samplePeople = [
    { id: 1, name: 'Tom Cruise' },
    { id: 2, name: 'Leonardo DiCaprio' },
  ];

  return {
    movies: sampleMovies,
    tvShows: sampleTVShows,
    people: samplePeople
  };
}

// Static URLs data
async function generateSitemapUrls() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // ========== STATIC PAGES ==========
  const staticUrls = [
    { url: `${BASE_URL}/`, lastModified: currentDate, changeFrequency: 'daily', priority: '1.0' },
    { url: `${BASE_URL}/movie`, lastModified: currentDate, changeFrequency: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/tv`, lastModified: currentDate, changeFrequency: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/search`, lastModified: currentDate, changeFrequency: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/rankings`, lastModified: currentDate, changeFrequency: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/people`, lastModified: currentDate, changeFrequency: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: '0.3' },
    { url: `${BASE_URL}/dmca`, lastModified: currentDate, changeFrequency: 'yearly', priority: '0.1' },
    { url: `${BASE_URL}/privacy-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: '0.1' },
    { url: `${BASE_URL}/terms-of-service`, lastModified: currentDate, changeFrequency: 'yearly', priority: '0.1' },
    { url: `${BASE_URL}/rss`, lastModified: currentDate, changeFrequency: 'daily', priority: '0.5' },
  ];

  // ========== CATEGORY PAGES ==========
  const categories = ['popular', 'top_rated', 'now_playing', 'upcoming', 'trending'];
  const categoryUrls = categories.flatMap(category => [
    {
      url: `${BASE_URL}/movie?category=${category}`,
      lastModified: currentDate,
      changeFrequency: category === 'trending' ? 'hourly' : 'daily',
      priority: category === 'popular' ? '0.9' : '0.8'
    },
    {
      url: `${BASE_URL}/tv?category=${category}`,
      lastModified: currentDate,
      changeFrequency: category === 'trending' ? 'hourly' : 'daily',
      priority: category === 'popular' ? '0.9' : '0.8'
    }
  ]);

  // ========== YEAR & DECADE PAGES ==========
  const currentYear = new Date().getFullYear();
  const recentYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const yearUrls = recentYears.map(year => ({
    url: `${BASE_URL}/movie/year/${year}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: '0.6'
  }));
  
  const decades = Array.from({ length: 10 }, (_, i) => 2020 - (i * 10));
  const decadeUrls = decades.map(decade => ({
    url: `${BASE_URL}/movie/decade/${decade}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: '0.5'
  }));

  // ========== GENRE PAGES ==========
  const movieGenres = [
    'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary',
    'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'mystery',
    'romance', 'science-fiction', 'thriller', 'war', 'western'
  ];
  
  const tvGenres = [
    'action-adventure', 'animation', 'comedy', 'crime', 'documentary',
    'drama', 'family', 'kids', 'mystery', 'reality', 'sci-fi-fantasy',
    'soap', 'talk', 'war-politics', 'western'
  ];

  const movieGenreUrls = movieGenres.map(genre => ({
    url: `${BASE_URL}/movie/genre/${genre}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: '0.7'
  }));

  const tvGenreUrls = tvGenres.map(genre => ({
    url: `${BASE_URL}/tv/genre/${genre}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: '0.7'
  }));

  // ========== DYNAMIC CONTENT URLs ==========
  const dynamicContent = await getTMDBContent();
  
  // Movies URLs
  const movieUrls = dynamicContent.movies.map(movie => {
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : new Date().getFullYear();
    const slug = generateSlug(movie.title);
    return {
      url: `${BASE_URL}/movie/${slug}-${year}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: '0.8'
    };
  });

  // TV Shows URLs
  const tvUrls = dynamicContent.tvShows.map(tv => {
    const year = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : new Date().getFullYear();
    const slug = generateSlug(tv.name);
    return {
      url: `${BASE_URL}/tv/${slug}-${year}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: '0.8'
    };
  });

  // People URLs
  const peopleUrls = dynamicContent.people.map(person => {
    const slug = generateSlug(person.name);
    return {
      url: `${BASE_URL}/people/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: '0.6'
    };
  });

  // ========== COMBINE ALL URLS ==========
  return [
    ...staticUrls,
    ...categoryUrls,
    ...yearUrls,
    ...decadeUrls,
    ...movieGenreUrls,
    ...tvGenreUrls,
    ...movieUrls,
    ...tvUrls,
    ...peopleUrls
  ];
}

// GET handler
export async function GET() {
  try {
    console.log('🔄 Generating dynamic sitemap with TMDB data...');
    
    const allUrls = await generateSitemapUrls();
    const sitemapXml = generateSitemapXml(allUrls);

    console.log(`✅ Dynamic sitemap generated with ${allUrls.length} URLs`);

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback basic sitemap
    const fallbackUrls = [
      { url: `${BASE_URL}/`, lastModified: new Date().toISOString().split('T')[0], changeFrequency: 'daily', priority: '1.0' },
      { url: `${BASE_URL}/movie`, lastModified: new Date().toISOString().split('T')[0], changeFrequency: 'daily', priority: '0.9' },
      { url: `${BASE_URL}/tv`, lastModified: new Date().toISOString().split('T')[0], changeFrequency: 'daily', priority: '0.9' },
    ];
    
    const fallbackXml = generateSitemapXml(fallbackUrls);
    
    return new NextResponse(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

export const dynamic = 'force-dynamic';