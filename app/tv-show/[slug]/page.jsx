// app/tv-show/[slug]/page.jsx - FIXED VERSION DENGAN REVIEWS
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaUserCircle, FaStar, FaPlay, FaCalendar, FaTv, FaClock, FaImdb } from 'react-icons/fa';
import {
  getTvSeriesById,
  getTvSeriesVideos,
  getTvSeriesCredits,
  getTvSeriesReviews,
  searchMoviesAndTv,
  getSimilarTvSeries,
  getTvSeriesByCategory,
  getTvSeriesByGenre,
  getTvSeriesGenres,
  getTvSeriesWatchProviders,
} from '../../../lib/api';
import TvSeriesList from '../../../components/TvSeriesList';
import StreamingButtons from '../../../components/StreamingButtons';

const CATEGORIES = ['popular', 'top_rated', 'on_the_air', 'airing_today'];

// Utility untuk membuat slug dari nama TV show dengan format judul-tahun-id
export const createTvSlug = (tvShow) => {
  if (!tvShow || !tvShow.name) return '';
  
  // Clean title: remove special characters, replace spaces with hyphens
  const cleanTitle = tvShow.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();
  
  // Get year from first air date
  const year = tvShow.first_air_date ? tvShow.first_air_date.substring(0, 4) : '0000';
  
  // ALWAYS return format: title-year-id
  return `${cleanTitle}-${year}-${tvShow.id}`;
};

// Utility untuk membuat slug dari nama genre
const createGenreSlug = (name) => {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// ✅ FIXED: Utility function to extract data from slug - SIMPLIFIED VERSION
const extractTvDataFromSlug = (slug) => {
  // Pattern untuk match format: title-year-id (SAMA SEPERTI MOVIE)
  const pattern = /^(.*)-(\d{4})-(\d+)$/;
  const match = slug.match(pattern);
  
  if (match) {
    return {
      id: parseInt(match[3]),
      year: match[2],
      title: match[1].replace(/-/g, ' ')
    };
  }
  
  // FIXED: Check for title-year format (without ID)
  const yearPattern = /^(.*)-(\d{4})$/;
  const yearMatch = slug.match(yearPattern);
  
  if (yearMatch) {
    // Slug format: title-year (tanpa ID) - tidak bisa extract ID
    return {
      id: null,
      year: yearMatch[2],
      title: yearMatch[1].replace(/-/g, ' ')
    };
  }
  
  // FIXED: Improved fallback - hanya extract ID jika benar-benar yakin
  const parts = slug.split('-');
  
  // Coba cari bagian numeric yang panjang (bukan tahun 4-digit)
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    // Jika bagian ini numeric dan panjangnya > 4 digit, kemungkinan besar adalah ID
    if (/^\d+$/.test(part) && part.length > 4) {
      const id = parseInt(part);
      const remainingParts = parts.slice(0, i);
      
      // Coba extract tahun dari bagian terakhir remaining parts
      let year = null;
      let titleParts = remainingParts;
      
      if (remainingParts.length > 0) {
        const lastRemaining = remainingParts[remainingParts.length - 1];
        if (/^\d{4}$/.test(lastRemaining)) {
          year = lastRemaining;
          titleParts = remainingParts.slice(0, -1);
        }
      }
      
      return {
        id: id,
        year: year,
        title: titleParts.join('-').replace(/-/g, ' ') || 'Unknown Title'
      };
    }
  }
  
  // Final fallback - tidak ada ID yang valid ditemukan
  return {
    id: null,
    year: null,
    title: slug.replace(/-/g, ' ')
  };
};

