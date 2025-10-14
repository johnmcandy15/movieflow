// utils/adsterra.js
// File utilitas untuk mengelola logika Adsterra.

// Daftar tautan direct link Adsterra.
const ADSTERRA_DIRECT_LINKS = [
    'https://eminencehillsidenutrition.com/t71keggw?key=9c6906c82c8eb114e2baef9058f4c4e5', 
    'https://eminencehillsidenutrition.com/vb5ixea83?key=c4e7438c85503eda026984db5e7aa3c4',
    'https://eminencehillsidenutrition.com/a43vczjf1b?key=70467091cade36a7f916bfe58dc80cff',
    'https://eminencehillsidenutrition.com/g77bpz0g?key=f1cc7147d1c59d932b6186896ab8854c',
    'https://eminencehillsidenutrition.com/vttzzi1n?key=bfc8d7d57de835830a0d72fbe7a47be1',
    'https://eminencehillsidenutrition.com/y5fc24f7?key=d6efa8068c5da148ed5cf346ffa62290',
    'https://eminencehillsidenutrition.com/rz2xzbfm?key=8c4045c97068010d84c3f1002e82b1c9',
    'https://eminencehillsidenutrition.com/qn92sfcb?key=a8333f15c6bba15e367a5456f691547c',
    'https://eminencehillsidenutrition.com/w2sw8zgx21?key=d34ca1378210247721e98e65d20b3693',
    'https://eminencehillsidenutrition.com/x818nj48?key=db0a9d9fa9d81626b459383a7bdc33ee',
    'https://eminencehillsidenutrition.com/gd8bwkyj?key=d2d35cf16f521bf5e9accfdd865dae8f',
    'https://eminencehillsidenutrition.com/paij3re0by?key=fa60f72b73c05d987bd978f83a6deaa8',
    'https://eminencehillsidenutrition.com/gh4tkda15?key=080742d09d4b5234a4fdaa773e48ebd4',
    'https://eminencehillsidenutrition.com/u1ipxidjif?key=bf544685cc418fde38d3de4391de6fee',
    'https://eminencehillsidenutrition.com/nu4ravi1cx?key=4d0556009c2d17968977e235d5de925a',
    'https://eminencehillsidenutrition.com/wdhedf2wx?key=a2c98838af4390b59e8b7aaaea3f1660',
    'https://eminencehillsidenutrition.com/yed8kj7bvw?key=b7830767455354f8e097df2a9e0f040c'
];

/**
 * Fungsi untuk menangani klik pada tautan dengan logika Adsterra.
 * Ini akan melacak jumlah klik dan membuka iklan pada interval tertentu.
 * @param {Event} e - Objek event dari klik.
 * @param {string} targetUrl - URL tujuan yang akan dibuka setelah iklan.
 */
export const handleAdsterraClick = (e, targetUrl) => {
    // Memastikan kode ini hanya berjalan di sisi client (browser)
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
        return;
    }

    // Prevent default behavior
    e.preventDefault();
    
    // Simpan original text untuk UX
    const originalText = e.target.textContent;
    const originalHTML = e.target.innerHTML;
    
    // Tampilkan loading state
    e.target.textContent = 'Loading...';
    e.target.disabled = true;

    try {
        let clickCount = parseInt(localStorage.getItem('adsterraClickCount') || '0', 10);
        clickCount += 1;
        localStorage.setItem('adsterraClickCount', clickCount.toString());

        // Pemicu iklan pada klik ke-3, ke-9, ke-15, ke-21, dst.
        // Formula: (n - 3) % 6 === 0, di mana n adalah jumlah klik.
        if (clickCount >= 3 && (clickCount - 3) % 6 === 0) {
            // Membuka tautan iklan di tab baru
            const adIndex = Math.floor((clickCount - 3) / 6) % ADSTERRA_DIRECT_LINKS.length;
            const adLink = ADSTERRA_DIRECT_LINKS[adIndex];
            
            // Buka iklan di tab baru
            const adWindow = window.open(adLink, '_blank');
            
            // Set timeout untuk membuka target URL setelah iklan
            setTimeout(() => {
                // Buka target URL di tab/window yang sama
                window.open(targetUrl, '_self');
                
                // Restore button state
                e.target.innerHTML = originalHTML;
                e.target.disabled = false;
            }, 1000);
        } else {
            // Jika tidak trigger iklan, langsung buka target URL
            window.open(targetUrl, '_blank');
            
            // Restore button state setelah delay kecil
            setTimeout(() => {
                e.target.innerHTML = originalHTML;
                e.target.disabled = false;
            }, 500);
        }
    } catch (error) {
        console.error('Error in Adsterra click handler:', error);
        
        // Fallback: langsung buka target URL jika ada error
        window.open(targetUrl, '_blank');
        
        // Restore button state
        e.target.innerHTML = originalHTML;
        e.target.disabled = false;
    }
};

/**
 * Fungsi untuk reset counter klik (opsional, untuk testing)
 */
export const resetAdsterraClickCount = () => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try {
            localStorage.setItem('adsterraClickCount', '0');
        } catch (error) {
            console.error('Error resetting click count:', error);
        }
    }
};

/**
 * Fungsi untuk mendapatkan jumlah klik saat ini
 */
export const getCurrentClickCount = () => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try {
            return parseInt(localStorage.getItem('adsterraClickCount') || '0', 10);
        } catch (error) {
            console.error('Error getting click count:', error);
            return 0;
        }
    }
    return 0;
};