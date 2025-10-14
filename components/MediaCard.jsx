// components/MediaCard.jsx - FIXED VERSION

import Image from 'next/image';
import Link from 'next/link';
import { createMovieSlug, createTvSlug } from '../utils/slugUtils';

export default function MediaCard({ mediaItem }) {
  const posterPath = mediaItem.poster_path;
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'https://placehold.co/500x750/374151/9CA3AF?text=No+Image';

  const isMovie = mediaItem.title !== undefined;
  const title = isMovie ? mediaItem.title : mediaItem.name;

  let year = '';
  if (mediaItem.release_date) {
    year = new Date(mediaItem.release_date).getFullYear();
  } else if (mediaItem.first_air_date) {
    year = new Date(mediaItem.first_air_date).getFullYear();
  } else {
    year = 'N/A';
  }

  // Gunakan fungsi slug yang terpusat dengan format title-year-id
  const mediaSlug = isMovie ? createMovieSlug(mediaItem) : createTvSlug(mediaItem);
  
  // ✅ FIXED: Gunakan path yang benar untuk movie dan tv show
  const linkHref = isMovie ? `/movie/${mediaSlug}` : `/tv-show/${mediaSlug}`;

  return (
    <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <Link href={linkHref} className="block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800">
        <div className="relative w-full aspect-[2/3] bg-gray-700">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZFRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Rating Badge */}
          {mediaItem.vote_average && (
            <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              ⭐ {mediaItem.vote_average.toFixed(1)}
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div>
              <h3 className="text-white text-sm font-bold line-clamp-2">
                {title}
              </h3>
              <p className="text-gray-300 text-xs mt-1">
                {year} • {isMovie ? 'Movie' : 'TV Series'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Title for non-hover state */}
        <div className="p-3">
          <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
            {title}
          </h3>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{year}</span>
            {mediaItem.vote_average && (
              <span className="flex items-center gap-1">
                ⭐ {mediaItem.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}