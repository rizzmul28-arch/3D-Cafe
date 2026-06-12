// script.js - FIX MAIN THREAD CRASH, BASE64 VALIDATION, & FEATURED ITEMS LOGIC

// ================= FIX 1: PERBAIKAN LOGIKA LOGIN ADMIN (3D CAFE) =================
const ADMIN_WA_NUMBER = "6281278327756"; // WA Aktif 3D Cafe Poris Indah
const OBFUSCATED_USER = "admin";
// Base64 untuk '123' -> 'MTIz'
const OBFUSCATED_PASS_HASH = "MTIz"; 

// ================= 2. STATE MANAGEMENT & MOCK DATABASE (WITH isFeatured PROPERTY) =================
const defaultConfig = {
    name1: "3D CAFE",
    name2: "& Space",
    tagline: "4.9 ★ (110 Ulasan) • Poris Indah",
    hours: "Buka • Tutup pukul 23.30 WIB",
    about: "Menyajikan harmoni sempurna antara ruang industrial minimalis dan racikan kopi modern di Cipondoh. Dirancang dengan presisi berestetika semen ekspos untuk kenyamanan bekerja (WFC), kolaborasi kreatif, maupun momen santai terbaik Anda.",
    address: "Jl. Poris Indah Blk. E No.860B, RT.002/RW.004, Cipondoh Indah, Kec. Cipondoh, Tangerang, Banten 15148"
};

