'use client';

import { useState } from 'react';
import { FaFire } from 'react-icons/fa';
import MediaCard from './MediaCard';
import LoadMore from './LoadMore';

const TrendingSection = ({ initialTrending }) => {
  const [trendingItems, setTrendingItems] = useState(initialTrending.slice(0, 12));
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTrending.length > 12);

  const handleLoadMore = async () => {
    setIsLoading(true);
    
    // Simulasi loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nextPage = currentPage + 1;
    const startIndex = nextPage * 12;
    const endIndex = startIndex + 12;
    const newItems = initialTrending.slice(startIndex, endIndex);
    
    if (newItems.length > 0) {
      setTrendingItems(prev => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < initialTrending.length);
    } else {
      setHasMore(false);
    }
    
    setIsLoading(false);
  };

  return (
    <section className="mb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaFire className="text-4xl text-orange-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Trending Today</h2>
            <p className="text-gray-400 mt-1">Most popular movies and TV series updated in real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-slate-800 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Data
          </div>
        </div>
      </div>

      {trendingItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {trendingItems.map((item, index) => (
              <MediaCard key={`${item.id}-${item.media_type}-${index}`} item={item} index={index} />
            ))}
          </div>
          
          {/* Load More Button - Client Component */}
          <LoadMore 
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        </>
      ) : (
        <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700">
          <FaFire className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Trending Content Available</h3>
          <p className="text-gray-500">Check back later for the latest trending movies and TV series</p>
        </div>
      )}
    </section>
  );
};

export default TrendingSection;