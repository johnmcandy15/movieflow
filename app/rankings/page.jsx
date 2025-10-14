// app/rankings/page.jsx - COMPLETE FIXED VERSION WITH CORRECT TV SHOW PATHS
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaTrophy, FaFilm, FaTv, FaFire, FaCalendar, FaArrowRight, FaArrowLeft, FaFilter, FaEye, FaUsers } from 'react-icons/fa';
import { getTopRatedMovies, getTopRatedTvSeries, getTrendingMoviesDaily, getTrendingTvSeriesDaily, getMovieGenres } from '../../lib/api';

// Fallback data yang lebih realistis
const fallbackMovies = [
  {
    id: 278,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    vote_average: 8.7,
    vote_count: 2500000,
    release_date: "1994-09-23",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre_ids: [18],
    popularity: 100.5
  },
  {
    id: 238,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    vote_average: 8.7,
    vote_count: 1800000,
    release_date: "1972-03-24",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre_ids: [18, 80],
    popularity: 95.2
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 8.5,
    vote_count: 3000000,
    release_date: "2008-07-18",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre_ids: [28, 80, 18],
    popularity: 120.8
  },
  {
    id: 424,
    title: "Schindler's List",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    vote_average: 8.6,
    vote_count: 1400000,
    release_date: "1993-11-30",
    overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory.",
    genre_ids: [18, 36, 10752],
    popularity: 65.3
  },
  {
    id: 13,
    title: "Forrest Gump",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    vote_average: 8.5,
    vote_count: 2500000,
    release_date: "1994-06-23",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
    genre_ids: [35, 18, 10749],
    popularity: 88.7
  },
  {
    id: 680,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    vote_average: 8.5,
    vote_count: 2600000,
    release_date: "1994-09-10",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    genre_ids: [53, 80],
    popularity: 110.2
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    vote_average: 8.5,
    vote_count: 2200000,
    release_date: "2003-12-01",
    overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor.",
    genre_ids: [12, 14, 28],
    popularity: 95.8
  },
  {
    id: 1891,
    title: "The Empire Strikes Back",
    poster_path: "/2l05cFWJacyIsTpsuSILF0F0U1P.jpg",
    vote_average: 8.4,
    vote_count: 1300000,
    release_date: "1980-05-17",
    overview: "The epic saga continues as Luke Skywalker, in hopes of defeating the evil Galactic Empire, learns the ways of the Jedi from aging master Yoda.",
    genre_ids: [12, 28, 878],
    popularity: 45.6
  },
  {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    vote_average: 8.4,
    vote_count: 2700000,
    release_date: "1999-10-15",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    genre_ids: [18],
    popularity: 105.3
  },
  {
    id: 27205,
    title: "Inception",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    vote_average: 8.4,
    vote_count: 3300000,
    release_date: "2010-07-15",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
    genre_ids: [28, 878, 9648],
    popularity: 150.7
  }
];

