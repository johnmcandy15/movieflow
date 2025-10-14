// app/movie/genre/[genreName]/page.jsx

import { notFound } from 'next/navigation';
import { getMoviesByGenre, getMovieGenres } from '../../../../lib/api';
import MovieList from '../../../../components/MovieList';

export async function generateMetadata({ params }) {
  const { genreName } = await params;
  const genres = await getMovieGenres();
  const genre = genres.find(g => g.name.toLowerCase().replace(/\s/g, '-') === genreName);
  const title = genre?.name || 'Unknown';

  const pageUrl = `https://watchnow-movies.vercel.app/movie/genre/${genreName}`;
  const imageUrl = 'https://live.staticflickr.com/65535/54844423650_2eea561c34_b.jpg';

  return {
    title: `${title} Movies - WatchNow | Complete ${title} Film Collection`,
    description: `Discover the best ${title} movies on WatchNow. Browse ${title.toLowerCase()} films, find streaming options, ratings, and reviews. Your ultimate ${title.toLowerCase()} movie database.`,
    keywords: `${title} movies, ${title} films, watch ${title} movies, stream ${title} films, ${title.toLowerCase()} genre, ${title.toLowerCase()} cinema`,
    openGraph: {
      title: `${title} Movies - WatchNow`,
      description: `Explore our ${title} movie collection. Find where to stream ${title.toLowerCase()} films legally.`,
      url: pageUrl,
      siteName: 'WatchNow',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Movies Collection - WatchNow`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchNowMovies',
      creator: '@WatchNowMovies',
      title: `${title} Movies - WatchNow`,
      description: `Browse ${title} movie collection and find streaming options`,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
    other: {
      'fb:app_id': '100074345305108',
    },
  };
}

export default async function MoviesByGenrePage({ params }) {
  // Await params sebelum mengakses propertinya
  const { genreName } = await params;

  const genres = await getMovieGenres();

  // Mencari ID genre berdasarkan nama (slug) dari URL
  const genre = genres.find(g => g.name.toLowerCase().replace(/\s/g, '-') === genreName);
  const genreId = genre?.id;
  const genreTitle = genre?.name || 'Unknown';

  if (!genreId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-white">Genre not found.</p>
      </div>
    );
  }

  const movies = await getMoviesByGenre(genreId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
        {genreTitle} Movies
      </h1>
      {movies && movies.length > 0 ? (
        <MovieList movies={movies} />
      ) : (
        <p className="text-center text-white">No movies available in this genre.</p>
      )}
    </div>
  );
}