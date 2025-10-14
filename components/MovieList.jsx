// components/MovieList.jsx
import MediaCard from './MediaCard';
import { createMovieSlug } from '../utils/slugUtils'; // Pastikan import fungsi ini

export default function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p className="text-center text-gray-400">No Movies Found.</p>;
  }

  // Hapus generateUniqueKey yang tidak perlu, gunakan ID saja
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((item) => (
        <MediaCard 
          key={item.id} // Cukup gunakan ID saja sebagai key
          mediaItem={item}
          slug={createMovieSlug(item)} // Tambahkan prop slug
        />
      ))}
    </div>
  );
}