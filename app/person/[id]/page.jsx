// app/person/[id]/page.jsx - IMPROVED VERSION WITH SLUG FORMAT
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaFilm, FaTv, FaStar, FaCalendar, FaMapMarkerAlt, FaUser, FaArrowLeft } from 'react-icons/fa';
import { getPersonById, getPersonMovieCredits, getPersonTvCredits } from '../../../lib/api';

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

export default function PersonDetailPage() {
  const params = useParams();
  const personId = params.id;
  
  const [person, setPerson] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (personId) {
      fetchPersonData();
    }
  }, [personId]);

  const fetchPersonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [personData, movieData, tvData] = await Promise.all([
        getPersonById(personId),
        getPersonMovieCredits(personId),
        getPersonTvCredits(personId)
      ]);
      
      setPerson(personData);
      setMovieCredits(movieData?.cast || []);
      setTvCredits(tvData?.cast || []);
    } catch (error) {
      console.error('Error fetching person data:', error);
      setError('Failed to load person data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            {/* Back Button Skeleton */}
            <div className="h-6 bg-gray-700 rounded w-24 mb-6"></div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Skeleton */}
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="aspect-[3/4] bg-gray-700 rounded-lg" />
              </div>
              
              {/* Content Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-700 rounded w-2/3" />
                <div className="h-24 bg-gray-700 rounded" />
                <div className="h-6 bg-gray-700 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-8 rounded-xl max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Error Loading Person</h1>
            <p className="mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchPersonData}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
              <Link 
                href="/people" 
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Back to Actors
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Person Not Found
  if (!person) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-slate-800 rounded-xl p-8 max-w-2xl mx-auto">
            <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl text-white mb-4">Person Not Found</h1>
            <p className="text-gray-400 mb-6">
              The person you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/people" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FaArrowLeft /> Back to Actors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday, deathday) => {
    if (!birthday) return null;
    
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const CreditItem = ({ credit, type = 'movie' }) => {
    const isTV = type === 'tv';
    const title = credit.title || credit.name;
    const date = isTV ? credit.first_air_date : credit.release_date;
    const year = date ? new Date(date).getFullYear() : 'TBA';
    
    // Buat slug berdasarkan tipe konten dengan format judul-tahun-id
    const slug = isTV ? createTvSlug(credit) : createMovieSlug(credit);
    
    return (
      <div className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-all duration-300 group">
        <div className="flex gap-4">
          {/* Poster */}
          {credit.poster_path ? (
            <div className="relative w-16 h-24 flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                alt={title}
                fill
                className="object-cover rounded group-hover:scale-105 transition-transform duration-300"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
              {isTV ? <FaTv className="text-gray-500 text-xl" /> : <FaFilm className="text-gray-500 text-xl" />}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* LINK DENGAN FORMAT SLUG BARU: movie/the-matrix-1999-603 atau tv/breaking-bad-2008-1396 */}
            <Link 
              href={isTV ? `/tv/${slug}` : `/movie/${slug}`}
              className="font-semibold text-white hover:text-orange-400 transition-colors line-clamp-2 text-lg leading-tight"
            >
              {title}
            </Link>
            
            {/* Character/Job */}
            {(credit.character || credit.job) && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                {credit.character ? `as ${credit.character}` : credit.job}
              </p>
            )}
            
            {/* Metadata */}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {year !== 'TBA' && (
                <span className="bg-slate-700 px-2 py-1 rounded">{year}</span>
              )}
              
              {credit.vote_average > 0 && (
                <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                  <FaStar className="text-yellow-400 text-xs" />
                  <span>{credit.vote_average.toFixed(1)}</span>
                </div>
              )}
              
              {isTV && credit.episode_count && (
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                  {credit.episode_count} episodes
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper functions for statistics
  const getTotalCredits = () => movieCredits.length + tvCredits.length;
  const getAverageRating = () => {
    const allCredits = [...movieCredits, ...tvCredits];
    const ratedCredits = allCredits.filter(credit => credit.vote_average > 0);
    if (ratedCredits.length === 0) return 0;
    return ratedCredits.reduce((sum, credit) => sum + credit.vote_average, 0) / ratedCredits.length;
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/people" 
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6 transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Actors
        </Link>

        {/* Person Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Profile Image */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            {person.profile_path ? (
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[3/4] bg-gray-700 rounded-lg flex items-center justify-center shadow-2xl">
                <FaUser className="text-6xl text-gray-500" />
              </div>
            )}
          </div>

          {/* Person Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {person.name}
            </h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{getTotalCredits()}</div>
                <div className="text-gray-400 text-sm">Total Credits</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{movieCredits.length}</div>
                <div className="text-gray-400 text-sm">Movies</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{tvCredits.length}</div>
                <div className="text-gray-400 text-sm">TV Shows</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{getAverageRating().toFixed(1)}</div>
                <div className="text-gray-400 text-sm">Avg Rating</div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {person.known_for_department && (
                <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-lg">
                  <FaUser className="text-orange-400 text-lg" />
                  <div>
                    <div className="text-gray-400 text-sm">Department</div>
                    <div className="text-white font-medium">{person.known_for_department}</div>
                  </div>
                </div>
              )}
              
              {person.birthday && (
                <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-lg">
                  <FaCalendar className="text-orange-400 text-lg" />
                  <div>
                    <div className="text-gray-400 text-sm">Birthday</div>
                    <div className="text-white font-medium">
                      {formatDate(person.birthday)}
                      {calculateAge(person.birthday, person.deathday) && (
                        <span className="text-gray-500 ml-2">
                          (Age {calculateAge(person.birthday, person.deathday)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {person.place_of_birth && (
                <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-lg">
                  <FaMapMarkerAlt className="text-orange-400 text-lg" />
                  <div>
                    <div className="text-gray-400 text-sm">Birth Place</div>
                    <div className="text-white font-medium">{person.place_of_birth}</div>
                  </div>
                </div>
              )}
              
              {person.deathday && (
                <div className="flex items-center gap-3 bg-red-900/20 px-4 py-3 rounded-lg border border-red-800/50">
                  <FaCalendar className="text-red-400 text-lg" />
                  <div>
                    <div className="text-gray-400 text-sm">Death Date</div>
                    <div className="text-white font-medium">{formatDate(person.deathday)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Biography */}
            {person.biography && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Biography</h2>
                <div className="relative">
                  <p className="text-gray-300 leading-relaxed line-clamp-6 transition-all duration-300 bg-slate-800 rounded-lg p-4">
                    {person.biography}
                  </p>
                  {person.biography.length > 500 && (
                    <button
                      onClick={(e) => {
                        const paragraph = e.target.previousElementSibling;
                        paragraph.classList.toggle('line-clamp-6');
                        e.target.textContent = paragraph.classList.contains('line-clamp-6') 
                          ? 'Read More' 
                          : 'Read Less';
                      }}
                      className="mt-2 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Popularity */}
            {person.popularity && (
              <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-lg inline-flex">
                <FaStar className="text-yellow-400" />
                <span className="text-gray-300">Popularity: </span>
                <span className="text-white font-medium">{person.popularity.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filmography Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-slate-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'movies'
                  ? 'border-orange-400 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FaFilm /> 
              Movies 
              <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                {movieCredits.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'tv'
                  ? 'border-orange-400 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FaTv /> 
              TV Series 
              <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                {tvCredits.length}
              </span>
            </button>
          </div>
        </div>

        {/* Filmography Content */}
        <div>
          {activeTab === 'movies' && (
            <div className="space-y-4">
              {movieCredits.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-lg">
                  <FaFilm className="text-4xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">No Movie Credits</h3>
                  <p className="text-gray-400">No movie credits found for this person.</p>
                </div>
              ) : (
                movieCredits
                  .sort((a, b) => new Date(b.release_date || '1900') - new Date(a.release_date || '1900'))
                  .map((credit) => (
                    <CreditItem key={`movie-${credit.id}-${credit.character}`} credit={credit} type="movie" />
                  ))
              )}
            </div>
          )}

          {activeTab === 'tv' && (
            <div className="space-y-4">
              {tvCredits.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-lg">
                  <FaTv className="text-4xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">No TV Credits</h3>
                  <p className="text-gray-400">No TV credits found for this person.</p>
                </div>
              ) : (
                tvCredits
                  .sort((a, b) => new Date(b.first_air_date || '1900') - new Date(a.first_air_date || '1900'))
                  .map((credit) => (
                    <CreditItem key={`tv-${credit.id}-${credit.character}`} credit={credit} type="tv" />
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}