// Penambahan Default `isFeatured: true` untuk batas 3 data.
const defaultMenuData = [
    { id: 'M-1', name: 'Signature Butterscotch Caramel', price: 35000, discountPrice: 28000, category: 'Kopi', isPromo: true, isFeatured: true, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80' },
    { id: 'M-2', name: 'Nasi Goreng Special 3D', price: 38000, discountPrice: null, category: 'Makanan', isPromo: false, isFeatured: true, img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=500&q=80' },
    { id: 'M-3', name: 'Premium Truffle Fries', price: 27000, discountPrice: null, category: 'Cemilan', isPromo: false, isFeatured: true, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80' }
];

const defaultGalleryData = [
    { id: 'G-1', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80', alt: 'Minimalist Bar & Barista Counter 3D Cafe', isFeatured: true },
    { id: 'G-2', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', alt: 'Sudut Mezzanine & Tangga Industrial', isFeatured: true },
    { id: 'G-3', url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80', alt: 'Signature Butterscotch Caramel Brew', isFeatured: true }
];

let appConfig = JSON.parse(localStorage.getItem('mdm_config')) || defaultConfig;
let menuState = JSON.parse(localStorage.getItem('mdm_menu')) || defaultMenuData;
let galleryState = JSON.parse(localStorage.getItem('mdm_gallery')) || defaultGalleryData;

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
const updateStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));


// ================= FIX 2: LOGIKA INTERSECTION OBSERVER (SCROLL REVEAL ENGINE) =================
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

// Live Update Handler dari CMS Form Admin
function initConfigUIValues() {
    Object.keys(appConfig).forEach(key => {
        const viewDOM = document.getElementById(`live-${key}`);
        if(viewDOM) viewDOM.innerText = appConfig[key];
        const editDOM = document.getElementById(`liveEdit-${key}`);
        if(editDOM) editDOM.value = appConfig[key];
    });
}

function handleLiveEdit(domId, txtValue) {
    const target = document.getElementById(domId);
    if(target) target.innerText = txtValue;
    const configKey = domId.replace('live-', '');
    appConfig[configKey] = txtValue;
    updateStorage('mdm_config', appConfig);
}


// ================= 3. CORE UI RENDERING MANAGEMENT (BERDASARKAN isFeatured) =================
function renderAllUI() {
    initConfigUIValues();
    renderPublicMenu();
    renderGallery();
    renderAdminMenu();
    renderAdminGallery();
    // Render animasi Scroll Reveal setelah DOM tercetak sepenuhnya
    setTimeout(() => applyScrollReveal(), 50);
}

function renderPublicMenu() {
    const homeBox = document.getElementById('home-menu-container');
    const fullBox = document.getElementById('full-menu-grid');
    
    // Filter HANYA data yg isFeatured: true untuk Halaman Utama (Max 3)
    const featuredHomeData = menuState.filter(m => m.isFeatured === true).slice(0, 3);
    
    const buildCardHTML = (item, isOverlayMode = false) => {
        const promoActive = item.discountPrice && item.discountPrice > 0;
        const badge = promoActive ? `<div class="absolute top-4 right-4 bg-accent text-dark text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">Promo</div>` : '';
        const price = promoActive 
            ? `<span class="text-accent font-bold text-xl">${formatRupiah(item.discountPrice)}</span><span class="text-gray-400 text-sm line-through">${formatRupiah(item.price)}</span>`
            : `<span class="text-accent font-bold text-xl">${formatRupiah(item.price)}</span>`;

        const wrapperStyles = isOverlayMode ? "bg-gray-800/20 border-white/5 backdrop-blur-md" : "bg-gray-800/40 border-white/10";
        const headingStyles = "text-white";
        const badgeStyles = "bg-gray-900 text-accent border border-accent/20";

        // Tambahan snap-center dan shrink-0 agar swipe berjalan mulus di mobile
        return `
        <article class="reveal-el ${wrapperStyles} rounded-3xl overflow-hidden border relative hover-card-effect snap-center shrink-0 w-[85%] md:w-auto">
            ${badge}
            <figure class="overflow-hidden"><img src="${item.img || 'https://via.placeholder.com/500'}" alt="${item.name}" class="w-full h-48 md:h-64 object-cover" loading="lazy"></figure>
            <div class="p-6">
                <span class="px-3 py-1 ${badgeStyles} rounded-full text-[10px] uppercase font-bold mb-3 inline-block">${item.category}</span>
                <h4 class="font-bold text-xl font-serif ${headingStyles} mb-3 line-clamp-2">${item.name}</h4>
                <div class="flex items-center gap-3">${price}</div>
            </div>
        </article>`;
    };

    if(homeBox) {
        homeBox.innerHTML = featuredHomeData.length === 0 
            ? '<p class="col-span-full text-center text-gray-400">Belum ada menu pilihan di Beranda.</p>' 
            : featuredHomeData.map(m => buildCardHTML(m, false)).join('');
    }
    
    if(fullBox && document.getElementById('fullMenuModal').classList.contains('flex')) {
        const currentActiveFilter = document.querySelector('.menu-filter-btn.bg-accent') || document.querySelector('.menu-filter-btn');
        if(currentActiveFilter) currentActiveFilter.click();
    }
    const statMenu = document.getElementById('stat-menu');
    if(statMenu) statMenu.innerText = menuState.length;
}

function renderGallery() {
    const homeBox = document.getElementById('home-gallery-container');
    const fullBox = document.getElementById('full-gallery-grid');
    
    // Filter HANYA data yg isFeatured: true untuk Halaman Utama (Max 3)
    const featuredHomeGallery = galleryState.filter(g => g.isFeatured === true).slice(0, 3);
    
    // ASYMMETRIC 3D GRID SYSTEM DENGAN PERSPEKTIF 3D (3 ITEMS)
    if(homeBox) {
        if (featuredHomeGallery.length === 0) {
            homeBox.innerHTML = '<p class="col-span-full text-center text-gray-400">Belum ada galeri pilihan di Beranda.</p>';
        } else {
            homeBox.innerHTML = featuredHomeGallery.map((img, idx) => {
                // Menentukan class layout asimetris untuk 3 item khusus
                let gridClass = "asym-item-normal";
                if(idx === 0) gridClass = "asym-item-large"; // Barista bar menonjol
                if(idx === 1) gridClass = "asym-item-tall";  // Tangga mezzanine tinggi
                
                return `
                <div class="${gridClass} group relative overflow-hidden rounded-3xl reveal-el depth-card cursor-pointer border border-white/10" onclick="openLightbox(${galleryState.findIndex(g => g.id === img.id)})">
                    <img src="${img.url}" alt="${img.alt}" class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" loading="lazy">
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                        <span class="text-white font-medium border-2 border-accent px-6 py-2 rounded-full font-serif text-lg">${img.alt}</span>
                    </div>
                </div>`;
            }).join('');
        }
    }
    
    // Render Pinterest Masonry Galeri Lengkap (Modal) dengan tinggi alami h-auto
    if(fullBox) {
        fullBox.innerHTML = galleryState.map((img, idx) => `
            <div class="masonry-item rounded-3xl overflow-hidden shadow-lg border border-white/5 reveal-el relative group cursor-pointer" onclick="openLightbox(${idx})">
                <img src="${img.url}" class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" loading="lazy" alt="${img.alt}">
                <div class="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p class="text-white font-medium font-serif text-sm">${img.alt}</p>
                </div>
            </div>
        `).join('');
    }
    const statGallery = document.getElementById('stat-gallery');
    if(statGallery) statGallery.innerText = galleryState.length;
}


// ================= 4. LIGHTBOX MECHANISM =================
let lightboxIndex = 0;

function openLightbox(idx) {
    if(galleryState.length === 0) return;
    lightboxIndex = idx;
    syncLightboxDOM();
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element'); modal.classList.remove('fade-out-element');
}

function syncLightboxDOM() {
    const data = galleryState[lightboxIndex];
    const imgDOM = document.getElementById('lightbox-img');
    const capDOM = document.getElementById('lightbox-caption');
    imgDOM.style.opacity = 0;
    setTimeout(() => {
        imgDOM.src = data.url;
        capDOM.innerText = data.alt;
        imgDOM.style.opacity = 1;
    }, 120);
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('fade-in-element'); modal.classList.add('fade-out-element');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex', 'fade-out-element'); }, 300);
}
function nextLightbox() { lightboxIndex = (lightboxIndex + 1) % galleryState.length; syncLightboxDOM(); }
function prevLightbox() { lightboxIndex = (lightboxIndex - 1 + galleryState.length) % galleryState.length; syncLightboxDOM(); }


// ================= 5. INTERACTION & MODAL LAYER CONTROLLER =================
function toggleModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    if (isHidden) {
        el.classList.remove('hidden'); el.classList.add('flex', 'fade-in-element'); el.classList.remove('fade-out-element');
        document.body.style.overflow = 'hidden'; 
        if(id === 'fullMenuModal') renderPublicMenu(); 
        if(id === 'fullGalleryModal') renderGallery();
        setTimeout(() => applyScrollReveal(), 50); 
    } else {
        el.classList.remove('fade-in-element'); el.classList.add('fade-out-element');
        setTimeout(() => { el.classList.add('hidden'); el.classList.remove('flex', 'fade-out-element'); document.body.style.overflow = 'auto'; }, 400); 
    }
}

async function filterMenu(cat, btn) {
    const grid = document.getElementById('full-menu-grid');
    document.querySelectorAll('.menu-filter-btn').forEach(b => {
        b.classList.remove('bg-accent', 'text-dark', 'shadow-md');
        b.classList.add('glass-panel', 'border', 'border-accent/30', 'text-white', 'shadow-sm');
    });
    btn.classList.remove('glass-panel', 'border', 'border-accent/30', 'text-white', 'shadow-sm');
    btn.classList.add('bg-accent', 'text-dark', 'shadow-md');

    grid.classList.add('is-loading');
    await new Promise(r => setTimeout(r, 350)); 

    let filtered = cat === 'Semua' ? menuState : menuState.filter(item => item.category === cat);
    grid.innerHTML = ''; 
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center"><p class="text-xl font-serif text-accent/50">Menu belum tersedia.</p></div>`;
    } else {
        filtered.forEach(item => {
            const hasPromo = item.discountPrice && item.discountPrice > 0;
            const badge = hasPromo ? `<div class="absolute top-2 right-2 md:top-4 md:right-4 bg-accent text-dark text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-md z-10">Promo</div>` : '';
            const pricing = hasPromo 
                ? `<span class="text-accent font-bold text-base md:text-xl">${formatRupiah(item.discountPrice)}</span><span class="text-gray-400 text-xs md:text-sm line-through">${formatRupiah(item.price)}</span>`
                : `<span class="text-accent font-bold text-base md:text-xl">${formatRupiah(item.price)}</span>`;

            // GOFOOD/GRABFOOD STYLE LAYOUT (Baris di mobile, kartu vertikal di desktop)
            grid.innerHTML += `
                <article class="reveal-el flex flex-row-reverse md:flex-col justify-between items-center md:items-stretch p-3 md:p-6 bg-gray-800/20 md:bg-gray-800/40 border border-white/5 md:border-white/10 rounded-2xl md:rounded-3xl shadow-lg relative hover-card-effect w-full">
                    ${badge}
                    <figure class="w-20 h-20 md:w-full md:h-56 flex-shrink-0 overflow-hidden rounded-xl md:rounded-2xl">
                        <img src="${item.img || 'https://via.placeholder.com/500'}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy">
                    </figure>
                    <div class="flex-1 pr-4 md:pr-0 md:pt-4 text-left flex flex-col justify-center">
                        <span class="hidden md:inline-block px-2.5 py-0.5 bg-gray-900 border border-white/10 text-[10px] text-accent uppercase font-bold rounded-lg mb-2 w-max">${item.category}</span>
                        <h4 class="font-bold text-base md:text-2xl text-white mb-1 font-serif line-clamp-1">${item.name}</h4>
                        <div class="flex items-center gap-2 mt-1 md:mt-2">${pricing}</div>
                    </div>
                </article>`;
        });
    }
    grid.classList.remove('is-loading');
    setTimeout(() => applyScrollReveal(), 50); 
}

// Menambahkan deteksi otomatis hari Sabtu pada input reservasi
document.getElementById('res-tanggal').addEventListener('input', function(e) {
    const dateVal = new Date(this.value);
    const warning = document.getElementById('busy-warning-container');
    
    // Jika hari Sabtu (getDay === 6), tampilkan peringatan jam sibuk
    if (dateVal.getDay() === 6) {
        warning.classList.remove('hidden');
    } else {
        warning.classList.add('hidden');
    }
});

document.getElementById('form-reservasi').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-res');
    const defaultTxt = btn.innerHTML;
    btn.innerHTML = '<span class="animate-pulse">Mengirim...</span>'; btn.disabled = true;

    const name = document.getElementById('res-nama').value;
    const qty = document.getElementById('res-jumlah').value;
    const date = document.getElementById('res-tanggal').value;
    const time = document.getElementById('res-waktu').value;
    const note = document.getElementById('res-catatan').value;

    let message = `Halo Admin 3D CAFE, saya ingin reservasi meja:%0A%0A*Nama:* ${name}%0A*Jumlah:* ${qty}%0A*Tgl/Jam:* ${date} ${time}%0A`;
    if(note) message += `*Catatan:* ${note}%0A`;

    await new Promise(r => setTimeout(r, 600)); 
    showToast('Membuka WhatsApp...', 'success'); 
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${message}`, '_blank');
    btn.innerHTML = defaultTxt; btn.disabled = false; this.reset();
});

function showToast(msg, type = 'success') {
    const box = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const color = type === 'success' ? 'bg-gray-800 text-accent border-accent' : 'bg-red-950 text-red-400 border-red-500';
    toast.className = `toast-enter flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-l-4 ${color} pointer-events-auto border`;
    toast.innerHTML = `<div class="font-bold text-sm tracking-wide font-serif">${msg}</div>`;
    box.appendChild(toast);
    setTimeout(() => { toast.classList.remove('toast-enter'); toast.classList.add('toast-leave'); setTimeout(() => toast.remove(), 400); }, 3000);
}


// ================= 6. ADMIN DASHBOARD AUTH & MOCK CRUD =================
function handleAdminEntry() {
    if (localStorage.getItem('mdm_isAdminLoggedIn') === 'true') {
        toggleModal('adminDashboardModal'); showToast('Sesi dipulihkan.', 'success');
    } else {
        toggleModal('adminLoginModal');
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const b = document.getElementById('btn-login-admin');
    const u = document.getElementById('admin-username').value;
    const p = document.getElementById('admin-password').value;
    const originalText = b.innerHTML; b.innerHTML = 'Memverifikasi...';

    await new Promise(r => setTimeout(r, 700));
    
    // Validasi Base64 Akurat
    if (u === OBFUSCATED_USER && btoa(p) === OBFUSCATED_PASS_HASH) {
        localStorage.setItem('mdm_isAdminLoggedIn', 'true');
        showToast('Login Berhasil!', 'success');
        document.getElementById('form-admin-login').reset();
        toggleModal('adminLoginModal');
        setTimeout(() => toggleModal('adminDashboardModal'), 450); 
    } else {
        showToast('Kredensial Salah!', 'error');
    }
    b.innerHTML = originalText;
}

function handleAdminLogout() {
    localStorage.removeItem('mdm_isAdminLoggedIn');
    toggleModal('adminDashboardModal'); showToast('Sesi diakhiri.', 'success');
}

function switchAdminTab(target) {
    document.querySelectorAll('.admin-tab').forEach(t => { t.classList.remove('bg-white/10', 'text-white'); t.classList.add('text-gray-400'); });
    const tab = document.getElementById(`tab-${target}`);
    if(tab) { tab.classList.remove('text-gray-400'); tab.classList.add('bg-white/10', 'text-white'); }
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById(`panel-${target}`);
    if(panel) { panel.classList.remove('hidden'); panel.classList.add('fade-in-element', 'block'); }
}

// --- TAHAP 5: FEATURED ITEM TOGGLE ENGINE ---
function toggleFeatured(type, id) {
    if(type === 'menu') {
        const itemIndex = menuState.findIndex(m => m.id === id);
        if(itemIndex === -1) return;
        
        const isCurrentlyFeatured = menuState[itemIndex].isFeatured;
        const totalFeatured = menuState.filter(m => m.isFeatured === true).length;
        
        // Cek Limit Maksimal 3
        if(!isCurrentlyFeatured && totalFeatured >= 3) {
            showToast('Maksimal 3 Menu di Beranda!', 'error');
            return;
        }
        
        menuState[itemIndex].isFeatured = !isCurrentlyFeatured;
        updateStorage('mdm_menu', menuState);
        renderAllUI();
        showToast(menuState[itemIndex].isFeatured ? 'Menu ditambahkan ke Beranda!' : 'Menu dihapus dari Beranda!', 'success');
        
    } else if(type === 'gallery') {
        const itemIndex = galleryState.findIndex(g => g.id === id);
        if(itemIndex === -1) return;
        
        const isCurrentlyFeatured = galleryState[itemIndex].isFeatured;
        const totalFeatured = galleryState.filter(g => g.isFeatured === true).length;
        
        // Cek Limit Maksimal 3
        if(!isCurrentlyFeatured && totalFeatured >= 3) {
            showToast('Maksimal 3 Galeri di Beranda!', 'error');
            return;
        }
        
        galleryState[itemIndex].isFeatured = !isCurrentlyFeatured;
        updateStorage('mdm_gallery', galleryState);
        renderAllUI();
        showToast(galleryState[itemIndex].isFeatured ? 'Foto ditambahkan ke Beranda!' : 'Foto dihapus dari Beranda!', 'success');
    }
}

// --- CRUD ENGINE FOR MENU (Dengan Tombol Star Highlight) ---
function renderAdminMenu() {
    const tb = document.getElementById('admin-menu-tbody'); if(!tb) return;
    if(menuState.length === 0) { tb.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-400">Data kosong.</td></tr>`; return; }
    tb.innerHTML = menuState.map(m => `
        <tr class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors group">
            <td class="p-4 text-center">
                <button onclick="toggleFeatured('menu', '${m.id}')" class="text-2xl transition-transform hover:scale-125 focus:outline-none ${m.isFeatured ? 'text-accent drop-shadow-md' : 'text-gray-500 grayscale opacity-40'}">
                    ★
                </button>
            </td>
            <td class="p-4 flex items-center gap-4">
                <img src="${m.img || 'https://via.placeholder.com/100'}" class="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform border border-white/5">
                <span class="font-bold text-white font-serif">${m.name}</span>
            </td>
            <td class="p-4"><span class="px-3 py-1 bg-gray-900 border border-white/10 text-gray-300 rounded-lg text-xs font-medium">${m.category}</span></td>
            <td class="p-4 text-gray-300">${formatRupiah(m.price)}</td>
            <td class="p-4 font-bold ${m.discountPrice ? 'text-accent' : 'text-gray-500'}">${m.discountPrice ? formatRupiah(m.discountPrice) : '-'}</td>
            <td class="p-4 text-right">
                <button onclick="editMenu('${m.id}')" class="text-accent hover:bg-accent/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium mr-1">Edit</button>
                <button onclick="deleteMenu('${m.id}')" class="text-red-400 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">Hapus</button>
            </td>
        </tr>
    `).join('');
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

async function handleSaveMenu(e) {
    e.preventDefault(); const btn = document.getElementById('btn-save-menu'); btn.innerHTML = 'Menyimpan...'; btn.disabled = true;
    await new Promise(r => setTimeout(r, 500));
    
    const id = document.getElementById('crud-menu-id').value;
    const dp = document.getElementById('crud-menu-discount').value;
    const discountPrice = dp && parseInt(dp) > 0 ? parseInt(dp) : null;
    
    // Pertahankan nilai isFeatured jika sedang edit
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
    updateStorage('mdm_menu', menuState); renderAllUI(); closeFormModal('crudMenuModal');
    btn.innerHTML = 'Simpan Data'; btn.disabled = false;
}

async function deleteMenu(id) {
    if(!confirm('Hapus menu?')) return;
    showToast('Menghapus...', 'success'); await new Promise(r => setTimeout(r, 400));
    menuState = menuState.filter(m => m.id !== id); updateStorage('mdm_menu', menuState); renderAllUI();
}

// --- CRUD ENGINE FOR GALLERY (Dengan Tombol Star Highlight) ---
function renderAdminGallery() {
    const tb = document.getElementById('admin-gallery-tbody'); if(!tb) return;
    if(galleryState.length === 0) { tb.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-gray-400">Galeri kosong.</td></tr>`; return; }
    tb.innerHTML = galleryState.map(g => `
        <tr class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
            <td class="p-4 text-center">
                <button onclick="toggleFeatured('gallery', '${g.id}')" class="text-2xl transition-transform hover:scale-125 focus:outline-none ${g.isFeatured ? 'text-accent drop-shadow-md' : 'text-gray-500 grayscale opacity-40'}">
                    ★
                </button>
            </td>
            <td class="p-4"><img src="${g.url}" class="w-20 h-14 object-cover rounded-md shadow-sm border border-white/5"></td>
            <td class="p-4 text-gray-300"><span class="font-bold text-white block mb-1">${g.alt}</span><span class="text-xs text-accent block truncate max-w-xs">${g.url}</span></td>
            <td class="p-4 text-right"><button onclick="deleteGallery('${g.id}')" class="text-red-400 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">Hapus</button></td>
        </tr>
    `).join('');
}

function openFormGallery() {
    document.getElementById('form-crud-gallery').reset();
    const modal = document.getElementById('crudGalleryModal'); modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}

async function handleSaveGallery(e) {
    e.preventDefault(); const btn = document.getElementById('btn-save-gal'); btn.innerHTML = 'Menyimpan...'; btn.disabled = true;
    await new Promise(r => setTimeout(r, 450));
    
    galleryState.unshift({ 
        id: 'G-' + Date.now(), 
        url: document.getElementById('crud-gal-url').value, 
        alt: document.getElementById('crud-gal-alt').value,
        isFeatured: false 
    });
    
    updateStorage('mdm_gallery', galleryState); renderAllUI(); closeFormModal('crudGalleryModal'); showToast('Foto ditambahkan!', 'success');
    btn.innerHTML = 'Simpan Foto'; btn.disabled = false;
}

async function deleteGallery(id) {
    if(!confirm('Hapus foto ini?')) return;
    showToast('Menghapus...', 'success'); await new Promise(r => setTimeout(r, 400));
    galleryState = galleryState.filter(g => g.id !== id); updateStorage('mdm_gallery', galleryState); renderAllUI();
}

function closeFormModal(id) {
    const modal = document.getElementById(id); modal.classList.remove('fade-in-element'); modal.classList.add('fade-out-element');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex', 'fade-out-element'); }, 300);
}

// INJEKSI FUNGSI AWAL DALAM DOMContentLoaded (Mencegah Crash)
document.addEventListener('DOMContentLoaded', renderAllUI);
