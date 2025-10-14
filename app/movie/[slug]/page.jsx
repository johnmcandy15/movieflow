// app/movie/[slug]/page.jsx - FIXED VERSION (WITH PROPER SLUG HANDLING)
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaUserCircle, FaStar, FaInfoCircle, FaPlay } from 'react-icons/fa';
import {
  getMovieById,
  getMovieVideos,
  getMovieCredits,
  getMovieReviews,
  searchMoviesAndTv,
  getSimilarMovies,
  getMoviesByCategory,
  getMovieWatchProviders,
  getMovieGenres,
} from '../../../lib/api';
import MovieList from '../../../components/MovieList';
import StreamingButtons from '../../../components/StreamingButtons';

const CATEGORIES = ['now_playing', 'popular', 'top_rated', 'upcoming'];

// Utility function to create SEO-friendly slug - FIXED VERSION
export const createMovieSlug = (movie) => {
  if (!movie || !movie.title) return '';
  
  // Clean title: remove special characters, replace spaces with hyphens
  const cleanTitle = movie.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();
  
  // Get year from release date
  const year = movie.release_date ? movie.release_date.substring(0, 4) : '0000';
  
  // ALWAYS return format: title-year-id
  return `${cleanTitle}-${year}-${movie.id}`;
};

// Utility function to extract data from slug - FIXED VERSION
const extractMovieDataFromSlug = (slug) => {
  // Pattern untuk match format: title-year-id
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

// Function to check if slug is a genre
async function isGenreSlug(slug) {
  try {
    const genres = await getMovieGenres();
    const genreSlugs = genres.map(g => g.name.toLowerCase().replace(/\s/g, '-'));
    return genreSlugs.includes(slug);
  } catch (error) {
    console.error('Error checking genre slug:', error);
    return false;
  }
}

// --- OPTIMIZED METADATA API ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let movieData = null;

  // Cek jika slug adalah kategori
  if (CATEGORIES.includes(slug)) {
    const title = slug.replace(/_/g, ' ').toUpperCase();
    return {
      title: `${title} Movies - MoviesFlow`,
      description: `Explore the ${title} movies collection on MoviesFlow. Stream legally on your favorite platforms.`,
      openGraph: {
        title: `${title} Movies - MoviesFlow`,
        description: `Explore the ${title} movies collection on MoviesFlow.`,
        url: `https://MoviesFlow.netlify.app/movie/${slug}`,
        siteName: 'MoviesFlow',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} Movies - MoviesFlow`,
        description: `Explore ${title} movies on MoviesFlow`,
      },
      alternates: {
        canonical: `https://MoviesFlow.netlify.app/movie/${slug}`,
      },
    };
  }

  // ✅ CEK JIKA SLUG ADALAH GENRE - REDIRECT KE HALAMAN GENRE
  const isGenre = await isGenreSlug(slug);
  if (isGenre) {
    const genreName = slug.replace(/-/g, ' ');
    return {
      title: `${genreName} Movies - MoviesFlow`,
      description: `Discover the best ${genreName} movies on MoviesFlow.`,
      openGraph: {
        title: `${genreName} Movies - MoviesFlow`,
        description: `Explore ${genreName} movie collection on MoviesFlow.`,
        url: `https://MoviesFlow.netlify.app/movie/genre/${slug}`,
        siteName: 'MoviesFlow',
        type: 'website',
      },
    };
  }

  // Logika untuk halaman detail film dengan format baru
  const { id, year, title } = extractMovieDataFromSlug(slug);

  if (id) {
    // Try to get movie by ID first (most reliable)
    try {
      movieData = await getMovieById(id);
    } catch (error) {
      console.error('Error fetching movie by ID:', error);
    }
  }

  // If movie not found by ID, try search by title and year
  if (!movieData && title) {
    try {
      const searchResults = await searchMoviesAndTv(title);
      const matchingMovie = searchResults.find(item => {
        const titleMatch = item.title?.toLowerCase().includes(title.toLowerCase());
        const yearMatch = !year || (item.release_date && item.release_date.substring(0, 4) === year);
        return item.media_type === 'movie' && titleMatch && yearMatch;
      });
      
      if (matchingMovie) {
        movieData = await getMovieById(matchingMovie.id);
      }
    } catch (error) {
      console.error('Error searching movie:', error);
    }
  }

  if (!movieData) {
    return {
      title: 'Movie Not Found - MoviesFlow',
      description: 'Find thousands of movies and TV series to stream on MoviesFlow.',
    };
  }

  const socialImage = movieData.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`
    : movieData.poster_path
      ? `https://image.tmdb.org/t/p/w780${movieData.poster_path}`
      : `https://placehold.co/1200x630/1f2937/d1d5db?text=${encodeURIComponent(movieData.title)}`;

  const currentYear = new Date().getFullYear();
  const movieYear = movieData.release_date ? new Date(movieData.release_date).getFullYear() : currentYear;

  return {
    title: `${movieData.title} (${movieYear}) - Watch Now & Stream - MoviesFlow`,
    description: movieData.overview 
      ? `${movieData.overview.substring(0, 160)}... Find where to stream ${movieData.title} legally on MoviesFlow.`
      : `Watch ${movieData.title} (${movieYear}). Find streaming options, cast information, and reviews on MoviesFlow.`,
    keywords: `${movieData.title}, watch ${movieData.title}, stream ${movieData.title}, ${movieData.genres?.map(g => g.name).join(', ')}, ${movieYear} movie`,
    openGraph: {
      title: `${movieData.title} (${movieYear}) - MoviesFlow`,
      description: movieData.overview || `Watch ${movieData.title} and find streaming options.`,
      url: `https://MoviesFlow.netlify.app/movie/${slug}`,
      siteName: 'MoviesFlow',
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `${movieData.title} movie poster`,
        },
      ],
      type: 'video.movie',
      locale: 'en_US',
      releaseDate: movieData.release_date,
      duration: movieData.runtime ? `PT${movieData.runtime}M` : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `${movieData.title} (${movieYear}) - MoviesFlow`,
      description: movieData.overview?.substring(0, 200) || `Stream ${movieData.title} on MoviesFlow`,
      images: [socialImage],
    },
    alternates: {
      canonical: `https://MoviesFlow.netlify.app/movie/${slug}`,
    },
  };
}

