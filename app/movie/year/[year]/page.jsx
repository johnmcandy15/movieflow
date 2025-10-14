// app/movie/year/[year]/page.jsx - FIXED WITH SLUG FORMAT
import { getMoviesByYear } from '../../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaStar, FaFilm, FaArrowLeft, FaTrophy, FaFire } from 'react-icons/fa';

// Utility function untuk membuat slug movie
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

export default async function YearPage({ params }) {
  const { year } = await params;
  const yearNumber = parseInt(year);
  
  // Validasi year
  if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > 2030) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-8 rounded-xl max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Invalid Year</h1>
            <p className="mb-6">Please enter a valid year between 1900 and 2030.</p>
            <Link href="/movie" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  try {
    const movies = await getMoviesByYear(yearNumber);
    
    // Filter dan sort movies
    const filteredMovies = movies
      .filter(movie => movie.release_date && movie.poster_path)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    // Dapatkan top rated movies
    const topRated = [...filteredMovies]
      .filter(movie => movie.vote_average > 7.5)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 5);

    // Dapatkan most popular movies
    const mostPopular = [...filteredMovies]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);

    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/movie" 
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Movies
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg">
                <FaCalendar className="text-2xl text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Movies of {yearNumber}
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore all movies released in {yearNumber}. Discover blockbusters, critically acclaimed films, and hidden gems from this year.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-orange-400 mb-1">{filteredMovies.length}</div>
              <div className="text-gray-400 text-sm">Total Movies</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {filteredMovies.length > 0 ? 
                  (filteredMovies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / filteredMovies.length).toFixed(1) : '0.0'
                }
              </div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {topRated.length}
              </div>
              <div className="text-gray-400 text-sm">Highly Rated</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {Math.round(Math.max(...filteredMovies.map(m => m.popularity || 0)))}
              </div>
              <div className="text-gray-400 text-sm">Max Popularity</div>
            </div>
          </div>

          {/* Top Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Top Rated */}
            {topRated.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <FaTrophy className="text-yellow-400 text-xl" />
                  <h2 className="text-xl font-bold text-white">Top Rated of {yearNumber}</h2>
                </div>
                <div className="space-y-3">
                  {topRated.map((movie, index) => {
                    const slug = createMovieSlug(movie);
                    return (
                      <Link 
                        key={movie.id} 
                        href={`/movie/${slug}`}
                        className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group"
                      >
                        <div className="flex items-center justify-center w-6 h-6 bg-yellow-500 text-yellow-900 rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold line-clamp-1 group-hover:text-orange-400 transition-colors">
                            {movie.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaStar className="text-yellow-400" />
                          <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Most Popular */}
            {mostPopular.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <FaFire className="text-orange-400 text-xl" />
                  <h2 className="text-xl font-bold text-white">Most Popular of {yearNumber}</h2>
                </div>
                <div className="space-y-3">
                  {mostPopular.map((movie, index) => {
                    const slug = createMovieSlug(movie);
                    return (
                      <Link 
                        key={movie.id} 
                        href={`/movie/${slug}`}
                        className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group"
                      >
                        <div className="flex items-center justify-center w-6 h-6 bg-orange-500 text-orange-900 rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold line-clamp-1 group-hover:text-orange-400 transition-colors">
                            {movie.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaFire className="text-orange-400" />
                          <span className="text-white font-semibold">{Math.round(movie.popularity)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* All Movies Grid */}
          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
              <FaFilm className="text-6xl text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl text-white mb-4">No Movies Found</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                No movies found for {yearNumber}. Try browsing other years or decades.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/movie" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Browse All Movies
                </Link>
                <Link href={`/movie/decade/${Math.floor(yearNumber / 10) * 10}`} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse {Math.floor(yearNumber / 10) * 10}s
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">All Movies of {yearNumber}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredMovies.map((movie) => {
                    const slug = createMovieSlug(movie);
                    return (
                      <div key={movie.id} className="group bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-all duration-300 hover:shadow-xl border border-slate-700 hover:border-slate-600">
                        <Link href={`/movie/${slug}`} className="block">
                          <div className="relative aspect-[2/3] overflow-hidden">
                            <Image
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                              <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-200">{movie.release_date?.substring(0, 4)}</span>
                                  {movie.vote_average > 0 && (
                                    <span className="text-yellow-400 flex items-center gap-1">
                                      ⭐ {movie.vote_average.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3">
                            <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1 group-hover:text-orange-400 transition-colors">
                              {movie.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{movie.release_date?.substring(0, 4)}</span>
                              {movie.vote_average > 0 && (
                                <div className="flex items-center gap-1">
                                  <FaStar className="text-yellow-400 text-xs" />
                                  <span>{movie.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Year Navigation */}
              <div className="flex justify-center mt-12">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4 text-center">Browse Other Years</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((yr) => (
                      <Link
                        key={yr}
                        href={`/movie/year/${yr}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          yr === yearNumber 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                        }`}
                      >
                        {yr}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching year movies:', error);
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-8 rounded-xl max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Error Loading Movies</h1>
            <p className="mb-6">Failed to load movies for {yearNumber}. Please try again later.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/movie" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Browse Movies
              </Link>
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}