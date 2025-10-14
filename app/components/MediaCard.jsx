import Link from 'next/link';
import Image from 'next/image';
import { FaPlay, FaStar, FaTv, FaFilm } from 'react-icons/fa';

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

// MediaCard Component
const MediaCard = ({ item, index }) => {
  const isTV = item.media_type === 'tv' || item.name;
  const title = item.title || item.name;
  const date = isTV ? item.first_air_date : item.release_date;
  const year = date ? new Date(date).getFullYear() : 'TBA';
  
  const slug = isTV ? createTvSlug(item) : createMovieSlug(item);
  
  return (
    <div className="group bg-slate-800 rounded-xl overflow-hidden hover:bg-slate-700 transition-all duration-500 hover:shadow-2xl border border-slate-700 hover:border-orange-500/50 relative">
      {/* Trending Badge untuk 3 teratas */}
      {index < 3 && (
        <div className="absolute top-3 left-3 z-20">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
            'bg-gradient-to-r from-amber-700 to-amber-900 text-white'
          }`}>
            #{index + 1} Trending
          </div>
        </div>
      )}
      
      <Link href={isTV ? `/tv-show/${slug}` : `/movie/${slug}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              {isTV ? <FaTv className="text-4xl text-slate-500" /> : <FaFilm className="text-4xl text-slate-500" />}
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 w-full">
              <h3 className="font-bold text-lg line-clamp-2 mb-2">{title}</h3>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-200">{year}</span>
                {item.vote_average > 0 && (
                  <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <FaPlay className="text-xs" /> Watch Now
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-white text-base line-clamp-1 mb-2 group-hover:text-orange-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">{year}</span>
              <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-gray-300">
                {isTV ? 'TV Series' : 'Movie'}
              </span>
            </div>
            {item.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-xs" />
                <span className="font-medium">{item.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;