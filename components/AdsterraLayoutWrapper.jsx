"use client";

import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function AdsterraLayoutWrapper({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let scriptsLoaded = false;
      let domContentLoadedHandler = null;
      
      const loadAdScripts = () => {
        if (scriptsLoaded) return;
        
        try {
          // Memuat skrip iklan Native Banner
          const nativeBannerScript = document.createElement('script');
          nativeBannerScript.src = "//eminencehillsidenutrition.com/a972afd9ef6f79d311ad85394e94e941/invoke.js";
          nativeBannerScript.async = true;
          nativeBannerScript.setAttribute('data-cfasync', 'false');
          nativeBannerScript.id = 'adsterra-native-banner';
          nativeBannerScript.onerror = () => console.error('Failed to load Native Banner script');
          document.body.appendChild(nativeBannerScript);

          // Memuat skrip iklan Popunder
          const popunderScript = document.createElement('script');
          popunderScript.type = 'text/javascript';
          popunderScript.src = "//eminencehillsidenutrition.com/36/96/d3/3696d38e5fba4e62f5224cfc9b0e04b1.js";
          popunderScript.async = true;
          popunderScript.id = 'adsterra-popunder';
          popunderScript.onerror = () => console.error('Failed to load Popunder script');
          document.body.appendChild(popunderScript);

          // Memuat skrip iklan Social Bar
          const socialBarScript = document.createElement('script');
          socialBarScript.type = 'text/javascript';
          socialBarScript.src = "//eminencehillsidenutrition.com/35/c2/3f/35c23f97dc89a6b93f76f1e1591e690c.js";
          socialBarScript.async = true;
          socialBarScript.id = 'adsterra-social-bar';
          socialBarScript.onerror = () => console.error('Failed to load Social Bar script');
          document.body.appendChild(socialBarScript);

          scriptsLoaded = true;
        } catch (error) {
          console.error('Error loading Adsterra scripts:', error);
        }
      };

      // Optimized loading strategy
      const optimizedLoad = () => {
        if (document.readyState === 'loading') {
          // Jika DOM masih loading, tunggu event DOMContentLoaded
          domContentLoadedHandler = () => loadAdScripts();
          document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
        } else {
          // Jika DOM sudah ready, gunakan requestIdleCallback atau setTimeout
          if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => {
              loadAdScripts();
            });
          } else {
            // Fallback untuk browser yang tidak support requestIdleCallback
            setTimeout(loadAdScripts, 500);
          }
        }
      };

      optimizedLoad();

      return () => {
        // Cleanup event listeners
        if (domContentLoadedHandler) {
          document.removeEventListener('DOMContentLoaded', domContentLoadedHandler);
        }
        
        // Hapus scripts jika ada
        const scriptsToRemove = [
          'adsterra-native-banner',
          'adsterra-popunder', 
          'adsterra-social-bar'
        ];
        
        scriptsToRemove.forEach(id => {
          const script = document.getElementById(id);
          if (script && script.parentNode) {
            try {
              script.parentNode.removeChild(script);
            } catch (error) {
              console.error(`Error removing script ${id}:`, error);
            }
          }
        });

        scriptsLoaded = false;
      };
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}

// Prop Types untuk type safety
AdsterraLayoutWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};