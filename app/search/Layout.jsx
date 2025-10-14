// app/search/layout.jsx
export const metadata = {
  title: 'Search Movies & TV Series - WatchNow',
  description: 'Search our extensive database of movies and TV series. Find exactly what you want to watch with detailed information and streaming options.',
  keywords: 'search movies, find TV series, movie search, TV show search, entertainment search, streaming search',
  openGraph: {
    title: 'Search Movies & TV Series - WatchNow',
    description: 'Find your favorite movies and TV series in our comprehensive database. Search by title, genre, or keyword.',
    url: 'https://watchnow-movies.vercel.app/search',
    siteName: 'WatchNow',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/54844423650_2eea561c34_b.jpg',
        width: 1200,
        height: 630,
        alt: 'WatchNow - Search Movies & TV Series',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WatchNowMovies',
    creator: '@WatchNowMovies',
    title: 'Search Movies & TV Series - WatchNow',
    description: 'Find your favorite movies and TV series with our powerful search tool.',
    images: ['https://live.staticflickr.com/65535/54844423650_2eea561c34_b.jpg'],
  },
  alternates: {
    canonical: 'https://watchnow-movies.vercel.app/search',
  },
};

export default function SearchLayout({ children }) {
  return children;
}