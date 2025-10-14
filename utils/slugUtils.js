// utils/slugUtils.js
export function createMovieSlug(movie) {
  if (!movie) return '';
  const title = movie.title || movie.name || '';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const id = movie.id || '';
  
  // Validasi jika data penting tidak ada
  if (!title || !id) return `unknown-${Date.now()}`;
  
  return `${slugify(title)}-${year}-${id}`;
}

export function createTvSlug(tvShow) {
  if (!tvShow) return '';
  const title = tvShow.name || tvShow.title || '';
  const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : '';
  const id = tvShow.id || '';
  
  // Validasi jika data penting tidak ada
  if (!title || !id) return `unknown-${Date.now()}`;
  
  return `${slugify(title)}-${year}-${id}`;
}

// Helper function untuk membuat slug yang bersih
function slugify(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')       // Hapus karakter non-word
    .replace(/\-\-+/g, '-')         // Ganti multiple - dengan single -
    .replace(/^-+/, '')             // Hapus - dari awal
    .replace(/-+$/, '');            // Hapus - dari akhir
}