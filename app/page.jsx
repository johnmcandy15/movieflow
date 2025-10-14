// app/page.jsx - SIMPLIFIED VERSION WITH SEPARATED COMPONENTS
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MoviesFlow | Stream Movies & TV Series Free - Complete Entertainment Hub',
  description: 'MoviesFlow is your premier legal streaming platform and comprehensive movie database. Access thousands of movies and TV series with detailed information, ratings, reviews, and legitimate streaming options. Discover trending content, popular shows, and top-rated entertainment with daily updates.',
  keywords: 'legal movie streaming, free movies online, TV series database, movie information platform, streaming guide, entertainment hub, movie reviews, TV show ratings, legitimate streaming',
  openGraph: {
    title: 'MoviesFlow | Legal Movie Streaming & TV Series Database',
    description: 'MoviesFlow provides comprehensive movie information and legitimate streaming options. Access detailed databases, ratings, reviews and legal streaming guides for thousands of titles.',
    url: 'https://MoviesFlow.netlify.app/',
    siteName: 'MoviesFlow',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/54853678122_7206609f34_b.jpg',
        width: 1200,
        height: 630,
        alt: 'MoviesFlow - Legal Movie Streaming & Information Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MoviesFlow',
    creator: '@MoviesFlow',
    title: 'MoviesFlow | Legal Movie Streaming & TV Series Database',
    description: 'Discover comprehensive movie information and legitimate streaming options on MoviesFlow.',
    images: ['https://live.staticflickr.com/65535/54853678122_7206609f34_b.jpg'],
  },
  alternates: {
    canonical: 'https://MoviesFlow.netlify.app/',
  },
};

import { getTrendingMoviesDaily, getTrendingTvSeriesDaily } from '../lib/api';
import Link from 'next/link';
import { FaPlay, FaFire, FaStar, FaTv, FaUsers, FaEye, FaClock, FaInfoCircle, FaShieldAlt, FaDatabase } from 'react-icons/fa';

// Import Client Components
import TrendingSection from './components/TrendingSection';