// ✅ FIXED: Function untuk mencari TV show dengan logic yang lebih sederhana
async function findTvShowBySlug(slug, id, year, title) {
  // 1. Priority: Coba dengan ID jika tersedia dan valid
  if (id && id > 0) {
    try {
      const tvShowData = await getTvSeriesById(id);
      if (tvShowData && tvShowData.id) {
        return tvShowData;
      }
    } catch (error) {
      console.log('TV Show not found by ID:', id);
    }
  }

  // 2. Enhanced search dengan kombinasi title + year
  if (title && title.length > 1) {
    try {
      const searchResults = await searchMoviesAndTv(title);
      
      if (!searchResults || searchResults.length === 0) {
        return null;
      }

      // Filter hanya TV shows
      const tvShows = searchResults.filter(item => item.media_type === 'tv');

      if (tvShows.length === 0) {
        return null;
      }

      // Priority 1: Exact title + year match (if year available)
      if (year) {
        const matchingTvShow = tvShows.find(item => {
          const itemTitle = item.name?.toLowerCase().replace(/[^a-z0-9]/g, '');
          const searchTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
          const titleMatch = itemTitle === searchTitle;
          const itemYear = item.first_air_date?.substring(0, 4);
          const yearMatch = itemYear === year;
          
          return titleMatch && yearMatch;
        });
        
        if (matchingTvShow) {
          return await getTvSeriesById(matchingTvShow.id);
        }
      }

      // Priority 2: Exact title match (case insensitive, ignore special chars)
      const exactMatch = tvShows.find(item => {
        const itemTitle = item.name?.toLowerCase().replace(/[^a-z0-9]/g, '');
        const searchTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return itemTitle === searchTitle;
      });
      
      if (exactMatch) {
        return await getTvSeriesById(exactMatch.id);
      }

      // Priority 3: Contains title match
      const containsMatch = tvShows.find(item => {
        const itemTitle = item.name?.toLowerCase();
        const searchTitle = title.toLowerCase();
        return itemTitle && itemTitle.includes(searchTitle);
      });
      
      if (containsMatch) {
        return await getTvSeriesById(containsMatch.id);
      }

      // Priority 4: Ambil yang paling populer dari hasil search
      const mostPopular = tvShows.reduce((prev, current) => 
        (prev.popularity || 0) > (current.popularity || 0) ? prev : current
      );
      return await getTvSeriesById(mostPopular.id);

    } catch (error) {
      console.error('Error during TV show search:', error);
    }
  }

  return null;
}

// ✅ FIXED: Function to check if slug is a genre
async function isGenreSlug(slug) {
  try {
    const genres = await getTvSeriesGenres();
    const genreSlugs = genres.map(g => createGenreSlug(g.name));
    return genreSlugs.includes(slug);
  } catch (error) {
    console.error('Error checking genre slug:', error);
    return false;
  }
}

