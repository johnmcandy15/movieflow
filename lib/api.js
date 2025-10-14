// lib/api.js - PERBAIKAN UNTUK TV REVIEWS

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TMDB_API_URL;

// Fungsi helper untuk fetch data
const fetchApi = async (path, options = {}) => {
  if (!apiKey || !apiUrl) {
    throw new Error('API keys are not configured. Please check your .env.local file.');
  }

  // Handle query parameters yang sudah ada di path
  const separator = path.includes('?') ? '&' : '?';
  const url = `${apiUrl}${path}${separator}api_key=${apiKey}&language=en-US`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `API Error: ${res.status} ${res.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = `API Error: ${errorData.status_message || errorMessage}`;
    } catch {
      // Jika response bukan JSON, gunakan teks biasa
      errorMessage = `API Error: ${res.status} ${res.statusText} - ${errorText}`;
    }
    
    throw new Error(errorMessage);
  }

  return res.json();
};

// ========== MOVIE FUNCTIONS ==========

export async function getMovieById(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error.message);
    return null;
  }
}

export async function getMovieVideos(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/videos`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movie videos for ID ${movieId}:`, error.message);
    return [];
  }
}

export async function getMovieCredits(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching movie credits for ID ${movieId}:`, error.message);
    return null;
  }
}

export async function getMovieReviews(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/reviews`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movie reviews for ID ${movieId}:`, error.message);
    return [];
  }
}

export async function getSimilarMovies(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/similar`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching similar movies for ID ${movieId}:`, error.message);
    return [];
  }
}

export async function getMovieRecommendations(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/recommendations`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movie recommendations for ID ${movieId}:`, error.message);
    return [];
  }
}

export async function getMovieWatchProviders(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/watch/providers`);
    return data.results || {};
  } catch (error) {
    console.error(`Error fetching watch providers for movie ${movieId}:`, error.message);
    return {};
  }
}

// ========== TV SERIES FUNCTIONS ==========

export async function getTvSeriesById(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching TV series details for ID ${tvId}:`, error.message);
    return null;
  }
}

export async function getTvSeriesVideos(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/videos`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TV series videos for ID ${tvId}:`, error.message);
    return [];
  }
}

export async function getTvSeriesCredits(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching TV series credits for ID ${tvId}:`, error.message);
    return null;
  }
}

// ✅ FIXED: Fungsi khusus untuk TV reviews dengan struktur yang benar
export async function getTvSeriesReviews(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/reviews`);
    // Untuk TV series, response langsung berisi array results
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TV series reviews for ID ${tvId}:`, error.message);
    return [];
  }
}

export async function getSimilarTvSeries(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/similar`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching similar TV series for ID ${tvId}:`, error.message);
    return [];
  }
}

export async function getTvSeriesWatchProviders(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/watch/providers`);
    return data.results || {};
  } catch (error) {
    console.error(`Error fetching watch providers for TV series ${tvId}:`, error.message);
    return {};
  }
}

// ========== SEARCH FUNCTIONS ==========

export async function searchMoviesAndTv(query, page = 1) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const data = await fetchApi(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching search results for query '${query}':`, error.message);
    return [];
  }
}

export async function searchPeople(query, page = 1) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const data = await fetchApi(`/search/person?query=${encodeURIComponent(query)}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error searching people for query '${query}':`, error.message);
    return [];
  }
}

// ========== CATEGORY & GENRE FUNCTIONS ==========

export async function getMoviesByCategory(category, page = 1) {
  try {
    const data = await fetchApi(`/movie/${category}?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error.message);
    return [];
  }
}

export async function getTvSeriesByCategory(category, page = 1) {
  try {
    const data = await fetchApi(`/tv/${category}?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${category} TV series:`, error.message);
    return [];
  }
}

export async function getMovieGenres() {
  try {
    const data = await fetchApi('/genre/movie/list');
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching movie genres:', error.message);
    return [];
  }
}

export async function getTvSeriesGenres() {
  try {
    const data = await fetchApi('/genre/tv/list');
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching TV series genres:', error.message);
    return [];
  }
}

export async function getMoviesByGenre(genreId, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?with_genres=${genreId}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movies by genre ID ${genreId}:`, error.message);
    return [];
  }
}

export async function getTvSeriesByGenre(genreId, page = 1) {
  try {
    const data = await fetchApi(`/discover/tv?with_genres=${genreId}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TV series by genre ID ${genreId}:`, error.message);
    return [];
  }
}

// ========== TRENDING & POPULAR FUNCTIONS ==========

export async function getTrendingMoviesDaily(page = 1) {
  try {
    const data = await fetchApi(`/trending/movie/day?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching daily trending movies:', error.message);
    return [];
  }
}

export async function getTrendingTvSeriesDaily(page = 1) {
  try {
    const data = await fetchApi(`/trending/tv/day?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching daily trending TV series:', error.message);
    return [];
  }
}

export async function getPopularMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/popular?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error.message);
    return [];
  }
}

export async function getPopularTvSeries(page = 1) {
  try {
    const data = await fetchApi(`/tv/popular?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular TV series:', error.message);
    return [];
  }
}

export async function getTopRatedMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/top_rated?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error.message);
    return [];
  }
}