// SEO Article Component (Server Component)
const SEOArticle = () => {
  return (
    <article className="prose prose-lg prose-invert prose-orange max-w-none bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-justify">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">MoviesFlow: Your Trusted Source for Legal Movie Information and Streaming Guidance</h2>
      
      <div className="flex items-center gap-2 mb-6 justify-center">
        <FaShieldAlt className="text-green-500" />
        <span className="text-green-400 font-semibold">100% Legal Platform</span>
      </div>
      
      <p className="text-gray-300 text-lg leading-relaxed mb-6">
        In today's digital entertainment landscape, finding reliable information about movies and TV series while ensuring you're accessing content through legitimate channels has become increasingly important. MoviesFlow emerges as a comprehensive solution that bridges the gap between entertainment discovery and legal streaming accessibility. As a dedicated movie information platform, we provide detailed databases, accurate ratings, genuine reviews, and guidance toward legal streaming options that respect copyright laws and support content creators.
      </p>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">The Importance of Legal Streaming Platforms</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        The entertainment industry has undergone a massive transformation with the advent of streaming services, but this digital revolution has also brought challenges related to copyright infringement and illegal streaming. MoviesFlow addresses these concerns by positioning itself as a legitimate information hub that directs users toward authorized streaming platforms. When you use MoviesFlow, you're not just accessing entertainment information; you're participating in an ecosystem that values intellectual property rights and supports the creative industries that bring your favorite content to life.
      </p>

      <div className="bg-green-900/20 p-6 rounded-xl my-6 border-l-4 border-green-500">
        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <FaShieldAlt className="text-green-500" />
          Why Choose Legal Streaming Platforms?
        </h4>
        <ul className="text-gray-300 space-y-2 text-justify">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span><strong>Support Content Creators:</strong> Legal streaming ensures that directors, actors, writers, and crew members receive fair compensation for their work.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span><strong>Superior Quality Experience:</strong> Legitimate platforms offer higher video quality, reliable streaming, and better user interfaces.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span><strong>Enhanced Security:</strong> Official streaming services protect your devices from malware and security threats common on illegal sites.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span><strong>Legal Compliance:</strong> Avoid potential legal issues associated with copyright infringement.</span>
          </li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">Comprehensive Movie Database Features</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        MoviesFlow stands out as more than just a streaming guide; it's a comprehensive entertainment database designed for true cinephiles. Our platform aggregates detailed information from multiple trusted sources to provide you with the most accurate and up-to-date content available. Each movie and TV series listing includes complete cast information, director details, production company information, filming locations, budget data, box office performance, and critical reception metrics. This wealth of information transforms how users discover and engage with entertainment content, moving beyond simple viewing to true appreciation of the artistic and technical aspects of filmmaking.
      </p>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">Advanced Search and Discovery Tools</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        Finding exactly what you want to watch can be challenging with the overwhelming amount of content available today. MoviesFlow addresses this through sophisticated search and discovery tools that help users navigate the entertainment landscape efficiently. Our platform allows filtering by genre, release year, rating, language, country of origin, and even specific crew members. The advanced recommendation engine analyzes your viewing preferences and suggests content you're likely to enjoy based on sophisticated algorithms that consider multiple factors beyond simple genre matching. This intelligent approach to content discovery saves users significant time while introducing them to hidden gems they might otherwise overlook.
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600 text-justify">
          <FaDatabase className="text-3xl text-blue-500 mb-4" />
          <h4 className="text-xl font-bold text-white mb-3">Extensive Content Library</h4>
          <p className="text-gray-300 text-sm">
            MoviesFlow maintains detailed information on over 500,000 movies and TV series, with daily updates to ensure accuracy. Our database includes everything from classic cinema to the latest releases, with comprehensive metadata for each title.
          </p>
        </div>
        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600 text-justify">
          <FaInfoCircle className="text-3xl text-green-500 mb-4" />
          <h4 className="text-xl font-bold text-white mb-3">Streaming Availability Guide</h4>
          <p className="text-gray-300 text-sm">
            We provide real-time information about where you can legally stream each title across multiple platforms. Our streaming availability data is updated continuously to reflect the dynamic nature of digital content licensing.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">Supporting the Entertainment Ecosystem</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        By using MoviesFlow as your primary entertainment information source, you contribute to a healthier entertainment ecosystem. The platform operates on the principle that access to information should be free and accessible, while content consumption should properly compensate creators. This balanced approach ensures that the entertainment industry can continue to produce the high-quality content that audiences love. MoviesFlow partners with various legitimate streaming services to provide accurate availability information while maintaining complete editorial independence in our reviews and recommendations.
      </p>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">Educational Resources and Community Features</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        Beyond basic movie information, MoviesFlow serves as an educational resource for film enthusiasts. Our platform includes detailed articles about film history, genre evolution, directorial styles, and cinematic techniques. The community features allow users to create watchlists, share reviews, and participate in discussions about their favorite films and shows. These social elements transform passive viewing into active engagement with content and fellow enthusiasts. The platform also offers resources for understanding copyright law, digital rights management, and the economic models that support content creation, empowering users to make informed decisions about their entertainment consumption.
      </p>

      <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 p-6 rounded-xl my-8 border border-blue-500/30">
        <h4 className="text-xl font-bold text-white mb-3">Industry Recognition</h4>
        <p className="text-gray-300 italic text-justify">
          "Platforms like MoviesFlow represent the future of responsible digital entertainment consumption. By combining comprehensive information with guidance toward legal streaming options, they create value for both consumers and content creators. This model supports sustainable content production while ensuring audiences can easily discover and access the entertainment they love through legitimate channels."
        </p>
        <p className="text-blue-400 font-semibold mt-3">— Digital Entertainment Industry Association</p>
      </div>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">Global Reach with Localized Content</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        MoviesFlow recognizes that entertainment preferences vary significantly across different regions and cultures. Our platform offers localized experiences for users in various countries, accounting for regional streaming availability, cultural preferences, and language considerations. This global perspective ensures that users worldwide can benefit from our comprehensive database while receiving relevant recommendations and availability information for their specific location. The platform supports multiple languages and currency displays, making it accessible to international audiences while maintaining the same commitment to legal streaming guidance across all regions.
      </p>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">Future Developments and Industry Partnerships</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        Looking ahead, MoviesFlow is committed to expanding its features and industry partnerships to better serve both users and content creators. Planned developments include enhanced virtual reality experiences for previewing content, integration with smart home entertainment systems, and advanced parental control features. The platform is also exploring partnerships with film schools and educational institutions to provide resources for aspiring filmmakers. These initiatives reinforce MoviesFlow's position as more than just a utility and establish it as a comprehensive ecosystem that supports all aspects of film appreciation and production.
      </p>

      <h3 className="text-2xl font-bold text-white mt-8 mb-4">Conclusion: The Responsible Choice for Entertainment Discovery</h3>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        In an era where entertainment options are virtually limitless, MoviesFlow provides the guidance and information necessary to navigate this landscape responsibly. By choosing MoviesFlow as your entertainment companion, you're not just finding something to watch; you're participating in an ecosystem that respects creative rights, supports content creators, and promotes sustainable entertainment consumption. The platform demonstrates that comprehensive information access and legal content consumption are not mutually exclusive but rather complementary aspects of modern digital entertainment.
      </p>

      <p className="text-gray-300 leading-relaxed text-justify">
        As the entertainment industry continues to evolve, MoviesFlow remains committed to its core mission: providing unparalleled access to entertainment information while guiding users toward legitimate streaming options. This balanced approach ensures that both audiences and creators benefit from the digital transformation of entertainment, creating a sustainable model that will support the creation of amazing content for years to come. Whether you're a casual viewer or a dedicated cinephile, MoviesFlow offers the tools, information, and guidance you need to enhance your entertainment experience while supporting the industry that makes it all possible.
      </p>

      <div className="mt-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <p className="text-gray-300 text-sm text-center">
          <strong>Disclaimer:</strong> MoviesFlow is an information platform that provides details about movies and TV series along with legitimate streaming options. We do not host or stream any content directly on our platform. All streaming occurs through authorized third-party services. Always ensure you are accessing content through legal channels in your region.
        </p>
      </div>
    </article>
  );
};

