// script.js - CMS Multi-Page Connector & 3D CAFE State Management

const ADMIN_WA_NUMBER = "6281278327756"; // Nomor WhatsApp Riil 3D Cafe
const OBFUSCATED_USER = "admin";
const OBFUSCATED_PASS_HASH = "MTIz"; // Base64 hash untuk password: '123'

// 1. DEFAULT APP CONFIG (Editable Hero Banner & About Us)
const defaultConfig = {
    name1: "3D CAFE",
    name2: "& Space",
    tagline: "4.9 ★ (110 ULASAN) • PORIS INDAH",
    hours: "Buka • Tutup pukul 23.30 WIB",
    about: "3D CAFE hadir di Poris Indah sebagai ruang temu yang menggabungkan konsep arsitektur modern industrial yang kokoh dengan racikan kopi artisan kelas dunia. Bukan sekadar tempat singgah, melainkan wadah produktivitas untuk merajut karya.",
    address: "Jl. Poris Indah Blk. E No.860B, RT.002/RW.004, Cipondoh Indah, Kec. Cipondoh, Kota Tangerang, Banten 15148",
    hero_bg_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    about_img_url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80"
};

// 2. DEFAULT 55 REAL MENU DATABASE FROM IMAGE UPLOADS
const defaultMenuData = [
    // ESSENTIAL COFFEE
    { id: 'M-1', name: 'Hot Americano', price: 21000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-2', name: 'Ice Americano', price: 22000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-3', name: 'Hot Cappuccino', price: 21000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-4', name: 'Ice Cappuccino', price: 22000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-5', name: 'Hot Flavour Latte (Caramel, Vanilla, Hazelnut)', price: 22000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-6', name: 'Ice Flavour Latte (Caramel, Vanilla, Hazelnut)', price: 23000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-7', name: 'Hot Cafe Latte', price: 21000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-8', name: 'Ice Cafe Latte', price: 22000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-9', name: 'Hot Mocha Latte', price: 22000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-10', name: 'Ice Mocha Latte', price: 23000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-11', name: 'Espresso', price: 10000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-12', name: 'Irish Latte', price: 23000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    { id: 'M-13', name: 'Triple Peach Americano', price: 24000, discountPrice: null, category: 'Essential Coffee', isPromo: false, isFeatured: false },
    
    // SIGNATURE DRINKS (Highlighted)
    { id: 'M-14', name: 'Es Kopi Susu', price: 23000, discountPrice: null, category: 'Signature Drink', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80' },
    { id: 'M-15', name: 'Pandan Latte', price: 23000, discountPrice: null, category: 'Signature Drink', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1594911774802-8822a707c93e?w=500&q=80' },
    { id: 'M-16', name: 'Ice Tiramisu Latte', price: 23000, discountPrice: null, category: 'Signature Drink', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80' },
    { id: 'M-17', name: 'Butterscotch Caramel', price: 24000, discountPrice: 20000, category: 'Signature Drink', isPromo: true, isFeatured: true, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80' },
    { id: 'M-18', name: 'Yakult Series', price: 23000, discountPrice: null, category: 'Signature Drink', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=500&q=80' },
    { id: 'M-19', name: 'Lychee Punch', price: 23000, discountPrice: null, category: 'Signature Drink', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80' },
    
    // TEA BASED
    { id: 'M-20', name: 'Lychee Tea', price: 20000, discountPrice: null, category: 'Tea Based', isPromo: false, isFeatured: false },
    { id: 'M-21', name: 'Strawberry Tea', price: 20000, discountPrice: null, category: 'Tea Based', isPromo: false, isFeatured: false },
    { id: 'M-22', name: 'Lemon Tea', price: 20000, discountPrice: null, category: 'Tea Based', isPromo: false, isFeatured: false },
    { id: 'M-23', name: 'Peach Tea', price: 20000, discountPrice: null, category: 'Tea Based', isPromo: false, isFeatured: false },

    // OTHER BEVERAGE
    { id: 'M-24', name: 'Chocolate', price: 23000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-25', name: 'Choco Hazelnut', price: 23000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-26', name: 'Ice Taro Latte', price: 23000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-27', name: 'Matcha Latte', price: 23000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-28', name: 'Strawberry Mojito', price: 23000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-29', name: 'Matcha Blend', price: 24000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-30', name: 'Choco Beng Blend', price: 24000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-31', name: 'Cookies N Cream', price: 24000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-32', name: 'Love Potion', price: 23000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-33', name: 'Pop Lemonade', price: 23000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },
    { id: 'M-34', name: 'Mineral Water', price: 7000, discountPrice: null, category: 'Other Beverage', isPromo: false, isFeatured: false },

    // ARTISAN TEA
    { id: 'M-35', name: 'Jasmine Artisan Tea', price: 19000, discountPrice: null, category: 'Artisan Tea', isPromo: false, isFeatured: false },
    { id: 'M-36', name: 'Earl Grey Artisan Tea', price: 19000, discountPrice: null, category: 'Artisan Tea', isPromo: false, isFeatured: false },
    { id: 'M-37', name: 'Pure Peppermint Tea', price: 19000, discountPrice: null, category: 'Artisan Tea', isPromo: false, isFeatured: false },
    { id: 'M-38', name: 'Chamomile Tea', price: 19000, discountPrice: null, category: 'Artisan Tea', isPromo: false, isFeatured: false },

    // SNACKS (Cemilan)
    { id: 'M-39', name: '3D Platters', price: 26000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: true, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80' },
    { id: 'M-40', name: 'French Fries', price: 16000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80' },
    { id: 'M-41', name: 'Chicken Skin', price: 19000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80' },
    { id: 'M-42', name: 'Chicken Pop', price: 21000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80' },
    { id: 'M-43', name: 'Roti Lipat', price: 21000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false },
    { id: 'M-44', name: 'Roti Bakar', price: 19000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false },
    { id: 'M-45', name: 'Cireng Bumbu Rujak', price: 16000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false },
    { id: 'M-46', name: 'Piscok 3D', price: 18000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false },
    { id: 'M-47', name: 'Singkong Goreng', price: 15000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false },
    { id: 'M-48', name: '3D Donut', price: 18000, discountPrice: null, category: 'Snacks', isPromo: false, isFeatured: false },

    // MAIN COURSE (Makanan)
    { id: 'M-49', name: 'Rice Bowl (Chicken Pop, Blackpepper/Teriyaki)', price: 26000, discountPrice: null, category: 'Main Course', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },
    { id: 'M-50', name: 'Spaghetti Aglio Olio', price: 29000, discountPrice: null, category: 'Main Course', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1589227365533-cee630bd59bd?w=500&q=80' },
    { id: 'M-51', name: 'Spaghetti Bolognese', price: 29000, discountPrice: null, category: 'Main Course', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1598866539377-f5198f593850?w=500&q=80' },
    { id: 'M-52', name: 'Spaghetti Carbonara', price: 29000, discountPrice: null, category: 'Main Course', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80' },
    { id: 'M-53', name: 'Mie Goreng 3D (Spesial Ceplok)', price: 28000, discountPrice: null, category: 'Main Course', isPromo: false, isFeatured: true, img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=500&q=80' },
    { id: 'M-54', name: 'Nasi Goreng Spesial', price: 28000, discountPrice: null, category: 'Main Course', isPromo: false, isFeatured: false, img: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&q=80' },
    { id: 'M-55', name: 'Bento 3D Roll', price: 25000, discountPrice: null, category: 'Main Course', isPromo: false, isFeatured: false }
];

// 3. GALLERY IMAGES (Asymmetric Layout Ready)
const defaultGalleryData = [
    { id: 'G-1', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', alt: 'Suasana Barista Bar 3D CAFE', isFeatured: true },
    { id: 'G-2', url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', alt: 'Area Santai Tangga Mezzanine', isFeatured: true },
    { id: 'G-3', url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80', alt: 'Sajian Kopi Latte Buatan Barista', isFeatured: true },
    { id: 'G-4', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', alt: 'Area Meja Panjang WFC', isFeatured: false },
    { id: 'G-5', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80', alt: 'Desain Interior Semen Ekspos Modern', isFeatured: false }
];

// Instansiasi State atau memuat dari Namespace Unik `3d_` (Busting Cache MDM Lama)
let appConfig = JSON.parse(localStorage.getItem('3d_config')) || defaultConfig;
let menuState = JSON.parse(localStorage.getItem('3d_menu')) || defaultMenuData;
let galleryState = JSON.parse(localStorage.getItem('3d_gallery')) || defaultGalleryData;

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
const updateStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ================= GLOBAL SCROLL REVEAL ENGINE =================
function applyScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal-el').forEach(el => observer.observe(el));
}

// ================= UNIVERSAL BOOTSTRAPPER (DIJALANKAN DI SETIAP HALAMAN) =================
function renderAllUI() {
    // 1. Sinkronisasi Gambar Latar Belakang & Profil Dinamis
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.style.backgroundImage = `url('${appConfig.hero_bg_url}')`;
    }
    const aboutImg = document.getElementById('about-img');
    if (aboutImg) {
        aboutImg.src = appConfig.about_img_url;
    }

    // 2. Inisialisasi Teks
    Object.keys(appConfig).forEach(key => {
        const viewDOM = document.getElementById(`live-${key}`);
        if(viewDOM) viewDOM.innerText = appConfig[key];
        const editDOM = document.getElementById(`liveEdit-${key}`);
        if(editDOM) editDOM.value = appConfig[key];
    });

    // 3. Kondisional Render sesuai ID Elemen Halaman yang ada
    if (document.getElementById('home-menu-container')) renderHomeMenu();
    if (document.getElementById('home-gallery-container')) renderHomeGallery();
    if (document.getElementById('full-menu-grid')) renderFullMenuPage();
    if (document.getElementById('full-gallery-grid')) renderFullGalleryPage();
    if (document.getElementById('admin-menu-tbody')) renderAdminMenu();
    if (document.getElementById('admin-gallery-tbody')) renderAdminGallery();

    setTimeout(() => applyScrollReveal(), 100);
}

// ================= TAMPILAN HOMEPAGE: 4 MENU BEST SELLER (GRID 2x2 MOBILE) =================
function renderHomeMenu() {
    const container = document.getElementById('home-menu-container');
    if (!container) return;

    // Filter menu yang ditandai isFeatured = true (maksimal 4 item)
    const featuredItems = menuState.filter(m => m.isFeatured === true).slice(0, 4);

    if (featuredItems.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-6">Belum ada menu Best Seller yang dipilih.</p>`;
        return;
    }

    container.innerHTML = featuredItems.map(item => {
        const hasPromo = item.discountPrice && item.discountPrice > 0;
        const badge = hasPromo ? `<div class="absolute top-2 right-2 bg-primary text-dark text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">Promo</div>` : '';
        const priceDisplay = hasPromo
            ? `<span class="text-accent font-bold text-sm md:text-lg">${formatRupiah(item.discountPrice)}</span><span class="text-gray-500 text-xs line-through">${formatRupiah(item.price)}</span>`
            : `<span class="text-accent font-bold text-sm md:text-lg">${formatRupiah(item.price)}</span>`;

        return `
        <article class="reveal-el bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative hover-card-effect p-3 md:p-4 flex flex-col justify-between">
            ${badge}
            <figure class="overflow-hidden rounded-xl h-32 md:h-48 mb-3">
                <img src="${item.img || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80'}" class="w-full h-full object-cover" loading="lazy" alt="${item.name}">
            </figure>
            <div>
                <span class="text-[9px] uppercase tracking-wider text-primary font-bold block mb-1">${item.category}</span>
                <h4 class="font-bold text-sm md:text-base text-white font-serif line-clamp-1 mb-2">${item.name}</h4>
                <div class="flex items-center gap-2 flex-wrap">${priceDisplay}</div>
            </div>
        </article>
        `;
    }).join('');
}

// ================= TAMPILAN HOMEPAGE: GALLERY HIGHLIGHTS =================
function renderHomeGallery() {
    const container = document.getElementById('home-gallery-container');
    if (!container) return;

    const featuredGallery = galleryState.filter(g => g.isFeatured === true).slice(0, 3);

    container.innerHTML = featuredGallery.map((img, idx) => {
        // Layout asimetris dinamis pada beranda
        let spanStyle = idx === 0 ? "col-span-2 row-span-2 h-56 md:h-96" : "col-span-1 h-28 md:h-44";
        return `
        <div class="group relative overflow-hidden rounded-2xl ${spanStyle} reveal-el cursor-pointer border border-white/10 shadow-lg" onclick="location.href='galeri.html'">
            <img src="${img.url}" alt="${img.alt}" class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" loading="lazy">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                <span class="text-white text-xs md:text-sm font-serif border border-white/20 px-3 py-1.5 rounded-full">${img.alt}</span>
            </div>
        </div>
        `;
    }).join('');
}

// ================= TAMPILAN BUKU MENU LENGKAP (GRABFOOD ROW STYLE DI MOBILE) =================
function renderFullMenuPage() {
    const container = document.getElementById('full-menu-grid');
    if (!container) return;

    renderFilteredMenuGrid(menuState);
}

function renderFilteredMenuGrid(list) {
    const container = document.getElementById('full-menu-grid');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<div class="col-span-full py-20 text-center"><p class="text-xl font-serif text-primary/50">Menu tidak ditemukan.</p></div>`;
        return;
    }

    container.innerHTML = list.map(item => {
        const hasPromo = item.discountPrice && item.discountPrice > 0;
        const badge = hasPromo ? `<div class="absolute top-2 right-2 bg-primary text-dark text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">Promo</div>` : '';
        const priceDisplay = hasPromo
            ? `<span class="text-accent font-bold text-base md:text-xl">${formatRupiah(item.discountPrice)}</span><span class="text-gray-500 text-xs md:text-sm line-through">${formatRupiah(item.price)}</span>`
            : `<span class="text-accent font-bold text-base md:text-xl">${formatRupiah(item.price)}</span>`;

        // GRABFOOD CARD LAYOUT: Horizontal di Mobile, Vertikal di Desktop
        return `
        <article class="reveal-el flex md:flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover-card-effect p-3 md:p-0 relative">
            ${badge}
            <figure class="w-20 h-20 md:w-full md:h-56 shrink-0 order-2 md:order-1 ml-3 md:ml-0 overflow-hidden rounded-xl md:rounded-none">
                <img src="${item.img || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80'}" class="w-full h-full object-cover" loading="lazy" alt="${item.name}">
            </figure>
            <div class="flex-1 order-1 md:order-2 flex flex-col justify-between md:p-5">
                <div>
                    <span class="text-[9px] uppercase tracking-wider text-primary font-bold block mb-1">${item.category}</span>
                    <h4 class="font-bold text-sm md:text-xl text-white font-serif line-clamp-2 leading-snug mb-2">${item.name}</h4>
                </div>
                <div class="flex items-center gap-2 mt-2 flex-wrap">${priceDisplay}</div>
            </div>
        </article>
        `;
    }).join('');

    setTimeout(() => applyScrollReveal(), 50);
}

// Fitur Filter Halaman Menu
function filterMenuPage(category, btn) {
    document.querySelectorAll('.menu-filter-btn').forEach(b => {
        b.className = "menu-filter-btn px-6 py-2.5 glass-panel border border-white/10 text-secondary rounded-full font-medium whitespace-nowrap hover:bg-white/10 transition-colors";
    });
    btn.className = "menu-filter-btn px-6 py-2.5 bg-primary text-dark rounded-full font-bold whitespace-nowrap transition-colors shadow-md";

    const filtered = category === 'Semua' ? menuState : menuState.filter(item => item.category === category);
    renderFilteredMenuGrid(filtered);
}

// Fitur Pencarian Debounced (300ms) pada Menu
let searchTimeout;
const searchInput = document.getElementById('menu-search');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = menuState.filter(item => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
            renderFilteredMenuGrid(filtered);
        }, 300);
    });
}

// ================= TAMPILAN GALERI LENGKAP PINTEREST MASONRY =================
function renderFullGalleryPage() {
    const container = document.getElementById('full-gallery-grid');
    if (!container) return;

    if (galleryState.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Galeri foto masih kosong.</p>`;
        return;
    }

    container.innerHTML = galleryState.map((img, idx) => `
    <div class="masonry-item rounded-2xl overflow-hidden border border-white/10 shadow-lg reveal-el relative group cursor-pointer" onclick="openLightbox(${idx})">
        <img src="${img.url}" class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" loading="lazy" alt="${img.alt}">
        <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p class="text-white font-medium font-serif text-sm">${img.alt}</p>
        </div>
    </div>
    `).join('');
}

// ================= LIGHTBOX MECHANISM FOR GALLERY =================
let lightboxIndex = 0;

function openLightbox(idx) {
    if (galleryState.length === 0) return;
    lightboxIndex = idx;
    syncLightboxDOM();
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'fade-in-element');
    modal.classList.remove('fade-out-element');
}

function syncLightboxDOM() {
    const data = galleryState[lightboxIndex];
    const imgDOM = document.getElementById('lightbox-img');
    const capDOM = document.getElementById('lightbox-caption');
    if (imgDOM) {
        imgDOM.style.opacity = 0;
        setTimeout(() => {
            imgDOM.src = data.url;
            capDOM.innerText = data.alt;
            imgDOM.style.opacity = 1;
        }, 120);
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('fade-in-element');
    modal.classList.add('fade-out-element');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex', 'fade-out-element'); }, 300);
}
function nextLightbox() { lightboxIndex = (lightboxIndex + 1) % galleryState.length; syncLightboxDOM(); }
function prevLightbox() { lightboxIndex = (lightboxIndex - 1 + galleryState.length) % galleryState.length; syncLightboxDOM(); }

// ================= FORM RESERVASI DENGAN WARNING SABTU =================
const formReservasi = document.getElementById('form-reservasi');
if (formReservasi) {
    // Deteksi hari untuk memunculkan warning sabtu
    const dateInput = document.getElementById('res-tanggal');
    if (dateInput) {
        dateInput.addEventListener('change', function(e) {
            const day = new Date(e.target.value).getDay();
            const warningBox = document.getElementById('sat-warning');
            if (day === 6) { // 6 = Sabtu
                warningBox.classList.remove('hidden');
            } else {
                warningBox.classList.add('hidden');
            }
        });
    }

    formReservasi.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('btn-submit-res');
        const defaultTxt = btn.innerHTML;
        btn.innerHTML = '<span class="animate-pulse">Mengirim permintaan...</span>'; btn.disabled = true;

        const name = document.getElementById('res-nama').value;
        const qty = document.getElementById('res-jumlah').value;
        const date = document.getElementById('res-tanggal').value;
        const time = document.getElementById('res-waktu').value;
        const note = document.getElementById('res-catatan').value;

        let message = `Halo Admin 3D CAFE, saya ingin melakukan reservasi meja:%0A%0A*Nama:* ${name}%0A*Jumlah:* ${qty}%0A*Tgl/Jam:* ${date} ${time}%0A`;
        if(note) message += `*Catatan:* ${note}%0A`;

        await new Promise(r => setTimeout(r, 600)); 
        showToast('Membuka WhatsApp...', 'success'); 
        window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${message}`, '_blank');
        btn.innerHTML = defaultTxt; btn.disabled = false; this.reset();
    });
}

// Toast Notifikasi Mandiri
function showToast(msg, type = 'success') {
    const box = document.getElementById('toast-container');
    if (!box) return;
    const toast = document.createElement('div');
    const color = type === 'success' ? 'bg-[#111827] text-[#22D3EE] border-[#06B6D4]' : 'bg-red-950/80 text-red-400 border-red-500/30';
    toast.className = `flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${color} pointer-events-auto transition-all duration-300`;
    toast.innerHTML = `<div class="font-bold text-sm tracking-wide font-serif">${msg}</div>`;
    box.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}


// ================= ADMIN PANEL AUTHENTICATION =================
function handleLoginSubmit(e) {
    e.preventDefault();
    const b = document.getElementById('btn-login-admin');
    const u = document.getElementById('admin-username').value;
    const p = document.getElementById('admin-password').value;
    const originalText = b.innerHTML; b.innerHTML = 'Memverifikasi...';

    setTimeout(() => {
        if (u === OBFUSCATED_USER && btoa(p) === OBFUSCATED_PASS_HASH) {
            localStorage.setItem('3d_isAdminLoggedIn', 'true');
            showToast('Login Berhasil!', 'success');
            document.getElementById('form-admin-login').reset();
            document.getElementById('adminLoginModal').classList.add('hidden');
            document.getElementById('adminDashboardModal').classList.remove('hidden');
            document.getElementById('adminDashboardModal').classList.add('flex');
            renderAllUI();
        } else {
            showToast('Kredensial Admin Salah!', 'error');
            b.innerHTML = originalText;
        }
    }, 600);
}

function handleAdminLogout() {
    localStorage.removeItem('3d_isAdminLoggedIn');
    document.getElementById('adminDashboardModal').classList.remove('flex');
    document.getElementById('adminDashboardModal').classList.add('hidden');
    document.getElementById('adminLoginModal').classList.remove('hidden');
    showToast('Sesi diakhiri.', 'success');
}

// Membuka Sesi Login Otomatis jika sudah login
if (document.getElementById('adminLoginModal')) {
    if (localStorage.getItem('3d_isAdminLoggedIn') === 'true') {
        document.getElementById('adminLoginModal').classList.add('hidden');
        document.getElementById('adminDashboardModal').classList.remove('hidden');
        document.getElementById('adminDashboardModal').classList.add('flex');
    }
}

// Navigasi Tab CMS Admin
function switchAdminTab(target) {
    document.querySelectorAll('.admin-tab').forEach(t => { t.classList.remove('bg-white/10', 'text-white'); t.classList.add('text-gray-400'); });
    const tab = document.getElementById(`tab-${target}`);
    if(tab) { tab.classList.remove('text-gray-400'); tab.classList.add('bg-white/10', 'text-white'); }
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById(`panel-${target}`);
    if(panel) { panel.classList.remove('hidden'); panel.classList.add('fade-in-element', 'block'); }
}


// ================= MANAJEMEN CMS LIVE EDIT (TAMPILAN UTAMA) =================
function handleLiveEdit(configKey, txtValue) {
    appConfig[configKey] = txtValue;
    updateStorage('3d_config', appConfig);
}


// ================= MANAJEMEN CMS: KELOLA MENU =================
function renderAdminMenu() {
    const tb = document.getElementById('admin-menu-tbody'); if(!tb) return;
    if(menuState.length === 0) { tb.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-500">Buku menu kosong.</td></tr>`; return; }
    
    tb.innerHTML = menuState.map(m => `
        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors group">
            <td class="p-4 text-center">
                <button onclick="toggleFeaturedMenu('${m.id}')" class="text-2xl transition-transform hover:scale-125 focus:outline-none ${m.isFeatured ? 'text-primary drop-shadow-md' : 'text-gray-600 grayscale opacity-40'}">
                    ★
                </button>
            </td>
            <td class="p-4 flex items-center gap-4">
                <img src="${m.img || 'https://via.placeholder.com/100'}" class="w-12 h-12 rounded-xl object-cover border border-white/10">
                <span class="font-bold text-white font-serif">${m.name}</span>
            </td>
            <td class="p-4"><span class="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-xs font-medium">${m.category}</span></td>
            <td class="p-4 text-gray-300">${formatRupiah(m.price)}</td>
            <td class="p-4 font-bold ${m.discountPrice ? 'text-accent' : 'text-gray-500'}">${m.discountPrice ? formatRupiah(m.discountPrice) : '-'}</td>
            <td class="p-4 text-right">
                <button onclick="editMenu('${m.id}')" class="text-primary hover:bg-white/5 px-3 py-1.5 rounded-lg text-sm font-medium">Edit</button>
                <button onclick="deleteMenu('${m.id}')" class="text-red-400 hover:bg-white/5 px-3 py-1.5 rounded-lg text-sm font-medium">Hapus</button>
            </td>
        </tr>
    `).join('');

    document.getElementById('stat-menu').innerText = menuState.length;
}

function toggleFeaturedMenu(id) {
    const idx = menuState.findIndex(m => m.id === id);
    if(idx === -1) return;
    
    const isCurrentlyFeatured = menuState[idx].isFeatured;
    const totalFeatured = menuState.filter(m => m.isFeatured === true).length;
    
    if(!isCurrentlyFeatured && totalFeatured >= 4) {
        showToast('Maksimal 4 Menu di Halaman Utama (Best Seller)!', 'error');
        return;
    }
    
    menuState[idx].isFeatured = !isCurrentlyFeatured;
    updateStorage('3d_menu', menuState);
    renderAdminMenu();
    showToast(menuState[idx].isFeatured ? 'Menu dipasang di Halaman Utama!' : 'Menu dicopot dari Halaman Utama!', 'success');
}

function openFormMenu() {
    document.getElementById('form-crud-menu').reset(); document.getElementById('crud-menu-id').value = '';
    document.getElementById('crud-menu-title').innerText = 'Tambah Menu Baru';
    const modal = document.getElementById('crudMenuModal'); modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}

function editMenu(id) {
    const m = menuState.find(item => item.id === id); if(!m) return;
    document.getElementById('crud-menu-id').value = m.id;
    document.getElementById('crud-menu-name').value = m.name;
    document.getElementById('crud-menu-category').value = m.category;
    document.getElementById('crud-menu-price').value = m.price;
    document.getElementById('crud-menu-discount').value = m.discountPrice || '';
    document.getElementById('crud-menu-img').value = m.img || '';
    document.getElementById('crud-menu-title').innerText = 'Edit Menu';
    const modal = document.getElementById('crudMenuModal'); modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}

function handleSaveMenu(e) {
    e.preventDefault();
    const id = document.getElementById('crud-menu-id').value;
    const dp = document.getElementById('crud-menu-discount').value;
    const discountPrice = dp && parseInt(dp) > 0 ? parseInt(dp) : null;
    
    let isFeaturedStatus = false;
    if(id) {
        const existingItem = menuState.find(item => item.id === id);
        if(existingItem) isFeaturedStatus = existingItem.isFeatured || false;
    }
    
    const data = {
        id: id || 'M-' + Date.now(),
        name: document.getElementById('crud-menu-name').value,
        category: document.getElementById('crud-menu-category').value,
        price: parseInt(document.getElementById('crud-menu-price').value),
        discountPrice: discountPrice,
        img: document.getElementById('crud-menu-img').value,
        isPromo: discountPrice ? true : false,
        isFeatured: isFeaturedStatus
    };
    
    if (id) {
        const idx = menuState.findIndex(item => item.id === id); if(idx > -1) menuState[idx] = data;
        showToast('Menu diperbarui!', 'success');
    } else {
        menuState.unshift(data); showToast('Menu ditambahkan!', 'success');
    }
    updateStorage('3d_menu', menuState); renderAdminMenu(); closeFormModal('crudMenuModal');
}

function deleteMenu(id) {
    if(!confirm('Hapus menu ini?')) return;
    menuState = menuState.filter(m => m.id !== id); updateStorage('3d_menu', menuState); renderAdminMenu();
}


// ================= MANAJEMEN CMS: KELOLA GALERI =================
function renderAdminGallery() {
    const tb = document.getElementById('admin-gallery-tbody'); if(!tb) return;
    if(galleryState.length === 0) { tb.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-gray-500">Galeri foto kosong.</td></tr>`; return; }
    
    tb.innerHTML = galleryState.map(g => `
        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td class="p-4 text-center">
                <button onclick="toggleFeaturedGallery('${g.id}')" class="text-2xl transition-transform hover:scale-125 focus:outline-none ${g.isFeatured ? 'text-primary drop-shadow-md' : 'text-gray-600 grayscale opacity-40'}">
                    ★
                </button>
            </td>
            <td class="p-4"><img src="${g.url}" class="w-20 h-14 object-cover rounded-md border border-white/10"></td>
            <td class="p-4 text-gray-300"><span class="font-bold text-white block mb-1">${g.alt}</span><span class="text-xs text-primary block truncate max-w-xs">${g.url}</span></td>
            <td class="p-4 text-right"><button onclick="deleteGallery('${g.id}')" class="text-red-400 hover:bg-white/5 px-3 py-1.5 rounded-lg text-sm font-medium">Hapus</button></td>
        </tr>
    `).join('');

    document.getElementById('stat-gallery').innerText = galleryState.length;
}

function toggleFeaturedGallery(id) {
    const idx = galleryState.findIndex(g => g.id === id);
    if(idx === -1) return;
    
    const isCurrentlyFeatured = galleryState[idx].isFeatured;
    const totalFeatured = galleryState.filter(g => g.isFeatured === true).length;
    
    if(!isCurrentlyFeatured && totalFeatured >= 3) {
        showToast('Maksimal 3 Highlight Galeri di Halaman Utama!', 'error');
        return;
    }
    
    galleryState[idx].isFeatured = !isCurrentlyFeatured;
    updateStorage('3d_gallery', galleryState);
    renderAdminGallery();
    showToast(galleryState[idx].isFeatured ? 'Foto dipasang di Halaman Utama!' : 'Foto dicopot dari Halaman Utama!', 'success');
}

function openFormGallery() {
    document.getElementById('form-crud-gallery').reset();
    const modal = document.getElementById('crudGalleryModal'); modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}

function handleSaveGallery(e) {
    e.preventDefault();
    galleryState.unshift({ 
        id: 'G-' + Date.now(), 
        url: document.getElementById('crud-gal-url').value, 
        alt: document.getElementById('crud-gal-alt').value,
        isFeatured: false
    });
    updateStorage('3d_gallery', galleryState); renderAdminGallery(); closeFormModal('crudGalleryModal'); showToast('Foto ditambahkan!', 'success');
}

function deleteGallery(id) {
    if(!confirm('Hapus foto ini dari galeri?')) return;
    galleryState = galleryState.filter(g => g.id !== id); updateStorage('3d_gallery', galleryState); renderAdminGallery();
}

function closeFormModal(id) {
    const modal = document.getElementById(id); modal.classList.remove('fade-in-element'); modal.classList.add('fade-out-element');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex', 'fade-out-element'); }, 300);
}

// Bootsraper Utama
document.addEventListener('DOMContentLoaded', renderAllUI);
