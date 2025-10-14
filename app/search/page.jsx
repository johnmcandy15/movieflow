// app/search/page.jsx - FIXED VERSION
"use client";

import { searchMoviesAndTv } from '../../lib/api.js';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, use } from 'react';
import { FaFilm, FaTv, FaStar, FaCalendar, FaArrowRight, FaSpinner } from 'react-icons/fa';

// Utility functions untuk membuat slug dengan format judul-tahun-id
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

// Custom MovieCard component dengan format slug baru - FIXED LINKS
const MovieCard = ({ item }) => {
  const isTV = item.media_type === 'tv' || item.name;
  const title = item.title || item.name;
  const date = isTV ? item.first_air_date : item.release_date;
  const year = date ? new Date(date).getFullYear() : 'TBA';
  
  // Buat slug berdasarkan tipe konten dengan format judul-tahun-id
  const slug = isTV ? createTvSlug(item) : createMovieSlug(item);
  
  return (
    <div className="group bg-slate-800 rounded-xl overflow-hidden hover:bg-slate-700 transition-all duration-300 hover:shadow-2xl border border-slate-700 hover:border-slate-600">
      {/* ✅ FIXED: Path TV show yang benar */}
      <Link href={isTV ? `/tv-show/${slug}` : `/movie/${slug}`}>
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
          
          {/* Overlay dengan info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h3>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-700/80 px-2 py-1 rounded">
                    {year}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs uppercase font-medium ${
                    isTV ? 'bg-blue-500/80' : 'bg-orange-500/80'
                  }`}>
                    {isTV ? 'TV' : 'Movie'}
                  </span>
                </div>
                {item.vote_average > 0 && (
                  <div className="flex items-center gap-1 bg-slate-700/80 px-2 py-1 rounded">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="font-medium">{item.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Content di bawah poster */}
      <div className="p-4">
        {/* ✅ FIXED: Path TV show yang benar */}
        <Link 
          href={isTV ? `/tv-show/${slug}` : `/movie/${slug}`}
          className="block group-hover:text-orange-400 transition-colors"
        >
          <h3 className="font-semibold text-white line-clamp-1 mb-2 group-hover:underline">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>{year}</span>
            <span className={`px-2 py-1 rounded text-xs uppercase font-medium ${
              isTV ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'
            }`}>
              {isTV ? 'TV Series' : 'Movie'}
            </span>
          </div>
          
          {item.vote_average > 0 && (
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-xs" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {item.overview && (
          <p className="text-gray-300 text-sm mt-2 line-clamp-2 leading-relaxed">
            {item.overview}
          </p>
        )}
        
        {/* ✅ FIXED: Path TV show yang benar */}
        <Link 
          href={isTV ? `/tv-show/${slug}` : `/movie/${slug}`}
          className="inline-flex items-center gap-2 mt-3 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium group/view"
        >
          View Details
          <FaArrowRight className="group-hover/view:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

// MovieList component yang sudah diperbaiki
const MovieList = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No movies or TV series found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {movies.map((item) => (
        <MovieCard key={`${item.id}-${item.media_type}`} item={item} />
      ))}
    </div>
  );
};

export default function SearchPage({ searchParams }) {
  // FIX: Gunakan use() hook untuk unwrap searchParams di Next.js 15
  const unwrappedParams = use(searchParams);
  const query = unwrappedParams?.query;

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const initialMovies = await searchMoviesAndTv(query, 1);
        setMovies(initialMovies);
        setHasMore(initialMovies.length > 0);
        setPage(1);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [query]);

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const newMovies = await searchMoviesAndTv(query, nextPage);
      setMovies(prevMovies => [...prevMovies, ...newMovies]);
      setPage(nextPage);
      setHasMore(newMovies.length > 0);
    } catch (err) {
      setError('Failed to load more results');
    } finally {
      setIsLoading(false);
    }
  };

  // Statistics untuk search results
  const movieCount = movies.filter(item => item.media_type === 'movie' || !item.media_type).length;
  const tvCount = movies.filter(item => item.media_type === 'tv').length;
  const totalResults = movies.length;

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-8 bg-slate-900">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Movies & TV Shows</h1>
        <p className="text-lg text-gray-400 text-center mb-8 max-w-md">
          Enter the name of a movie or TV series in the search box above to discover amazing content.
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Search Results for &quot;{query}&quot;
        </h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {movies.length > 0 && (
          <div className="text-center mb-8">
            <p className="text-gray-400 text-lg mb-2">
              Found {totalResults} results
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                {movieCount} Movies
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                {tvCount} TV Series
              </span>
            </div>
          </div>
        )}

        {isLoading && movies.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-400">Searching for &quot;{query}&quot;...</p>
            </div>
          </div>
        ) : movies.length === 0 && !isLoading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold mb-4">No results found</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We couldn&apos;t find any movies or TV series matching &quot;{query}&quot;. 
              Try checking the spelling or searching for something else.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Popular Content
              </Link>
              <Link href="/movie" className="px-6 py-3 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                Browse Movies
              </Link>
              {/* ✅ FIXED: Path TV show yang benar */}
              <Link href="/tv-show" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Browse TV Series
              </Link>
            </div>
          </div>
        ) : (
          <>
            <MovieList movies={movies} />
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}