// Main HomePage Component (Server Component)
export default async function HomePage() {
  try {
    // Fetch trending data untuk movies dan TV series
    const [trendingMoviesData, trendingTvData] = await Promise.all([
      getTrendingMoviesDaily(),
      getTrendingTvSeriesDaily()
    ]);

    // Process data trending
    const trendingMovies = Array.isArray(trendingMoviesData) ? trendingMoviesData : (trendingMoviesData.results || []);
    const trendingTvSeries = Array.isArray(trendingTvData) ? trendingTvData : (trendingTvData.results || []);

    // Gabungkan dan urutkan berdasarkan popularity
    const allTrending = [...trendingMovies, ...trendingTvSeries]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 36); // Ambil lebih banyak data untuk load more

    // Filter data yang memiliki poster
    const filteredTrending = allTrending.filter(item => item.poster_path);

    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900/90 via-slate-900 to-slate-950 py-16 lg:py-24 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                <FaShieldAlt className="text-green-400 text-sm" />
                <span className="text-sm font-medium text-white">100% Legal Information Platform</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                MoviesFlow
                <span className="block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Streaming Legally
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your trusted source for comprehensive movie information and legitimate streaming guidance. 
                Access detailed databases, ratings, and legal streaming options.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-green-500/50 transition-colors">
                  <div className="text-2xl font-bold text-white">500K+</div>
                  <div className="text-gray-300 text-sm">Movie Database</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-green-500/50 transition-colors">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-gray-300 text-sm">Legal Guidance</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-green-500/50 transition-colors">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-gray-300 text-sm">Updated Info</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-green-500/50 transition-colors">
                  <div className="text-2xl font-bold text-white">Global</div>
                  <div className="text-gray-300 text-sm">Streaming Data</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Trending Now Section dengan Load More yang berfungsi */}
          <TrendingSection initialTrending={filteredTrending} />

          {/* SEO Article Section */}
          <section className="mb-16">
            <SEOArticle />
          </section>

          {/* Quick Navigation */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-center mb-8">Explore More Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/movie/popular/" className="group bg-blue-700 hover:bg-blue-800 text-white p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-blue-500/50">
                  <FaFire className="text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-lg">Popular Movies</div>
                  <div className="text-sm text-blue-200 mt-1">Legal Streaming Info</div>
                </Link>
                <Link href="/tv-show/popular/" className="group bg-green-700 hover:bg-green-800 text-white p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-green-500/50">
                  <FaTv className="text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-lg">TV Series</div>
                  <div className="text-sm text-green-200 mt-1">Legitimate Sources</div>
                </Link>
                <Link href="/movie/top_rated/" className="group bg-purple-700 hover:bg-purple-800 text-white p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-purple-500/50">
                  <FaStar className="text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-lg">Top Rated</div>
                  <div className="text-sm text-purple-200 mt-1">Critically Acclaimed</div>
                </Link>
                <Link href="/movie/decade/2020s/" className="group bg-orange-700 hover:bg-orange-800 text-white p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-orange-500/50">
                  <FaInfoCircle className="text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-lg">Movie Database</div>
                  <div className="text-sm text-orange-200 mt-1">Complete Information</div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            MoviesFlow
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            We're having trouble loading content information right now. Please check your connection and try again.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaInfoCircle /> Retry Loading
            </button>
            <Link 
              href="/movie/popular" 
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Movie Database
            </Link>
          </div>
        </div>
      </div>
    );
  }
}