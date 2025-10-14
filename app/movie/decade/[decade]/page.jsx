// app/movie/decade/[decade]/page.jsx - FIXED WITH SLUG FORMAT
import { getMoviesByYear, discoverMovies } from '../../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaStar, FaFilm, FaArrowLeft } from 'react-icons/fa';

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

// Function untuk mendapatkan movies by decade
const getMoviesByDecade = async (startYear, endYear) => {
  try {
    // Ambil movies untuk setiap tahun dalam decade
    const yearPromises = [];
    for (let year = startYear; year <= endYear; year++) {
      yearPromises.push(getMoviesByYear(year));
    }
    
    const results = await Promise.all(yearPromises);
    
    // Gabungkan semua movies dan hilangkan duplikat
    const allMovies = results.flat();
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    );
    
    return uniqueMovies;
  } catch (error) {
    console.error('Error fetching decade movies:', error);
    return [];
  }
};

export default async function DecadePage({ params }) {
  const { decade } = await params;
  const decadeNumber = parseInt(decade);
  
  // Validasi decade
  if (isNaN(decadeNumber) || decadeNumber < 1900 || decadeNumber > 2030) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-8 rounded-xl max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Invalid Decade</h1>
            <p className="mb-6">Please enter a valid decade between 1900 and 2030.</p>
            <Link href="/movie" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const startYear = decadeNumber;
  const endYear = decadeNumber + 9;
  
  try {
    const movies = await getMoviesByDecade(startYear, endYear);
    
    // Filter movies yang memiliki release_date dan poster_path, lalu sort by popularity
    const filteredMovies = movies
      .filter(movie => movie.release_date && movie.poster_path)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

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
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-lg">
                <FaCalendar className="text-2xl text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {startYear}s Movies
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore the most popular movies from {startYear} to {endYear}. 
              Discover classics and hidden gems from this iconic decade.
            </p>
          </div>

          {/* Stats */}
          {filteredMovies.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-orange-400 mb-1">{filteredMovies.length}</div>
                <div className="text-gray-400 text-sm">Total Movies</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {Math.max(...filteredMovies.map(m => parseInt(m.release_date?.substring(0, 4)) || 0))}
                </div>
                <div className="text-gray-400 text-sm">Latest Year</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {Math.min(...filteredMovies.map(m => parseInt(m.release_date?.substring(0, 4)) || 9999))}
                </div>
                <div className="text-gray-400 text-sm">Earliest Year</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {filteredMovies.length > 0 ? 
                    (filteredMovies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / filteredMovies.length).toFixed(1) : '0.0'
                  }
                </div>
                <div className="text-gray-400 text-sm">Avg Rating</div>
              </div>
            </div>
          )}

          {/* Movies Grid */}
          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
              <FaFilm className="text-6xl text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl text-white mb-4">No Movies Found</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                No movies found for the {startYear}s decade. Try browsing other decades or years.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/movie" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Browse All Movies
                </Link>
                <Link href={`/movie/year/${startYear + 5}`} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse {startYear + 5}
                </Link>
              </div>
            </div>
          ) : (
            <>
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

              {/* Decade Navigation */}
              <div className="flex justify-center mt-12">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4 text-center">Explore Other Decades</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].map((dec) => (
                      <Link
                        key={dec}
                        href={`/movie/decade/${dec}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          dec === decadeNumber 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                        }`}
                      >
                        {dec}s
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
    console.error('Error fetching decade movies:', error);
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-8 rounded-xl max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Error Loading Movies</h1>
            <p className="mb-6">Failed to load movies for the {startYear}s. Please try again later.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/movie" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Browse Movies
              </Link>
              <Link href={`/movie/year/${startYear}`} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Browse {startYear}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}