export async function getTopRatedTvSeries(page = 1) {
  try {
    const data = await fetchApi(`/tv/top_rated?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated TV series:', error.message);
    return [];
  }
}

export async function getNowPlayingMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/now_playing?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching now playing movies:', error.message);
    return [];
  }
}

export async function getUpcomingMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/upcoming?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.message);
    return [];
  }
}

// ========== PEOPLE FUNCTIONS ==========

export async function getPersonById(personId) {
  try {
    const data = await fetchApi(`/person/${personId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching person details for ID ${personId}:`, error.message);
    return null;
  }
}

export async function getPersonMovieCredits(personId) {
  try {
    const data = await fetchApi(`/person/${personId}/movie_credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching movie credits for person ID ${personId}:`, error.message);
    return null;
  }
}

export async function getPersonTvCredits(personId) {
  try {
    const data = await fetchApi(`/person/${personId}/tv_credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching TV credits for person ID ${personId}:`, error.message);
    return null;
  }
}

export async function getPopularPeople(page = 1) {
  try {
    const data = await fetchApi(`/person/popular?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular people:', error.message);
    return [];
  }
}

// ========== YEAR & DECADE FUNCTIONS ==========

export async function getMoviesByYear(year, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?primary_release_year=${year}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movies from year ${year}:`, error.message);
    return [];
  }
}

// Fungsi baru untuk mendapatkan movies by decade range
export async function getMoviesByYearRange(startYear, endYear, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movies from ${startYear} to ${endYear}:`, error.message);
    return [];
  }
}

// ========== UTILITY FUNCTIONS ==========

export const createSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Hapus karakter tidak valid
    .replace(/\s+/g, '-') // Ganti spasi dengan dash
    .replace(/-+/g, '-') // Gabungkan multiple dash
    .trim();
};

// ========== DISCOVER FUNCTIONS ==========

export async function discoverMovies(params = {}) {
  try {
    const {
      genres = '',
      year = '',
      rating = '',
      sortBy = 'popularity.desc',
      page = 1
    } = params;
    
    let queryString = `?page=${page}&sort_by=${sortBy}`;
    
    if (genres) queryString += `&with_genres=${genres}`;
    if (year) queryString += `&primary_release_year=${year}`;
    if (rating) queryString += `&vote_average.gte=${rating}`;
    
    const data = await fetchApi(`/discover/movie${queryString}`);
    return data.results || [];
  } catch (error) {
    console.error('Error in movie discovery:', error.message);
    return [];
  }
}

export async function discoverTvSeries(params = {}) {
  try {
    const {
      genres = '',
      year = '',
      rating = '',
      sortBy = 'popularity.desc',
      page = 1
    } = params;
    
    let queryString = `?page=${page}&sort_by=${sortBy}`;
    
    if (genres) queryString += `&with_genres=${genres}`;
    if (year) queryString += `&first_air_date_year=${year}`;
    if (rating) queryString += `&vote_average.gte=${rating}`;
    
    const data = await fetchApi(`/discover/tv${queryString}`);
    return data.results || [];
  } catch (error) {
    console.error('Error in TV series discovery:', error.message);
    return [];
  }
}

// ========== IMAGE FUNCTIONS ==========

export async function getMovieImages(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/images`);
    return data;
  } catch (error) {
    console.error(`Error fetching images for movie ${movieId}:`, error.message);
    return null;
  }
}

export async function getTvSeriesImages(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/images`);
    return data;
  } catch (error) {
    console.error(`Error fetching images for TV series ${tvId}:`, error.message);
    return null;
  }
}

export async function getPersonImages(personId) {
  try {
    const data = await fetchApi(`/person/${personId}/images`);
    return data;
  } catch (error) {
    console.error(`Error fetching images for person ${personId}:`, error.message);
    return null;
  }
}

// ========== EXPORT DEFAULT ==========

const apiFunctions = {
  // Movie
  getMovieById,
  getMovieVideos,
  getMovieCredits,
  getMovieReviews,
  getSimilarMovies,
  getMovieRecommendations,
  getMovieWatchProviders,
  
  // TV Series
  getTvSeriesById,
  getTvSeriesVideos,
  getTvSeriesCredits,
  getTvSeriesReviews,
  getSimilarTvSeries,
  getTvSeriesWatchProviders,
  
  // Search
  searchMoviesAndTv,
  searchPeople,
  
  // Categories & Genres
  getMoviesByCategory,
  getTvSeriesByCategory,
  getMovieGenres,
  getTvSeriesGenres,
  getMoviesByGenre,
  getTvSeriesByGenre,
  
  // Trending & Popular
  getTrendingMoviesDaily,
  getTrendingTvSeriesDaily,
  getPopularMovies,
  getPopularTvSeries,
  getTopRatedMovies,
  getTopRatedTvSeries,
  getNowPlayingMovies,
  getUpcomingMovies,
  
  // People
  getPersonById,
  getPersonMovieCredits,
  getPersonTvCredits,
  getPopularPeople,
  
  // Year & Decade
  getMoviesByYear,
  getMoviesByYearRange,
  
  // Utility
  createSlug,
  
  // Discover
  discoverMovies,
  discoverTvSeries,
  
  // Images
  getMovieImages,
  getTvSeriesImages,
  getPersonImages
};

export default apiFunctions;