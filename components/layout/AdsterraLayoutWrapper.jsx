// components/layout/AdsterraLayoutWrapper.jsx
"use client";

import { useEffect, useRef } from 'react';
import { getAIOptimizer } from '../../utils/adsterra';

export default function AdsterraLayoutWrapper({ children, countryCode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized.current) {
        const optimizer = getAIOptimizer();
        if (optimizer) {
            optimizer.setGeo(countryCode);
        }

        const nativeContainer = document.getElementById('container-a972afd9ef6f79d311ad85394e94e941');

        const visibleAds = [
            { id: 'native', src: '//fundingfashioned.com/a972afd9ef6f79d311ad85394e94e941/invoke.js' },
            { id: 'social', src: '//fundingfashioned.com/35/c2/3f/35c23f97dc89a6b93f76f1e1591e690c.js' }
        ];

        visibleAds.forEach(s => {
            if(document.querySelector(`script[src="${s.src}"]`)) return;
            const el = document.createElement('script');
            el.src = s.src;
            el.async = true;
            
            // PERBAIKAN: Masukkan script native ke kontainer footer jika ada
            if (s.id === 'native' && nativeContainer) {
                nativeContainer.appendChild(el);
            } else {
                document.body.appendChild(el);
            }
        });

        setTimeout(() => {
            if(document.querySelector(`script[src*="3696d38e5fba4e62f5224cfc9b0e04b1"]`)) return;
            const popunder = document.createElement('script');
            popunder.src = '//fundingfashioned.com/36/96/d3/3696d38e5fba4e62f5224cfc9b0e04b1.js'; 
            document.head.appendChild(popunder);
        }, 3500);

        initialized.current = true;
    }
  }, [countryCode]);

  return <>{children}</>;
}