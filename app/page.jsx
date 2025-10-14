// app/page.jsx - FIXED VERSION
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MovieFlow | Stream Movies & TV Series Free - Complete Entertainment Hub',
  description: 'Watch thousands of movies and TV series for free. Discover trending shows, popular movies, and top-rated content updated daily. Your ultimate streaming destination.',
  keywords: 'free movies, stream tv series, watch online, trending movies, popular shows, entertainment hub, movie database, TV series collection',
  openGraph: {
    title: 'MovieFlow | Free Movies & TV Series Streaming',
    description: 'Discover thousands of movies and TV series to stream for free. Updated daily with new content and trending shows.',
    url: 'https://MovieFlow.vercel.app/',
    siteName: 'MovieFlow',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/54844423650_2eea561c34_b.jpg',
        width: 1200,
        height: 630,
        alt: 'MovieFlow - Stream Movies & TV Series Free',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MovieFlowMovies',
    creator: '@MovieFlowMovies',
    title: 'MovieFlow | Free Movies & TV Series Streaming',
    description: 'Discover thousands of movies and TV series to stream for free on MovieFlow.',
    images: ['https://live.staticflickr.com/65535/54844423650_2eea561c34_b.jpg'],
  },
  alternates: {
    canonical: 'https://MovieFlow.vercel.app/',
  },
};

import { getTrendingMoviesDaily, getPopularMovies, getPopularTvSeries, getTopRatedMovies } from '../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlay, FaFire, FaStar, FaTv, FaArrowRight, FaFilm, FaUsers, FaCalendar, FaEye } from 'react-icons/fa';

// Utility function untuk membuat slug dengan format judul-tahun-id
const createMovieSlug = (movie) => {
  const title = movie.title || movie.name;
  if (!title) return movie.id.toString();
  
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const year = movie.release_date ? 
    movie.release_date.substring(0, 4) : 
    '0000';
  
  return `${baseSlug}-${year}-${movie.id}`;
};

const createTvSlug = (tvShow) => {
  const title = tvShow.name || tvShow.title;
  if (!title) return tvShow.id.toString();
  
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const year = tvShow.first_air_date ? 
    tvShow.first_air_date.substring(0, 4) : 
    '0000';
  
  return `${baseSlug}-${year}-${tvShow.id}`;
};

