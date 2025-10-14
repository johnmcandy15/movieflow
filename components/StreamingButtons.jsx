// components/StreamingButtons.jsx - AFFILIATE STREAMING BUTTONS

import { FaPlay, FaExternalLinkAlt } from 'react-icons/fa';

const streamingServices = {
  netflix: {
    name: 'Netflix',
    color: 'bg-red-600 hover:bg-red-700',
    affiliateUrl: 'https://www.netflix.com/search?q=',
    icon: '🎬'
  },
  prime: {
    name: 'Prime Video',
    color: 'bg-blue-600 hover:bg-blue-700',
    affiliateUrl: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=',
    icon: '📺'
  },
  disney: {
    name: 'Disney+',
    color: 'bg-blue-800 hover:bg-blue-900',
    affiliateUrl: 'https://www.disneyplus.com/search?q=',
    icon: '🏰'
  },
  hbo: {
    name: 'HBO Max',
    color: 'bg-purple-600 hover:bg-purple-700',
    affiliateUrl: 'https://play.hbomax.com/search?q=',
    icon: '⚡'
  },
  hulu: {
    name: 'Hulu',
    color: 'bg-green-600 hover:bg-green-700',
    affiliateUrl: 'https://www.hulu.com/search?q=',
    icon: '🟢'
  }
};

export default function StreamingButtons({ title, mediaType, watchProviders, large = false }) {
  // Fallback to all major streaming services if no provider data
  const availableServices = watchProviders?.US?.flatrate 
    ? watchProviders.US.flatrate.map(provider => {
        const serviceKey = Object.keys(streamingServices).find(key => 
          streamingServices[key].name.toLowerCase().includes(provider.provider_name.toLowerCase()) ||
          provider.provider_name.toLowerCase().includes(streamingServices[key].name.toLowerCase())
        );
        return serviceKey ? { ...streamingServices[serviceKey], provider } : null;
      }).filter(Boolean)
    : Object.values(streamingServices);

  const buttonSize = large 
    ? 'px-8 py-4 text-lg font-semibold' 
    : 'px-4 py-2 text-sm font-medium';

  return (
    <div className="streaming-buttons">
      <h3 className={`text-${large ? 'xl' : 'lg'} font-bold mb-4 text-white`}>
        {large ? 'Available On:' : 'Stream Now:'}
      </h3>
      
      <div className={`flex flex-wrap gap-3 ${large ? 'justify-center' : ''}`}>
        {availableServices.slice(0, large ? 6 : 4).map((service, index) => (
          <a
            key={index}
            href={`${service.affiliateUrl}${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`
              ${service.color} 
              ${buttonSize}
              text-white 
              rounded-lg 
              transition-all 
              duration-300 
              transform 
              hover:scale-105 
              hover:shadow-lg
              flex 
              items-center 
              gap-2
              text-center
              justify-center
            `}
          >
            <span className="text-lg">{service.icon}</span>
            <span>{service.name}</span>
            <FaExternalLinkAlt className="text-xs opacity-70" />
          </a>
        ))}
        
        {/* Fallback generic stream button */}
        {availableServices.length === 0 && (
          <button className={`
            bg-gradient-to-r from-purple-600 to-pink-600 
            ${buttonSize}
            text-white 
            rounded-lg 
            transition-all 
            duration-300 
            transform 
            hover:scale-105 
            hover:shadow-lg
            flex 
            items-center 
            gap-2
          `}>
            <FaPlay />
            Find Streaming Options
          </button>
        )}
      </div>

      {large && (
        <p className="text-gray-400 text-sm mt-4">
          Click any button to check availability on your preferred streaming service
        </p>
      )}
    </div>
  );
}