const fallbackTV = [
  {
    id: 1396,
    name: "Breaking Bad",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    vote_average: 8.9,
    vote_count: 9000,
    first_air_date: "2008-01-20",
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    genre_ids: [18],
    popularity: 150.3
  },
  {
    id: 66732,
    name: "Stranger Things",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    vote_average: 8.6,
    vote_count: 10000,
    first_air_date: "2016-07-15",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    genre_ids: [10765, 9648, 18],
    popularity: 200.8
  },
  {
    id: 1399,
    name: "Game of Thrones",
    poster_path: "/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
    vote_average: 8.4,
    vote_count: 22000,
    first_air_date: "2011-04-17",
    overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    genre_ids: [10765, 18, 10759],
    popularity: 180.5
  },
  {
    id: 60625,
    name: "Rick and Morty",
    poster_path: "/gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg",
    vote_average: 8.7,
    vote_count: 8000,
    first_air_date: "2013-12-02",
    overview: "Rick is a mentally-unbalanced but scientifically-gifted old man who has recently reconnected with his family.",
    genre_ids: [16, 35, 10765, 10759],
    popularity: 220.1
  },
  {
    id: 48866,
    name: "The Office",
    poster_path: "/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
    vote_average: 8.6,
    vote_count: 5000,
    first_air_date: "2005-03-24",
    overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    genre_ids: [35],
    popularity: 120.3
  },
  {
    id: 1668,
    name: "Friends",
    poster_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    vote_average: 8.5,
    vote_count: 7000,
    first_air_date: "1994-09-22",
    overview: "The misadventures of a group of friends as they navigate the pitfalls of work, life and love in Manhattan.",
    genre_ids: [35, 18],
    popularity: 95.7
  },
  {
    id: 63174,
    name: "Lucifer",
    poster_path: "/ekZobS8isE6mA53RAiGDG93hBxL.jpg",
    vote_average: 8.5,
    vote_count: 12000,
    first_air_date: "2016-01-25",
    overview: "Bored and unhappy as the Lord of Hell, Lucifer Morningstar abandoned his throne and retired to Los Angeles.",
    genre_ids: [80, 9648, 35, 10765],
    popularity: 180.2
  },
  {
    id: 456,
    name: "The Simpsons",
    poster_path: "/vHqeLzYl3dEAutojCO26g0LIkom.jpg",
    vote_average: 8.2,
    vote_count: 8000,
    first_air_date: "1989-12-17",
    overview: "Set in Springfield, the average American town, the show focuses on the antics and everyday adventures of the Simpson family.",
    genre_ids: [16, 35],
    popularity: 110.5
  },
  {
    id: 1100,
    name: "How I Met Your Mother",
    poster_path: "/dvxSvr6OmYGvvt8Z1VdBlPfL1Lf.jpg",
    vote_average: 8.2,
    vote_count: 6000,
    first_air_date: "2005-09-19",
    overview: "A father recounts to his children - through a series of flashbacks - the journey he and his four best friends took leading up to him meeting their mother.",
    genre_ids: [35, 18],
    popularity: 85.3
  },
  {
    id: 1434,
    name: "Family Guy",
    poster_path: "/eWWCRjBfLyePh2tfUvUOM9bNIuZ.jpg",
    vote_average: 8.1,
    vote_count: 5000,
    first_air_date: "1999-01-31",
    overview: "Sick, twisted, politically incorrect and Freakin' Sweet animated series featuring the adventures of the dysfunctional Griffin family.",
    genre_ids: [16, 35],
    popularity: 90.8
  }
];

// Utility functions untuk membuat slug dengan format judul-tahun-id
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

