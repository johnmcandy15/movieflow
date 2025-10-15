// components/MovieList.jsx (FINAL VERSION)
import MediaCard from './MediaCard';
import { createMovieSlug } from '../utils/slugUtils';

export default function MovieList({ movies }) {
  // Enhanced validation - lebih safe
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return <p className="text-center text-gray-400">No Movies Found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((item) => {
        // Validasi setiap item sebelum render
        if (!item || typeof item !== 'object' || !item.id) {
          console.warn('Skipping invalid movie item:', item);
          return null; // Skip invalid items safely
        }

        return (
          <MediaCard 
            key={item.id}
            mediaItem={item}
            slug={createMovieSlug(item)}
          />
        );
      })}
    </div>
  );
}