// Main component dengan SEO optimization - FIXED VERSION
export default async function MoviePage({ params }) {
  const { slug } = await params;

  // ✅ CEK JIKA SLUG ADALAH GENRE - REDIRECT KE HALAMAN GENRE
  const isGenre = await isGenreSlug(slug);
  if (isGenre) {
    redirect(`/movie/genre/${slug}`);
  }

  // Cek jika slug adalah kategori
  if (CATEGORIES.includes(slug)) {
    const movies = await getMoviesByCategory(slug);
    const title = slug.replace(/_/g, ' ').toUpperCase();

    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6">
            <a href="/" className="hover:text-white">Home</a> &gt; 
            <a href="/movie" className="hover:text-white ml-2">Movies</a> &gt; 
            <span className="ml-2 text-white">{title}</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
            {title} Movies
          </h1>
          {movies && movies.length > 0 ? (
            <MovieList movies={movies} />
          ) : (
            <p className="text-center text-white">There are no movies in this category.</p>
          )}
        </div>
      </div>
    );
  }

  // --- HANYA MOVIE DETAIL YANG DIPROSES DI SINI ---
  // Genre pages sudah di-redirect ke folder terpisah: /movie/genre/[genreName]
  
  let movieData = null;
  const { id, year, title } = extractMovieDataFromSlug(slug);

  console.log('Slug Analysis:', { slug, id, year, title }); // Debug log

  // FIXED: Prioritize search by title+year jika ID tidak valid atau tidak ditemukan
  if (!id) {
    console.log('No valid ID found in slug, trying search by title and year');
    try {
      const searchResults = await searchMoviesAndTv(title);
      const matchingMovie = searchResults.find(item => {
        const titleMatch = item.title?.toLowerCase().includes(title.toLowerCase());
        const yearMatch = !year || (item.release_date && item.release_date.substring(0, 4) === year);
        return item.media_type === 'movie' && titleMatch && yearMatch;
      });
      
      if (matchingMovie) {
        console.log('Movie found by search:', matchingMovie.title);
        movieData = await getMovieById(matchingMovie.id);
      }
    } catch (error) {
      console.error('Error searching movie:', error);
    }
  } else {
    // Primary method: get movie by ID from slug
    try {
      movieData = await getMovieById(id);
      console.log('Movie found by ID:', movieData?.title);
    } catch (error) {
      console.error('Error fetching movie by ID:', error);
      
      // Fallback: try search if ID fails
      if (title) {
        try {
          const searchResults = await searchMoviesAndTv(title);
          const matchingMovie = searchResults.find(item => {
            const titleMatch = item.title?.toLowerCase().includes(title.toLowerCase());
            const yearMatch = !year || (item.release_date && item.release_date.substring(0, 4) === year);
            return item.media_type === 'movie' && titleMatch && yearMatch;
          });
          
          if (matchingMovie) {
            console.log('Movie found by search after ID failed:', matchingMovie.title);
            movieData = await getMovieById(matchingMovie.id);
          }
        } catch (searchError) {
          console.error('Error searching movie after ID failed:', searchError);
        }
      }
    }
  }

  if (!movieData) {
    console.log('Movie not found, redirecting to 404');
    notFound();
  }

  // ✅ VERIFY SLUG - Redirect jika slug tidak sesuai format yang benar
  const correctSlug = createMovieSlug(movieData);
  if (slug !== correctSlug) {
    console.log('Slug mismatch, redirecting to:', correctSlug);
    redirect(`/movie/${correctSlug}`);
  }

  const [videos, credits, reviews, similarMovies, watchProviders] = await Promise.all([
    getMovieVideos(movieData.id),
    getMovieCredits(movieData.id),
    getMovieReviews(movieData.id),
    getSimilarMovies(movieData.id),
    getMovieWatchProviders(movieData.id),
  ]);

  const backdropUrl = movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null;
  const posterUrl = movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null;

  const trailer = videos && videos.length > 0 ? videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') : null;
  const cast = credits.cast.slice(0, 12);
  const crew = credits.crew.filter(member => ['Director', 'Writer', 'Screenplay', 'Producer'].includes(member.job)).slice(0, 6);
  const userReviews = reviews ? reviews.slice(0, 5) : [];

  // ✅ FIXED: Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movieData.title,
    description: movieData.overview,
    image: posterUrl,
    dateCreated: movieData.release_date,
    director: crew.find(m => m.job === 'Director')?.name,
    author: crew.filter(m => ['Writer', 'Screenplay'].includes(m.job)).map(m => ({ '@type': 'Person', name: m.name })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movieData.vote_average,
      ratingCount: movieData.vote_count,
      bestRating: 10,
      worstRating: 0
    },
    duration: movieData.runtime ? `PT${movieData.runtime}M` : undefined,
    genre: movieData.genres?.map(g => g.name),
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
          <a href="/movie" className="hover:text-white ml-2">Movies</a> &gt; 
          <span className="ml-2 text-white">{movieData.title}</span>
        </nav>
      </div>

      {/* Hero Section dengan Backdrop */}
      <div className="relative">
        {backdropUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
            <Image
              src={backdropUrl}
              alt={`${movieData.title} backdrop`}
              fill
              style={{ objectFit: 'cover' }}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
          </div>
        )}

        {/* Movie Info Overlay */}
        <div className="container mx-auto px-4 relative z-10 -mt-20 md:-mt-32">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl || `https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available`}
                  alt={`${movieData.title} poster`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Movie Details */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {movieData.title}
              </h1>
              
              {movieData.tagline && (
                <p className="text-xl text-gray-300 mb-4 italic">"{movieData.tagline}"</p>
              )}

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-yellow-600 rounded-full px-3 py-1 text-sm font-semibold">
                  <FaStar className="text-yellow-300 mr-1" />
                  {movieData.vote_average.toFixed(1)}/10
                </div>
                <span className="text-gray-300">
                  {movieData.release_date?.substring(0, 4)}
                </span>
                <span className="text-gray-300">
                  {movieData.runtime ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : 'N/A'}
                </span>
                <span className="text-gray-300">
                  {movieData.genres?.map(g => g.name).join(' • ')}
                </span>
              </div>

              {/* Streaming Buttons - AFFILIATE INTEGRATION */}
              <div className="mb-6">
                <StreamingButtons 
                  title={movieData.title}
                  mediaType="movie"
                  watchProviders={watchProviders}
                />
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {movieData.overview || 'Synopsis not available.'}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong className="text-gray-400">Status:</strong> {movieData.status}</p>
                  <p><strong className="text-gray-400">Budget:</strong> {movieData.budget ? `$${movieData.budget.toLocaleString()}` : 'N/A'}</p>
                  <p><strong className="text-gray-400">Revenue:</strong> {movieData.revenue ? `$${movieData.revenue.toLocaleString()}` : 'N/A'}</p>
                </div>
                <div>
                  <p><strong className="text-gray-400">Director:</strong> {crew.find(m => m.job === 'Director')?.name || 'N/A'}</p>
                  <p><strong className="text-gray-400">Writer:</strong> {crew.find(m => m.job === 'Writer')?.name || 'N/A'}</p>
                  {movieData.homepage && (
                    <p>
                      <strong className="text-gray-400">Website:</strong>{' '}
                      <a href={movieData.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
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
                title={`${movieData.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {userReviews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">User Reviews</h2>
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
        )}

        {/* Similar Movies - FIXED OVERLAY */}
        {similarMovies && similarMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {similarMovies.slice(0, 12).map((movie) => (
                <div key={movie.id} className="group">
                  <a href={`/movie/${createMovieSlug(movie)}`} className="block">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://placehold.co/500x750/1f2937/d1d5db?text=No+Image'
                        }
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* FIXED OVERLAY - Less Dark, Better Visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-sm font-semibold line-clamp-2 mb-1">{movie.title}</h3>
                          <p className="text-gray-200 text-xs">
                            {movie.release_date?.substring(0, 4)}
                          </p>
                          {movie.vote_average > 0 && (
                            <p className="text-yellow-400 text-xs mt-1 flex items-center">
                              ⭐ {movie.vote_average.toFixed(1)}
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
          <p className="text-gray-300 mb-6">Stream {movieData.title} on your favorite platforms</p>
          <StreamingButtons 
            title={movieData.title}
            mediaType="movie"
            watchProviders={watchProviders}
            large
          />
        </div>
      </div>
    </div>
  );
}