"use client";

import { useState } from 'react';
import { getTvSeriesSeasonDetails } from '../lib/api';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp, FaCalendar, FaStar } from 'react-icons/fa';

export default function SeasonAccordion({ tvShowId, totalSeasons, currentSeason }) {
  const [openSeason, setOpenSeason] = useState(1);
  const [seasonsData, setSeasonsData] = useState({ 1: currentSeason });
  const [loading, setLoading] = useState(false);

  const handleSeasonClick = async (seasonNumber) => {
    if (openSeason === seasonNumber) {
      setOpenSeason(null);
      return;
    }

    setOpenSeason(seasonNumber);

    // Load season data if not already loaded
    if (!seasonsData[seasonNumber]) {
      setLoading(true);
      try {
        const seasonData = await getTvSeriesSeasonDetails(tvShowId, seasonNumber);
        setSeasonsData(prev => ({ ...prev, [seasonNumber]: seasonData }));
      } catch (error) {
        console.error('Error loading season data:', error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(seasonNumber => (
        <div key={seasonNumber} className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => handleSeasonClick(seasonNumber)}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 transition-colors flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                S{seasonNumber}
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-white">
                  Season {seasonNumber}
                </h4>
                {seasonsData[seasonNumber] && (
                  <p className="text-sm text-gray-400">
                    {seasonsData[seasonNumber].episodes?.length || 0} episodes • {seasonsData[seasonNumber].air_date?.substring(0, 4)}
                  </p>
                )}
              </div>
            </div>
            {openSeason === seasonNumber ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {openSeason === seasonNumber && seasonsData[seasonNumber] && (
            <div className="p-4 bg-gray-900/50">
              {seasonsData[seasonNumber].overview && (
                <p className="text-gray-300 mb-4">{seasonsData[seasonNumber].overview}</p>
              )}
              
              <div className="grid gap-3">
                {seasonsData[seasonNumber].episodes?.map(episode => (
                  <div key={episode.id} className="flex gap-3 p-3 bg-gray-800/50 rounded-lg">
                    {episode.still_path && (
                      <div className="flex-shrink-0 w-20 h-12 relative rounded overflow-hidden">
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt={episode.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-semibold text-white text-sm">
                          E{episode.episode_number}. {episode.name}
                        </h5>
                        {episode.vote_average > 0 && (
                          <span className="flex items-center text-xs text-gray-400">
                            <FaStar className="text-yellow-400 mr-1" />
                            {episode.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {episode.overview || 'No description available.'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {episode.air_date && (
                          <span className="flex items-center">
                            <FaCalendar className="mr-1" />
                            {new Date(episode.air_date).toLocaleDateString()}
                          </span>
                        )}
                        <span>Runtime: {episode.runtime || 'N/A'}min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {openSeason === seasonNumber && loading && (
            <div className="p-8 text-center text-gray-400">
              Loading episodes...
            </div>
          )}
        </div>
      ))}
    </div>
  );
}