export default function RankingsPage() {
  const [activeCategory, setActiveCategory] = useState('movies');
  const [activeTimeframe, setActiveTimeframe] = useState('all-time');
  const [movies, setMovies] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTvSeries, setTrendingTvSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  const categories = [
    { id: 'movies', name: 'Top Movies', icon: FaFilm, color: 'from-orange-500 to-red-500' },
    { id: 'tv', name: 'Top TV Series', icon: FaTv, color: 'from-blue-500 to-purple-500' },
    { id: 'trending', name: 'Trending Now', icon: FaFire, color: 'from-yellow-500 to-orange-500' }
  ];

  const timeframes = [
    { id: 'all-time', name: 'All Time' },
    { id: 'today', name: 'Today' },
    { id: 'this-week', name: 'This Week' }
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data dengan error handling yang lebih baik
      const [topMoviesData, topTvData, trendingMovData, trendingTvData, genresData] = await Promise.allSettled([
        getTopRatedMovies(1),
        getTopRatedTvSeries(1),
        getTrendingMoviesDaily(1),
        getTrendingTvSeriesDaily(1),
        getMovieGenres()
      ]);

      // Handle movies - ambil lebih banyak data
      if (topMoviesData.status === 'fulfilled' && topMoviesData.value?.results) {
        // Jika API berhasil, ambil page 1 dan 2 untuk lebih banyak data
        const page2Data = await getTopRatedMovies(2).catch(() => ({ results: [] }));
        const allMovies = [...topMoviesData.value.results, ...(page2Data?.results || [])];
        setMovies(allMovies.slice(0, 50));
      } else {
        setMovies(fallbackMovies);
      }

      // Handle TV series - ambil lebih banyak data
      if (topTvData.status === 'fulfilled' && topTvData.value?.results) {
        const page2Data = await getTopRatedTvSeries(2).catch(() => ({ results: [] }));
        const allTv = [...topTvData.value.results, ...(page2Data?.results || [])];
        setTvSeries(allTv.slice(0, 50));
      } else {
        setTvSeries(fallbackTV);
      }

      // Handle trending movies
      if (trendingMovData.status === 'fulfilled' && trendingMovData.value?.results) {
        setTrendingMovies(trendingMovData.value.results.slice(0, 25));
      } else {
        setTrendingMovies(fallbackMovies.slice(0, 8));
      }

      // Handle trending TV
      if (trendingTvData.status === 'fulfilled' && trendingTvData.value?.results) {
        setTrendingTvSeries(trendingTvData.value.results.slice(0, 25));
      } else {
        setTrendingTvSeries(fallbackTV.slice(0, 8));
      }

      // Handle genres
      if (genresData.status === 'fulfilled' && genresData.value?.genres) {
        setGenres(genresData.value.genres);
      }

    } catch (error) {
      console.error('Error fetching rankings data:', error);
      setError('Failed to load rankings data. Showing demo content instead.');
      
      // Set fallback data yang lebih banyak
      setMovies(fallbackMovies);
      setTvSeries(fallbackTV);
      setTrendingMovies(fallbackMovies.slice(0, 8));
      setTrendingTvSeries(fallbackTV.slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    switch (activeCategory) {
      case 'movies':
        return movies;
      case 'tv':
        return tvSeries;
      case 'trending':
        if (activeTimeframe === 'today') {
          return [...trendingMovies, ...trendingTvSeries]
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } else if (activeTimeframe === 'this-week') {
          // Simulate weekly trending by combining and sorting by vote count
          const weeklyData = [...movies.slice(0, 25), ...tvSeries.slice(0, 25)];
          return weeklyData.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
        } else {
          // All time trending - combine and sort by rating
          const allTimeData = [...movies, ...tvSeries];
          return allTimeData.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        }
      default:
        return movies;
    }
  };

  const getDisplayedData = () => {
    const data = getCurrentData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getGenreNames = (genreIds) => {
    return genreIds?.map(id => genres.find(genre => genre.id === id)?.name).filter(Boolean) || [];
  };

  const totalPages = Math.ceil(getCurrentData().length / itemsPerPage);

  const Pagination = () => (
    totalPages > 1 && (
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
        >
          <FaArrowLeft /> Previous
        </button>
        
        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
        >
          Next <FaArrowRight />
        </button>
      </div>
    )
  );

  const RankBadge = ({ rank }) => (
    <div className={`
      w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg
      ${rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25' : 
        rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg shadow-gray-500/25' :
        rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg shadow-amber-500/25' :
        'bg-slate-700'}
    `}>
      {rank}
    </div>
  );

  const MediaCard = ({ item, rank }) => {
    const isTV = item.name || activeCategory === 'tv';
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const genreNames = getGenreNames(item.genre_ids);
    
    // Buat slug berdasarkan tipe konten dengan format judul-tahun-id
    const slug = isTV ? createTvSlug(item) : createMovieSlug(item);
    
    // ✅ FIXED: Gunakan path yang benar untuk TV series dan movies
    const detailUrl = isTV ? `/tv-show/${slug}` : `/movie/${slug}`;
    
    return (
      <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-all duration-300 hover:shadow-xl group border border-slate-700 hover:border-slate-600">
        <div className="flex gap-6">
          {/* Rank and Poster */}
          <div className="flex flex-col items-center gap-4">
            <RankBadge rank={rank} />
            
            <div className="relative aspect-[2/3] w-20 rounded-lg overflow-hidden shadow-lg">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  {isTV ? <FaTv className="text-xl text-gray-500" /> : <FaFilm className="text-xl text-gray-500" />}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                {/* ✅ FIXED: LINK DENGAN PATH YANG BENAR */}
                <Link 
                  href={detailUrl}
                  className="text-xl font-bold text-white hover:text-orange-400 transition-colors line-clamp-2 group-hover:underline"
                >
                  {title}
                </Link>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  {date && (
                    <div className="flex items-center gap-1">
                      <FaCalendar className="text-xs" />
                      <span>{new Date(date).getFullYear()}</span>
                    </div>
                  )}
                  
                  <span className={`px-2 py-1 rounded text-xs uppercase font-medium ${
                    isTV ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'
                  }`}>
                    {isTV ? 'TV Series' : 'Movie'}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-white text-lg">
                  {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                </span>
                <span className="text-gray-400 text-sm">
                  ({item.vote_count?.toLocaleString() || '0'})
                </span>
              </div>
            </div>

            {/* Overview */}
            {item.overview && (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3">
                {item.overview}
              </p>
            )}

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {genreNames.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {genreNames.slice(0, 2).map((genre, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs border border-slate-600">
                      {genre}
                    </span>
                  ))}
                  {genreNames.length > 2 && (
                    <span className="px-2 py-1 bg-slate-700 text-gray-400 rounded text-xs">
                      +{genreNames.length - 2}
                    </span>
                  )}
                </div>
              )}
              
              {(item.popularity && activeCategory === 'trending') && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <FaFire className="text-orange-400" />
                  <span>{Math.round(item.popularity)}</span>
                </div>
              )}

              {item.vote_count > 1000 && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <FaUsers className="text-blue-400" />
                  <span>{(item.vote_count / 1000).toFixed(1)}k votes</span>
                </div>
              )}
            </div>

            {/* Action Buttons - ✅ FIXED: LINK DENGAN PATH YANG BENAR */}
            <div className="flex gap-3 mt-4">
              <Link 
                href={detailUrl}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
              >
                <FaEye /> View Details
              </Link>
              
              {activeCategory === 'trending' && (
                <div className="flex items-center gap-1 px-3 py-2 bg-slate-700 text-gray-300 rounded-lg text-sm">
                  <FaFire className="text-orange-400" />
                  <span>Trending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-6 animate-pulse">
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full" />
              <div className="w-20 h-30 bg-gray-700 rounded-lg" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-12 bg-gray-700 rounded" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded w-20" />
                <div className="h-6 bg-gray-700 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12 bg-slate-800 rounded-xl">
      <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl text-white mb-2">No rankings available</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {activeCategory === 'trending' 
          ? `No trending content found for ${timeframes.find(tf => tf.id === activeTimeframe)?.name?.toLowerCase()}.`
          : 'Unable to load rankings data at the moment.'
        }
      </p>
      <button
        onClick={fetchAllData}
        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const currentData = getCurrentData();
  const displayedData = getDisplayedData();

  // Calculate statistics
  const totalItems = currentData.length;
  const highestRating = totalItems > 0 ? Math.max(...currentData.map(item => item.vote_average || 0)) : 0;
  const averageRating = totalItems > 0 ? currentData.reduce((sum, item) => sum + (item.vote_average || 0), 0) / totalItems : 0;
  const totalVotes = totalItems > 0 ? currentData.reduce((sum, item) => sum + (item.vote_count || 0), 0) : 0;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
              <FaTrophy className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Top Rankings
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the highest rated and most popular movies and TV series based on user ratings and reviews.
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg max-w-2xl mx-auto">
              <p className="text-yellow-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <IconComponent />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Timeframe Filter - Only for Trending */}
        {activeCategory === 'trending' && (
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800 rounded-lg p-1 flex border border-slate-700">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.id}
                  onClick={() => {
                    setActiveTimeframe(timeframe.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTimeframe === timeframe.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {timeframe.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {!loading && totalItems > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-orange-400 mb-1">{totalItems}</div>
              <div className="text-gray-400 text-sm">Total Items</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{highestRating.toFixed(1)}</div>
              <div className="text-gray-400 text-sm">Highest Rating</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-blue-400 mb-1">{averageRating.toFixed(1)}</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-2xl font-bold text-green-400 mb-1">{(totalVotes / 1000).toFixed(1)}k</div>
              <div className="text-gray-400 text-sm">Total Votes</div>
            </div>
          </div>
        )}

        {/* Rankings List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {categories.find(cat => cat.id === activeCategory)?.name}
              {activeCategory === 'trending' && ` - ${timeframes.find(tf => tf.id === activeTimeframe)?.name}`}
            </h2>
            
            {!loading && totalItems > 0 && (
              <div className="flex items-center gap-2 text-gray-400">
                <FaFilter className="text-orange-400" />
                <span>Showing {Math.min(displayedData.length, itemsPerPage)} of {totalItems}</span>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : displayedData.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="space-y-4">
                {displayedData.map((item, index) => (
                  <MediaCard 
                    key={`${item.id}-${activeCategory}-${index}`} 
                    item={item} 
                    rank={(currentPage - 1) * itemsPerPage + index + 1} 
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination />
            </>
          )}
        </div>

        {/* Quick Links */}
        {!loading && displayedData.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-4">
                Explore More Content
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Discover more amazing movies and TV series across different categories and genres.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {/* ✅ FIXED: Quick links dengan path yang benar */}
                <Link 
                  href="/movie" 
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  <FaFilm /> Browse Movies
                </Link>
                <Link 
                  href="/tv-show" 
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <FaTv /> Browse TV Series
                </Link>
                <Link 
                  href="/people" 
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  <FaUsers /> Top Actors
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}