// --- ADVANCED METADATA GENERATION ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let tvShowData = null;

  // Cek apakah slug adalah kategori
  if (CATEGORIES.includes(slug)) {
    const title = slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `${title} TV Series - WatchNow`,
      description: `Browse the ${title} TV series collection on WatchNow. Stream legally on your favorite platforms.`,
      openGraph: {
        title: `${title} TV Series - WatchNow`,
        description: `Explore the ${title} TV series collection on WatchNow.`,
        url: `https://watchnow-movies.vercel.app/tv-show/${slug}`,
        siteName: 'WatchNow',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} TV Series - WatchNow`,
        description: `Explore ${title} TV series on WatchNow`,
      },
      alternates: {
        canonical: `https://watchnow-movies.vercel.app/tv-show/${slug}`,
      },
    };
  }

  // ✅ CEK JIKA SLUG ADALAH GENRE - REDIRECT KE HALAMAN GENRE
  const isGenre = await isGenreSlug(slug);
  if (isGenre) {
    const genreName = slug.replace(/-/g, ' ');
    return {
      title: `${genreName} TV Series - WatchNow`,
      description: `Discover the best ${genreName} TV series on WatchNow.`,
      openGraph: {
        title: `${genreName} TV Series - WatchNow`,
        description: `Explore ${genreName} TV series collection on WatchNow.`,
        url: `https://watchnow-movies.vercel.app/tv-show/genre/${slug}`,
        siteName: 'WatchNow',
        type: 'website',
      },
    };
  }

  // Logika untuk halaman detail TV show dengan format baru
  const { id, year, title } = extractTvDataFromSlug(slug);

  if (id) {
    // Try to get TV show by ID first (most reliable)
    try {
      tvShowData = await getTvSeriesById(id);
    } catch (error) {
      console.error('Error fetching TV show by ID:', error);
    }
  }

  // If TV show not found by ID, try search by title and year
  if (!tvShowData && title) {
    try {
      const searchResults = await searchMoviesAndTv(title);
      const matchingTvShow = searchResults.find(item => {
        const titleMatch = item.name?.toLowerCase().includes(title.toLowerCase());
        const yearMatch = !year || (item.first_air_date && item.first_air_date.substring(0, 4) === year);
        return item.media_type === 'tv' && titleMatch && yearMatch;
      });
      
      if (matchingTvShow) {
        tvShowData = await getTvSeriesById(matchingTvShow.id);
      }
    } catch (error) {
      console.error('Error searching TV show:', error);
    }
  }

  if (!tvShowData) {
    return {
      title: 'TV Series Not Found - WatchNow',
      description: 'Find thousands of TV series and movies to stream on WatchNow.',
    };
  }

  const socialImage = tvShowData.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${tvShowData.backdrop_path}`
    : tvShowData.poster_path
      ? `https://image.tmdb.org/t/p/w780${tvShowData.poster_path}`
      : `https://placehold.co/1200x630/1f2937/d1d5db?text=${encodeURIComponent(tvShowData.name)}`;

  const currentYear = new Date().getFullYear();
  const tvShowYear = tvShowData.first_air_date ? new Date(tvShowData.first_air_date).getFullYear() : currentYear;

  return {
    title: `${tvShowData.name} (${tvShowYear}) - Watch Now & Stream - WatchNow`,
    description: tvShowData.overview 
      ? `${tvShowData.overview.substring(0, 160)}... Find where to stream ${tvShowData.name} legally on WatchNow.`
      : `Watch ${tvShowData.name} (${tvShowYear}). Find streaming options, cast information, and reviews on WatchNow.`,
    keywords: `${tvShowData.name}, watch ${tvShowData.name}, stream ${tvShowData.name}, ${tvShowData.genres?.map(g => g.name).join(', ')}, ${tvShowYear} TV series`,
    openGraph: {
      title: `${tvShowData.name} (${tvShowYear}) - WatchNow`,
      description: tvShowData.overview || `Watch ${tvShowData.name} and find streaming options.`,
      url: `https://watchnow-movies.vercel.app/tv-show/${slug}`,
      siteName: 'WatchNow',
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `${tvShowData.name} TV series poster`,
        },
      ],
      type: 'video.tv_show',
      locale: 'en_US',
      releaseDate: tvShowData.first_air_date,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchNowMovies',
      creator: '@WatchNowMovies',
      title: `${tvShowData.name} (${tvShowYear}) - WatchNow`,
      description: tvShowData.overview?.substring(0, 200) || `Stream ${tvShowData.name} on WatchNow`,
      images: [socialImage],
    },
    alternates: {
      canonical: `https://watchnow-movies.vercel.app/tv-show/${slug}`,
    },
  };
}

