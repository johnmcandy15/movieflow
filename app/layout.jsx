import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdsterraLayoutWrapper from '../components/AdsterraLayoutWrapper';

export const metadata = {
  title: 'MoviesFlow | Stream Movies & TV Series Free - Complete Movie Database',
  description: 'MoviesFlow is your ultimate movie database with 10,000+ movies, 5,000+ TV series, actor profiles, genre pages, and yearly archives. Discover, stream, and enjoy cinematic excellence with our comprehensive entertainment platform.',
  keywords: 'watch movies, stream tv series, movie database, watch now, free movies, tv shows, actors, genres, rankings',
  openGraph: {
    title: 'MoviesFlow | Complete Movie & TV Series Database',
    description: 'Your ultimate destination for movies, TV series, actor profiles, and streaming information. Explore genres, yearly archives, and top rankings.',
    url: 'https://MoviesFlow.netlify.app/',
    siteName: 'MoviesFlow',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/54853678122_7206609f34_b.jpg',
        width: 1200,
        height: 630,
        alt: 'MoviesFlow - Complete Movie Database',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WatchStream123',
    creator: '@WatchStream123',
    title: 'MoviesFlow | Complete Movie & TV Series Database',
    description: 'Explore 10,000+ movies, 5,000+ TV series, actor profiles, and streaming guides on MoviesFlow.',
    images: ['https://live.staticflickr.com/65535/54853678122_7206609f34_b.jpg'],
  },
  other: {
    'fb:app_id': '100074345305108',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
	  <head>
        {/* Tag verifikasi Google Search Console */}
        <meta name="google-site-verification" content="_xeYD3d894AfkvHskmLZWum11FS51f3z72IMqm-XhcM" />
        
        {/* Schema.org markup untuk Movie Database */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MovieDatabase",
              "name": "MoviesFlow",
              "description": "Complete movie and TV series database with streaming information",
              "url": "https://MoviesFlow.netlify.app/",
              "logo": "https://live.staticflickr.com/65535/54853678122_7206609f34_b.jpg",
              "sameAs": [
                "https://MoviesFlow.netlify.app/"
              ]
            })
          }}
        />
      </head>
      <body>
        <AdsterraLayoutWrapper>
          <div className="flex flex-col min-h-screen bg-slate-900">
            <header className="w-full max-w-7xl mx-auto px-4 py-4 sticky top-0 z-50 bg-slate-900 shadow-lg">
              <Navbar />
            </header>
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 mt-2">
              {children}
            </main>
            <footer className="w-full max-w-7xl mx-auto px-4 py-8">
              {/* Tempatkan div Native Banner di sini, sebelum Footer */}
              <div id="container-a972afd9ef6f79d311ad85394e94e941"></div>
              <Footer />
            </footer>
          </div>
        </AdsterraLayoutWrapper>
      </body>
    </html>
  );
}