// Simple MediaCard component untuk homepage - FIXED LINKS
const MediaCard = ({ item }) => {
  const isTV = item.media_type === 'tv' || item.name;
  const title = item.title || item.name;
  const date = isTV ? item.first_air_date : item.release_date;
  const year = date ? new Date(date).getFullYear() : 'TBA';
  
  // ✅ FIXED: Gunakan path yang benar
  const slug = isTV ? createTvSlug(item) : createMovieSlug(item);
  
  return (
    <div className="group bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-all duration-300 hover:shadow-xl border border-slate-700 hover:border-slate-600">
      {/* ✅ FIXED: Path TV show yang benar */}
      <Link href={isTV ? `/tv-show/${slug}` : `/movie/${slug}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              {isTV ? <FaTv className="text-4xl text-gray-500" /> : <FaFilm className="text-4xl text-gray-500" />}
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
              <p className="text-gray-200 text-xs">
                {year}
              </p>
              {item.vote_average > 0 && (
                <p className="text-yellow-400 text-xs mt-1 flex items-center">
                  ⭐ {item.vote_average.toFixed(1)}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1 group-hover:text-orange-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{year}</span>
            {item.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-xs" />
                <span>{item.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default async function HomePage() {
  try {
    // Fetch data untuk berbagai section
    const [trendingData, popularMoviesData, popularTvData, topRatedData] = await Promise.all([
      getTrendingMoviesDaily(),
      getPopularMovies(),
      getPopularTvSeries(),
      getTopRatedMovies()
    ]);

    // Handle data response (bisa berupa array langsung atau object dengan results)
    const trendingMovies = Array.isArray(trendingData) ? trendingData : (trendingData.results || []);
    const popularMovies = Array.isArray(popularMoviesData) ? popularMoviesData : (popularMoviesData.results || []);
    const popularTvSeries = Array.isArray(popularTvData) ? popularTvData : (popularTvData.results || []);
    const topRatedMovies = Array.isArray(topRatedData) ? topRatedData : (topRatedData.results || []);

    // Filter data yang memiliki poster
    const filteredTrending = trendingMovies.filter(item => item.poster_path).slice(0, 12);
    const filteredPopularMovies = popularMovies.filter(item => item.poster_path).slice(0, 12);
    const filteredPopularTv = popularTvSeries.filter(item => item.poster_path).slice(0, 12);
    const filteredTopRated = topRatedMovies.filter(item => item.poster_path).slice(0, 12);

    // Calculate statistics
    const totalMovies = filteredPopularMovies.length + filteredTopRated.length;
    const totalTvSeries = filteredPopularTv.length;
    const totalContent = totalMovies + totalTvSeries;

    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-900/80 to-slate-900 py-20 lg:py-28">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Watch Amazing Movies & TV Series
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover thousands of movies and TV series. Find where to stream legally on your favorite platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {/* ✅ FIXED: Path yang benar */}
              <Link 
                href="movie/decade/2020s" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <FaPlay className="text-sm" /> Start Watching Movies
              </Link>
              <Link 
                href="/tv-show/popular" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <FaTv className="text-sm" /> Browse TV Series
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{totalContent}+</div>
                <div className="text-gray-300 text-sm">Total Content</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{filteredPopularMovies.length}+</div>
                <div className="text-gray-300 text-sm">Popular Movies</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{filteredPopularTv.length}+</div>
                <div className="text-gray-300 text-sm">TV Series</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{filteredTrending.length}+</div>
                <div className="text-gray-300 text-sm">Trending Today</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Trending Movies Section */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FaFire className="text-red-500 text-2xl" />
                Trending Now
                <span className="text-sm bg-red-600 text-white px-2 py-1 rounded-full">Live</span>
              </h2>
              <Link 
                href="/movie?category=trending" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
              >
                View All <FaArrowRight className="text-sm" />
              </Link>
            </div>
            {filteredTrending.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredTrending.map((movie) => (
                  <MediaCard key={movie.id} item={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <FaFire className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No trending movies available at the moment.</p>
              </div>
            )}
          </section>

          {/* Popular Movies Section */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FaStar className="text-yellow-500 text-2xl" />
                Popular Movies
              </h2>
              <Link 
                href="/movie?category=popular" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
              >
                View All <FaArrowRight className="text-sm" />
              </Link>
            </div>
            {filteredPopularMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredPopularMovies.map((movie) => (
                  <MediaCard key={movie.id} item={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <FaFilm className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No popular movies available at the moment.</p>
              </div>
            )}
          </section>

          {/* Popular TV Series Section */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FaTv className="text-blue-500 text-2xl" />
                Popular TV Series
              </h2>
              {/* ✅ FIXED: Path TV show yang benar */}
              <Link 
                href="/tv-show?category=popular" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
              >
                View All <FaArrowRight className="text-sm" />
              </Link>
            </div>
            {filteredPopularTv.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredPopularTv.map((tvShow) => (
                  <MediaCard key={tvShow.id} item={tvShow} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <FaTv className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No popular TV series available at the moment.</p>
              </div>
            )}
          </section>

          {/* Top Rated Movies Section */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FaStar className="text-green-500 text-2xl" />
                Top Rated Movies
                <span className="text-sm bg-green-600 text-white px-2 py-1 rounded-full">All Time</span>
              </h2>
              <Link 
                href="/movie?category=top_rated" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
              >
                View All <FaArrowRight className="text-sm" />
              </Link>
            </div>
            {filteredTopRated.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredTopRated.map((movie) => (
                  <MediaCard key={movie.id} item={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                <FaStar className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No top rated movies available at the moment.</p>
              </div>
            )}
          </section>

          {/* Quick Navigation */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-center mb-8">Explore More</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/movie" className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105">
                  <FaFilm className="text-2xl mx-auto mb-2" />
                  <div className="font-semibold">All Movies</div>
                  <div className="text-sm text-orange-200">Browse Collection</div>
                </Link>
                {/* ✅ FIXED: Path TV show yang benar */}
                <Link href="/tv-show" className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105">
                  <FaTv className="text-2xl mx-auto mb-2" />
                  <div className="font-semibold">TV Series</div>
                  <div className="text-sm text-blue-200">Discover Shows</div>
                </Link>
                <Link href="/people" className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105">
                  <FaUsers className="text-2xl mx-auto mb-2" />
                  <div className="font-semibold">Actors</div>
                  <div className="text-sm text-purple-200">Meet the Stars</div>
                </Link>
                <Link href="/rankings" className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105">
                  <FaStar className="text-2xl mx-auto mb-2" />
                  <div className="font-semibold">Rankings</div>
                  <div className="text-sm text-green-200">Top Rated</div>
                </Link>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-slate-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Streaming?</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join millions of users discovering new movies and TV series every day on MovieFlow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/movie" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaFilm /> Explore All Movies
              </Link>
              {/* ✅ FIXED: Path TV show yang benar */}
              <Link 
                href="/tv-show" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaTv /> Browse TV Series
              </Link>
              <Link 
                href="/people" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaUsers /> Discover Actors
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    
    // Fallback UI jika ada error
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            MovieFlow
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            We're having trouble loading content right now. Please check your connection and try again.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/movie/genre/science-fiction" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Movies
            </Link>
            {/* ✅ FIXED: Path TV show yang benar */}
            <Link 
              href="/tv-show/genre/action-&-adventure" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse TV Series
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}