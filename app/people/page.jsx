// app/people/page.jsx - PERBAIKAN COMPLETE DENGAN FORMAT URL BARU
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaUser, FaFilm, FaTv, FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { searchPeople, getPopularPeople } from '../../lib/api';

// Utility function untuk membuat slug dengan format nama-id
const createPersonSlug = (person) => {
  const name = person.name || 'unknown';
  if (!name) return person.id.toString();
  
  const baseSlug = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `${baseSlug}-${person.id}`;
};

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularPeople();
  }, [currentPage]);

  const fetchPopularPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPopularPeople(currentPage);
      console.log('Popular People Data:', data);
      
      // PERBAIKAN: Handle struktur data yang berbeda
      if (data?.results && Array.isArray(data.results)) {
        setPeople(data.results);
        setTotalPages(Math.min(10, data.total_pages || 1));
      } else if (Array.isArray(data)) {
        setPeople(data);
        setTotalPages(1);
      } else {
        setPeople([]);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching popular people:', error);
      setError('Failed to load popular people');
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const results = await searchPeople(searchQuery, 1);
      console.log('Search Results:', results);
      
      // PERBAIKAN: Handle struktur data search
      if (results?.results && Array.isArray(results.results)) {
        setSearchResults(results.results);
      } else if (Array.isArray(results)) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
        setError('No results found');
      }
    } catch (error) {
      console.error('Error searching people:', error);
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
    setCurrentPage(1);
  };

  // PERBAIKAN: Better data handling
  const displayedPeople = isSearching ? searchResults : people;

  // PersonCard component dengan format URL baru
  const PersonCard = ({ person }) => {
    // Buat slug dengan format nama-id
    const slug = createPersonSlug(person);
    
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 group border border-slate-700 hover:border-slate-600">
        <Link href={`/people/${slug}`} className="block">
          <div className="relative aspect-[3/4] bg-gray-700">
            {person.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name || 'Actor'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-600">
                <FaUser className="text-4xl text-gray-400" />
              </div>
            )}
            
            {/* Popularity Badge */}
            {person.popularity && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FaStar className="text-xs" />
                {Math.round(person.popularity)}
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors min-h-[3.5rem]">
              {person.name || 'Unknown Name'}
            </h3>
            
            {person.known_for_department && (
              <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  person.known_for_department === 'Acting' ? 'bg-blue-500' :
                  person.known_for_department === 'Directing' ? 'bg-green-500' :
                  person.known_for_department === 'Writing' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></span>
                {person.known_for_department}
              </p>
            )}
            
            {person.known_for && Array.isArray(person.known_for) && person.known_for.length > 0 && (
              <div className="mt-3">
                <p className="text-gray-500 text-xs uppercase font-semibold mb-1">
                  Known For
                </p>
                <div className="space-y-1">
                  {person.known_for.slice(0, 3).map((work, index) => (
                    <p key={index} className="text-gray-300 text-sm line-clamp-1 flex items-center gap-1">
                      {work?.media_type === 'tv' ? (
                        <FaTv className="text-blue-400 text-xs flex-shrink-0" />
                      ) : (
                        <FaFilm className="text-orange-400 text-xs flex-shrink-0" />
                      )}
                      {work?.title || work?.name || 'Unknown Title'}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {/* View Profile Button */}
            <div className="mt-4 pt-3 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-400 font-medium">View Profile</span>
                <FaArrowRight className="text-orange-400 text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg">
              <FaUser className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Actors & People
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover your favorite actors, directors, and crew members from the world of cinema and television.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search actors, directors, crew..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-semibold"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-center">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          {isSearching && searchQuery && (
            <div className="mt-4 flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <p className="text-gray-400">
                Found <span className="text-white font-semibold">{searchResults.length}</span> results for 
                <span className="text-orange-400 font-semibold"> "{searchQuery}"</span>
              </p>
              <button
                onClick={clearSearch}
                className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isSearching ? 'Search Results' : 'Popular People'}
            </h2>
            {!isSearching && !loading && (
              <div className="flex items-center gap-2 text-gray-400 bg-slate-800 px-3 py-2 rounded-lg">
                <FaUser className="text-orange-400" />
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 18 }).map((_, index) => (
                <div key={index} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden animate-pulse border border-slate-700">
                  <div className="aspect-[3/4] bg-gray-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-700 rounded" />
                    <div className="h-3 bg-gray-700 rounded w-3/4" />
                    <div className="h-8 bg-gray-700 rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedPeople.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
              <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl text-white mb-3">
                {isSearching ? 'No People Found' : 'No People Available'}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {isSearching 
                  ? 'Try adjusting your search terms or browse popular people below.'
                  : 'Unable to load popular people at the moment.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                {!isSearching && (
                  <button
                    onClick={fetchPopularPeople}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Try Again
                  </button>
                )}
                <Link 
                  href="/movie" 
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                >
                  Browse Movies
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {displayedPeople.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>

              {/* Pagination - Only show for popular people, not search results */}
              {!isSearching && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors font-semibold"
                  >
                    <FaArrowLeft /> Previous
                  </button>
                  
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                    <span className="text-gray-300 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors font-semibold"
                  >
                    Next <FaArrowRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Stats */}
        {!loading && displayedPeople.length > 0 && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 mt-12 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              People Database Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-3xl font-bold text-orange-400 mb-2">{displayedPeople.length}</div>
                <div className="text-gray-400 text-sm font-medium">Total People</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {displayedPeople.filter(p => p.known_for_department === 'Acting').length}
                </div>
                <div className="text-gray-400 text-sm font-medium">Actors</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {displayedPeople.filter(p => p.known_for_department === 'Directing').length}
                </div>
                <div className="text-gray-400 text-sm font-medium">Directors</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {new Set(displayedPeople.flatMap(p => p.known_for?.map(k => k?.title || k?.name) || [])).size}
                </div>
                <div className="text-gray-400 text-sm font-medium">Known Works</div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="text-center mt-8 pt-6 border-t border-slate-700">
              <p className="text-gray-400 mb-4">Explore more content</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/movie" 
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  <FaFilm /> Browse Movies
                </Link>
                <Link 
                  href="/tv" 
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <FaTv /> Browse TV Series
                </Link>
                <Link 
                  href="/rankings" 
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  <FaStar /> Top Rankings
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}