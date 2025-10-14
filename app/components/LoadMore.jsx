'use client';

import { FaArrowRight } from 'react-icons/fa';

const LoadMore = ({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Loading...
          </>
        ) : (
          <>
            <FaArrowRight className="text-sm" />
            Load More Trending
          </>
        )}
      </button>
    </div>
  );
};

export default LoadMore;