// ✅ FIXED: MAIN PAGE COMPONENT dengan logic yang disederhanakan
export default async function TvShowPage({ params }) {
  const { slug } = await params;

  // ✅ CEK JIKA SLUG ADALAH GENRE - REDIRECT KE HALAMAN GENRE
  const isGenre = await isGenreSlug(slug);
  if (isGenre) {
    redirect(`/tv-show/genre/${slug}`);
  }

  // Cek jika slug adalah kategori
  if (CATEGORIES.includes(slug)) {
    const series = await getTvSeriesByCategory(slug);
    const title = slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6">
            <a href="/" className="hover:text-white">Home</a> &gt; 
            <a href="/tv-show" className="hover:text-white ml-2">TV Series</a> &gt; 
            <span className="ml-2 text-white">{title}</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
            {title} TV Series
          </h1>
          {series && series.length > 0 ? (
            <TvSeriesList series={series} />
          ) : (
            <p className="text-center text-white">There are no TV series in this category.</p>
          )}
        </div>
      </div>
    );
  }

  // --- HANYA TV SHOW DETAIL YANG DIPROSES DI SINI ---
  // Genre pages sudah di-redirect ke folder terpisah: /tv-show/genre/[genreName]
  
  let tvShowData = null;
  const { id, year, title } = extractTvDataFromSlug(slug);

  console.log('TV Show Slug Analysis:', { slug, id, year, title });

  // FIXED: Prioritize search by title+year jika ID tidak valid atau tidak ditemukan
  if (!id) {
    console.log('No valid ID found in slug, trying search by title and year');
    try {
      const searchResults = await searchMoviesAndTv(title);
      const matchingTvShow = searchResults.find(item => {
        const titleMatch = item.name?.toLowerCase().includes(title.toLowerCase());
        const yearMatch = !year || (item.first_air_date && item.first_air_date.substring(0, 4) === year);
        return item.media_type === 'tv' && titleMatch && yearMatch;
      });
      
      if (matchingTvShow) {
        console.log('TV Show found by search:', matchingTvShow.name);
        tvShowData = await getTvSeriesById(matchingTvShow.id);
      }
    } catch (error) {
      console.error('Error searching TV show:', error);
    }
  } else {
    // Primary method: get TV show by ID from slug
    try {
      tvShowData = await getTvSeriesById(id);
      console.log('TV Show found by ID:', tvShowData?.name);
    } catch (error) {
      console.error('Error fetching TV show by ID:', error);
      
      // Fallback: try search if ID fails
      if (title) {
        try {
          const searchResults = await searchMoviesAndTv(title);
          const matchingTvShow = searchResults.find(item => {
            const titleMatch = item.name?.toLowerCase().includes(title.toLowerCase());
            const yearMatch = !year || (item.first_air_date && item.first_air_date.substring(0, 4) === year);
            return item.media_type === 'tv' && titleMatch && yearMatch;
          });
          
          if (matchingTvShow) {
            console.log('TV Show found by search after ID failed:', matchingTvShow.name);
            tvShowData = await getTvSeriesById(matchingTvShow.id);
          }
        } catch (searchError) {
          console.error('Error searching TV show after ID failed:', searchError);
        }
      }
    }
  }

  if (!tvShowData) {
    console.log('TV Show not found, redirecting to 404');
    notFound();
  }

  // ✅ VERIFY SLUG - Redirect jika slug tidak sesuai format yang benar
  const correctSlug = createTvSlug(tvShowData);
  if (slug !== correctSlug) {
    console.log('Slug mismatch, redirecting to:', correctSlug);
    redirect(`/tv-show/${correctSlug}`);
  }

  // ✅ FIXED: Ambil data reviews dengan struktur yang benar
  const [videos, credits, reviews, similarTvSeries, watchProviders] = await Promise.all([
    getTvSeriesVideos(tvShowData.id),
    getTvSeriesCredits(tvShowData.id),
    getTvSeriesReviews(tvShowData.id), // ✅ Sekarang langsung return array
    getSimilarTvSeries(tvShowData.id),
    getTvSeriesWatchProviders(tvShowData.id),
  ]);

  const backdropUrl = tvShowData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tvShowData.backdrop_path}` : null;
  const posterUrl = tvShowData.poster_path ? `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}` : null;

  const trailer = videos && videos.length > 0 ? videos.find((video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')) : null;
  const cast = credits?.cast?.slice(0, 12) || [];
  const crew = credits?.crew?.filter(member => ['Creator', 'Director', 'Writer'].includes(member.job)).slice(0, 6) || [];
  
  // ✅ FIXED: reviews sekarang langsung array, tidak perlu .results
  const userReviews = Array.isArray(reviews) ? reviews.slice(0, 5) : [];

  // ✅ FIXED: Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tvShowData.name,
    description: tvShowData.overview,
    image: posterUrl,
    dateCreated: tvShowData.first_air_date,
    creator: crew.find(m => m.job === 'Creator')?.name,
    actor: cast.slice(0, 5).map(actor => ({
      '@type': 'Person',
      name: actor.name,
      character: actor.character
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tvShowData.vote_average,
      ratingCount: tvShowData.vote_count,
      bestRating: 10,
      worstRating: 0
    },
    numberOfSeasons: tvShowData.number_of_seasons,
    numberOfEpisodes: tvShowData.number_of_episodes,
    genre: tvShowData.genres?.map(g => g.name),
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-4">
        <nav className="text-sm text-gray-400">
          <a href="/" className="hover:text-white">Home</a> &gt; 
          <a href="/tv-show" className="hover:text-white ml-2">TV Series</a> &gt; 
          <span className="ml-2 text-white">{tvShowData.name}</span>
        </nav>
      </div>

      {/* Hero Section dengan Backdrop */}
      <div className="relative">
        {backdropUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
            <Image
              src={backdropUrl}
              alt={`${tvShowData.name} backdrop`}
              fill
              style={{ objectFit: 'cover' }}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
          </div>
        )}

        {/* TV Show Info Overlay */}
        <div className="container mx-auto px-4 relative z-10 -mt-20 md:-mt-32">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl || `https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available`}
                  alt={`${tvShowData.name} poster`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* TV Show Details */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {tvShowData.name}
              </h1>
              
              {tvShowData.tagline && (
                <p className="text-xl text-gray-300 mb-4 italic">"{tvShowData.tagline}"</p>
              )}

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-yellow-600 rounded-full px-3 py-1 text-sm font-semibold">
                  <FaStar className="text-yellow-300 mr-1" />
                  {tvShowData.vote_average.toFixed(1)}/10
                </div>
                <span className="text-gray-300">
                  {tvShowData.first_air_date?.substring(0, 4)}
                </span>
                <span className="text-gray-300">
                  {tvShowData.number_of_seasons} Season{tvShowData.number_of_seasons !== 1 ? 's' : ''}
                </span>
                <span className="text-gray-300">
                  {tvShowData.number_of_episodes} Episode{tvShowData.number_of_episodes !== 1 ? 's' : ''}
                </span>
                <span className="text-gray-300">
                  {tvShowData.genres?.map(g => g.name).join(' • ')}
                </span>
                {tvShowData.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    tvShowData.status === 'Returning Series' ? 'bg-green-600' :
                    tvShowData.status === 'Ended' ? 'bg-red-600' :
                    'bg-blue-600'
                  }`}>
                    {tvShowData.status}
                  </span>
                )}
              </div>

              {/* Streaming Buttons - AFFILIATE INTEGRATION */}
              <div className="mb-6">
                <StreamingButtons 
                  title={tvShowData.name}
                  mediaType="tv"
                  watchProviders={watchProviders}
                />
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {tvShowData.overview || 'Synopsis not available.'}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong className="text-gray-400">Status:</strong> {tvShowData.status}</p>
                  <p><strong className="text-gray-400">Type:</strong> {tvShowData.type}</p>
                  <p><strong className="text-gray-400">Network:</strong> {tvShowData.networks?.map(n => n.name).join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <p><strong className="text-gray-400">Creator:</strong> {crew.find(m => m.job === 'Creator')?.name || 'N/A'}</p>
                  <p><strong className="text-gray-400">Last Air Date:</strong> {tvShowData.last_air_date ? new Date(tvShowData.last_air_date).toLocaleDateString() : 'N/A'}</p>
                  {tvShowData.homepage && (
                    <p>
                      <strong className="text-gray-400">Website:</strong>{' '}
                      <a href={tvShowData.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        Official Site
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 mt-8">
        
        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-blue-500 transition-colors">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <FaUserCircle className="text-3xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{actor.name}</p>
                  <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailer Section */}
        {trailer && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Trailer</h2>
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden">
              <iframe
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0&showinfo=0`}
                title={`${tvShowData.name} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* ✅ FIXED: Reviews Section - Sekarang harus muncul */}
        {userReviews.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              User Reviews ({userReviews.length})
            </h2>
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {review.author_details?.rating || '★'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{review.author}</p>
                      <p className="text-sm text-gray-400">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // Tampilkan pesan jika tidak ada reviews
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">User Reviews</h2>
            <div className="text-center py-8 bg-gray-800/30 rounded-xl">
              <FaUserCircle className="text-4xl text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No user reviews yet for this TV series.</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to write a review!</p>
            </div>
          </section>
        )}

        {/* Similar TV Series - FIXED OVERLAY */}
        {similarTvSeries && similarTvSeries.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Similar TV Series</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {similarTvSeries.slice(0, 12).map((series) => (
                <div key={series.id} className="group">
                  <a href={`/tv-show/${createTvSlug(series)}`} className="block">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={series.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                          : 'https://placehold.co/500x750/1f2937/d1d5db?text=No+Image'
                        }
                        alt={series.name}
                        fill
                        className="object-cover"
                      />
                      
                      {/* FIXED OVERLAY - Less Dark, Better Visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-sm font-semibold line-clamp-2 mb-1">{series.name}</h3>
                          <p className="text-gray-200 text-xs">
                            {series.first_air_date?.substring(0, 4)}
                          </p>
                          {series.vote_average > 0 && (
                            <p className="text-yellow-400 text-xs mt-1 flex items-center">
                              ⭐ {series.vote_average.toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Streaming CTA */}
        <div className="text-center py-8 border-t border-gray-700">
          <h3 className="text-2xl font-bold mb-4">Ready to Watch?</h3>
          <p className="text-gray-300 mb-6">Stream {tvShowData.name} on your favorite platforms</p>
          <StreamingButtons 
            title={tvShowData.name}
            mediaType="tv"
            watchProviders={watchProviders}
            large
          />
        </div>
      </div>
    </div>
  );
}