// Konfigurasi WhatsApp
const ADMIN_WA_NUMBER = "6281299998888"; 

// ================= 1. INISIALISASI DATA STATE & MOCK (localStorage) =================
// Default Config Data Cafe
const defaultConfig = {
    name1: "MDM Coffee",
    name2: "& Eatery",
    tagline: "Est. 2023 • Tangerang",
    hours: "Buka hingga 22.00 WIB",
    about: "Berawal dari kecintaan terhadap racikan kopi nusantara, MDM Coffee & Eatery hadir untuk menjadi ruang temu. Bukan sekadar tempat singgah, melainkan rumah kedua di mana setiap cerita, tawa, dan gagasan mengalir bersama hangatnya kopi yang kami seduh.",
    address: "Jl. Irigasi Sipon, RT.006/RW.004, Kenanga, Kec. Cipondoh, Kota Tangerang"
};

const defaultMenuData = [
    { id: 'M-' + Date.now(), name: 'Signature MDM Latte', price: 35000, discountPrice: 28000, category: 'Kopi', isPromo: true, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80' },
    { id: 'M-' + (Date.now()+1), name: 'Nasi Goreng Special', price: 45000, discountPrice: null, category: 'Makanan', isPromo: false, img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=500&q=80' },
    { id: 'M-' + (Date.now()+2), name: 'Truffle French Fries', price: 25000, discountPrice: null, category: 'Cemilan', isPromo: false, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80' }
];

const defaultGalleryData = [
    { id: 'G-' + Date.now(), url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', alt: 'Nuansa Cozy MDM' },
    { id: 'G-' + (Date.now()+1), url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80', alt: 'Kopi Artisan' },
    { id: 'G-' + (Date.now()+2), url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80', alt: 'Area Santai' }
];

let appConfig = JSON.parse(localStorage.getItem('mdm_config')) || defaultConfig;
let menuState = JSON.parse(localStorage.getItem('mdm_menu')) || defaultMenuData;
let galleryState = JSON.parse(localStorage.getItem('mdm_gallery')) || defaultGalleryData;

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
const saveState = (key, data) => localStorage.setItem(key, JSON.stringify(data));


// ================= 2. FUNGSI PARALLAX & INIT DOM UTAMA =================
window.addEventListener('scroll', () => {
    const bg = document.getElementById('parallax-bg');
    if(bg) {
        let scrollPosition = window.pageYOffset;
        bg.style.transform = `translateY(${scrollPosition * 0.4}px)`; // Kecepatan parallax
    }
});

function initAppConfigDOM() {
    // Terapkan Config ke Public View
    Object.keys(appConfig).forEach(key => {
        const el = document.getElementById(`live-${key}`);
        if(el) el.innerText = appConfig[key];
        
        // Isi Form di Admin jika ada
        const inputEl = document.getElementById(`liveEdit-${key}`);
        if(inputEl) inputEl.value = appConfig[key];
    });
}

function handleLiveEdit(domId, value) {
    // Live update UI HTML
    const el = document.getElementById(domId);
    if(el) el.innerText = value;
    
    // Simpan Config ke JSON & LocalStorage
    const configKey = domId.replace('live-', '');
    appConfig[configKey] = value;
    saveState('mdm_config', appConfig);
}


// ================= 3. RENDER UI PUBLIK (MENU & GALERI) =================
function renderAllUI() {
    initAppConfigDOM();
    renderPublicMenu();
    renderGallery();
    renderAdminMenu();
    renderAdminGallery();
}

function renderPublicMenu() {
    const homeContainer = document.getElementById('home-menu-container');
    const fullContainer = document.getElementById('full-menu-grid');
    const homeData = menuState.slice(0, 3); 
    
    const generateCard = (item, isOverlay = false) => {
        const hasDiscount = item.discountPrice && item.discountPrice > 0;
        const promoBadge = hasDiscount ? `<div class="absolute top-4 right-4 bg-accent text-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">Promo</div>` : '';
        const priceDisplay = hasDiscount 
            ? `<span class="text-primary font-bold text-xl">${formatRupiah(item.discountPrice)}</span><span class="text-gray-400 text-sm line-through">${formatRupiah(item.price)}</span>`
            : `<span class="text-primary font-bold text-xl">${formatRupiah(item.price)}</span>`;

        // Card di Overlay (Dark Theme) vs Card di Home (Light Theme)
        const cardBgClass = isOverlay ? "bg-white/5 border-white/10 backdrop-blur-md" : "bg-white border-gray-100";
        const textTitleClass = isOverlay ? "text-secondary" : "text-dark";
        const badgeBgClass = isOverlay ? "bg-white/10 text-gray-300" : "bg-gray-50 text-gray-500";

        return `
        <article class="fade-in-element ${cardBgClass} rounded-3xl overflow-hidden shadow-md border relative hover-card-effect">
            ${promoBadge}
            <figure class="overflow-hidden">
                <img src="${item.img || 'https://via.placeholder.com/500'}" alt="${item.name}" class="w-full h-48 md:h-64 object-cover transform transition-transform duration-700 hover:scale-110" loading="lazy">
            </figure>
            <div class="p-6 md:p-8">
                <span class="px-3 py-1 ${badgeBgClass} rounded-full text-[10px] uppercase tracking-widest font-bold mb-3 inline-block">${item.category}</span>
                <h4 class="font-bold text-xl md:text-2xl ${textTitleClass} mb-3 font-serif line-clamp-2">${item.name}</h4>
                <div class="flex items-center gap-3">${priceDisplay}</div>
            </div>
        </article>`;
    };

    if(homeContainer) homeContainer.innerHTML = homeData.length === 0 ? '<p class="col-span-full text-center">Menu kosong.</p>' : homeData.map(m => generateCard(m, false)).join('');

    if(fullContainer && document.getElementById('fullMenuModal').classList.contains('flex')) {
        const activeBtn = document.querySelector('.menu-filter-btn.bg-golden') || document.querySelector('.menu-filter-btn');
        if(activeBtn) activeBtn.click(); // Trigger auto-filter
    }

    const statMenu = document.getElementById('stat-menu');
    if(statMenu) statMenu.innerText = menuState.length;
}

function renderGallery() {
    const homeGal = document.getElementById('home-gallery-container');
    const fullGal = document.getElementById('full-gallery-grid');
    
    if(homeGal) {
        homeGal.innerHTML = galleryState.slice(0, 3).map((item, index) => {
            let extraClass = index === 0 ? "md:col-span-2 md:row-span-2 h-64 md:h-full" : "h-64";
            return `
            <div class="group relative overflow-hidden rounded-[2rem] ${extraClass} fade-in-element shadow-lg cursor-pointer" onclick="openLightbox(${index})">
                <img src="${item.url}" alt="${item.alt}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <span class="text-white font-medium border-2 border-white px-6 py-2 rounded-full font-serif text-lg tracking-wide">${item.alt}</span>
                </div>
            </div>`;
        }).join('');
    }
    
    // TAHAP EKSPANSI: Render Masonry Gallery Layout
    if(fullGal) {
        fullGal.innerHTML = galleryState.map((item, index) => `
            <div class="masonry-item rounded-3xl overflow-hidden shadow-lg fade-in-element relative group cursor-pointer" onclick="openLightbox(${index})">
                <img src="${item.url}" class="w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" alt="${item.alt}">
                <div class="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p class="text-white font-medium font-serif text-lg">${item.alt}</p>
                </div>
            </div>
        `).join('');
    }

    const statGal = document.getElementById('stat-gallery');
    if(statGal) statGal.innerText = galleryState.length;
}


// ================= 4. LIGHTBOX ENGINE (GALERI ZOOM) =================
let currentLightboxIndex = 0;

function openLightbox(index) {
    if(galleryState.length === 0) return;
    currentLightboxIndex = index;
    updateLightboxUI();
    
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'fade-in-element');
    modal.classList.remove('fade-out-element');
}

function updateLightboxUI() {
    const item = galleryState[currentLightboxIndex];
    const imgEl = document.getElementById('lightbox-img');
    const capEl = document.getElementById('lightbox-caption');
    
    // Fade effect logic
    imgEl.style.opacity = 0;
    setTimeout(() => {
        imgEl.src = item.url;
        capEl.innerText = item.alt;
        imgEl.style.opacity = 1;
    }, 150);
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('fade-in-element');
    modal.classList.add('fade-out-element');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex', 'fade-out-element');
    }, 300);
}

function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryState.length;
    updateLightboxUI();
}

function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryState.length) % galleryState.length;
    updateLightboxUI();
}


// ================= 5. ADMIN CRUD ENGINE =================
// --- CRUD MENU ---
function renderAdminMenu() {
    const tbody = document.getElementById('admin-menu-tbody');
    if(!tbody) return;
    if(menuState.length === 0) { tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-400">Data menu kosong.</td></tr>`; return; }

    tbody.innerHTML = menuState.map(item => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
            <td class="p-4 flex items-center gap-4">
                <img src="${item.img || 'https://via.placeholder.com/100'}" class="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" loading="lazy">
                <span class="font-bold text-dark font-serif">${item.name}</span>
            </td>
            <td class="p-4"><span class="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium">${item.category}</span></td>
            <td class="p-4 text-gray-600">${formatRupiah(item.price)}</td>
            <td class="p-4 font-bold ${item.discountPrice ? 'text-accent' : 'text-gray-400'}">${item.discountPrice ? formatRupiah(item.discountPrice) : '-'}</td>
            <td class="p-4 text-right">
                <button onclick="editMenu('${item.id}')" class="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium mr-1">Edit</button>
                <button onclick="deleteMenu('${item.id}')" class="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function openFormMenu() {
    document.getElementById('form-crud-menu').reset();
    document.getElementById('crud-menu-id').value = '';
    document.getElementById('crud-menu-title').innerText = 'Tambah Menu Baru';
    const modal = document.getElementById('crudMenuModal');
    modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}

function editMenu(id) {
    const item = menuState.find(m => m.id === id);
    if(!item) return;
    document.getElementById('crud-menu-id').value = item.id;
    document.getElementById('crud-menu-name').value = item.name;
    document.getElementById('crud-menu-category').value = item.category;
    document.getElementById('crud-menu-price').value = item.price;
    document.getElementById('crud-menu-discount').value = item.discountPrice || '';
    document.getElementById('crud-menu-img').value = item.img || '';
    document.getElementById('crud-menu-title').innerText = 'Edit Menu';
    const modal = document.getElementById('crudMenuModal');
    modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}

async function handleSaveMenu(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-menu');
    btn.innerHTML = 'Menyimpan...'; btn.disabled = true;

    await new Promise(r => setTimeout(r, 500)); // Delay
    const id = document.getElementById('crud-menu-id').value;
    const dpVal = document.getElementById('crud-menu-discount').value;
    const discountPrice = dpVal && parseInt(dpVal) > 0 ? parseInt(dpVal) : null;
    
    const newData = {
        id: id || 'M-' + Date.now(),
        name: document.getElementById('crud-menu-name').value,
        category: document.getElementById('crud-menu-category').value,
        price: parseInt(document.getElementById('crud-menu-price').value),
        discountPrice: discountPrice,
        img: document.getElementById('crud-menu-img').value,
        isPromo: discountPrice ? true : false
    };

    if (id) {
        const i = menuState.findIndex(m => m.id === id);
        if(i > -1) menuState[i] = newData;
        showToast('Menu diperbarui!', 'success');
    } else {
        menuState.unshift(newData);
        showToast('Menu ditambahkan!', 'success');
    }

    saveState('mdm_menu', menuState);
    renderAllUI();
    closeFormModal('crudMenuModal');
    btn.innerHTML = 'Simpan Data'; btn.disabled = false;
}

async function deleteMenu(id) {
    if(!confirm('Hapus menu ini?')) return;
    showToast('Menghapus...', 'success');
    await new Promise(r => setTimeout(r, 400));
    menuState = menuState.filter(m => m.id !== id);
    saveState('mdm_menu', menuState);
    renderAllUI();
}

// --- CRUD GALERI ---
function renderAdminGallery() {
    const tbody = document.getElementById('admin-gallery-tbody');
    if(!tbody) return;
    if(galleryState.length === 0) { tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-gray-400">Belum ada galeri.</td></tr>`; return; }

    tbody.innerHTML = galleryState.map(item => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="p-4"><img src="${item.url}" class="w-20 h-14 object-cover rounded-md shadow-sm"></td>
            <td class="p-4 text-gray-700">
                <span class="font-bold text-dark block mb-1">${item.alt}</span>
                <span class="text-xs text-blue-500 block truncate max-w-xs">${item.url}</span>
            </td>
            <td class="p-4 text-right">
                <button onclick="deleteGallery('${item.id}')" class="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function openFormGallery() {
    document.getElementById('form-crud-gallery').reset();
    const modal = document.getElementById('crudGalleryModal');
    modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}

async function handleSaveGallery(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-gal');
    btn.innerHTML = 'Menyimpan...'; btn.disabled = true;

    await new Promise(r => setTimeout(r, 400));
    
    galleryState.unshift({
        id: 'G-' + Date.now(),
        url: document.getElementById('crud-gal-url').value,
        alt: document.getElementById('crud-gal-alt').value
    });

    saveState('mdm_gallery', galleryState);
    renderAllUI();
    closeFormModal('crudGalleryModal');
    showToast('Foto ditambahkan ke Galeri!', 'success');

    btn.innerHTML = 'Simpan Foto'; btn.disabled = false;
}

async function deleteGallery(id) {
    if(!confirm('Hapus foto ini dari galeri?')) return;
    showToast('Menghapus...', 'success');
    await new Promise(r => setTimeout(r, 400));
    galleryState = galleryState.filter(g => g.id !== id);
    saveState('mdm_gallery', galleryState);
    renderAllUI();
}

// Global Form Modal Close
function closeFormModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('fade-in-element');
    modal.classList.add('fade-out-element');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex', 'fade-out-element');
    }, 300);
}


// ================= 6. SPA, UX, WA API & UTILITAS =================
function toggleModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;
    
    const isHidden = modalElement.classList.contains('hidden');
    if (isHidden) {
        modalElement.classList.remove('hidden');
        modalElement.classList.add('flex', 'fade-in-element');
        modalElement.classList.remove('fade-out-element');
        document.body.style.overflow = 'hidden'; 
        
        if(modalId === 'fullMenuModal') renderPublicMenu(); 
        if(modalId === 'fullGalleryModal') renderGallery(); 
    } else {
        modalElement.classList.remove('fade-in-element');
        modalElement.classList.add('fade-out-element');
        setTimeout(() => {
            modalElement.classList.add('hidden');
            modalElement.classList.remove('flex', 'fade-out-element');
            document.body.style.overflow = 'auto'; 
        }, 400); 
    }
}

async function filterMenu(kategori, buttonElement) {
    const gridContainer = document.getElementById('full-menu-grid');
    // Styling class sesuai Dark Brown overlay
    document.querySelectorAll('.menu-filter-btn').forEach(btn => {
        btn.classList.remove('bg-golden', 'text-dark', 'shadow-md');
        btn.classList.add('glass-panel', 'border', 'border-golden/30', 'text-secondary', 'shadow-sm');
    });
    buttonElement.classList.remove('glass-panel', 'border', 'border-golden/30', 'text-secondary', 'shadow-sm');
    buttonElement.classList.add('bg-golden', 'text-dark', 'shadow-md');

    gridContainer.classList.add('is-loading');
    await new Promise(r => setTimeout(r, 350)); 

    let filteredData = kategori === 'Semua' ? menuState : menuState.filter(item => item.category === kategori);
    gridContainer.innerHTML = ''; 
    
    if (filteredData.length === 0) {
        gridContainer.innerHTML = `<div class="col-span-full py-20 flex flex-col items-center justify-center text-center"><p class="text-xl font-serif text-golden/50">Menu belum tersedia.</p></div>`;
    } else {
        filteredData.forEach(item => {
            const hasDiscount = item.discountPrice && item.discountPrice > 0;
            const promoBadge = hasDiscount ? `<div class="absolute top-4 right-4 bg-accent text-dark text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">Promo</div>` : '';
            const priceDisplay = hasDiscount 
                ? `<span class="text-golden font-bold text-xl">${formatRupiah(item.discountPrice)}</span><span class="text-gray-400 text-sm line-through">${formatRupiah(item.price)}</span>`
                : `<span class="text-golden font-bold text-xl">${formatRupiah(item.price)}</span>`;

            gridContainer.innerHTML += `
                <article class="fade-in-element bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg relative hover-card-effect">
                    ${promoBadge}
                    <figure><img src="${item.img || 'https://via.placeholder.com/500'}" class="w-full h-56 object-cover" loading="lazy"></figure>
                    <div class="p-6">
                        <h4 class="font-bold text-2xl text-secondary mb-1 font-serif line-clamp-1">${item.name}</h4>
                        <div class="flex items-center gap-3 mt-4">${priceDisplay}</div>
                    </div>
                </article>`;
        });
    }
    gridContainer.classList.remove('is-loading');
}

document.getElementById('form-reservasi').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-res');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span class="animate-pulse">Mengirim permintaan...</span>';
    btn.disabled = true;

    const nama = document.getElementById('res-nama').value;
    const jumlah = document.getElementById('res-jumlah').value;
    const tanggal = document.getElementById('res-tanggal').value;
    const waktu = document.getElementById('res-waktu').value;
    const catatan = document.getElementById('res-catatan').value;

    let pesan = `Halo Admin MDM Coffee, saya ingin reservasi meja:%0A%0A*Nama:* ${nama}%0A*Jumlah:* ${jumlah}%0A*Tgl/Jam:* ${tanggal} ${waktu}%0A`;
    if(catatan) pesan += `*Catatan:* ${catatan}%0A`;

    await new Promise(r => setTimeout(r, 700)); 
    showToast('Membuka aplikasi WhatsApp...', 'success'); 
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${pesan}`, '_blank');
    
    btn.innerHTML = originalText; btn.disabled = false; this.reset();
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-secondary text-primary border-accent' : 'bg-red-50 text-red-700 border-red-500';
    toast.className = `toast-enter flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-l-4 ${bgColor} pointer-events-auto`;
    toast.innerHTML = `<div class="font-bold text-sm font-serif tracking-wide">${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('toast-enter'); toast.classList.add('toast-leave');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Logic Auth & Admin Tabs
function handleAdminEntry() {
    if (localStorage.getItem('mdm_isAdminLoggedIn') === 'true') {
        toggleModal('adminDashboardModal'); showToast('Sesi dipulihkan.', 'success');
    } else {
        toggleModal('adminLoginModal');
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-login-admin');
    const user = document.getElementById('admin-username').value;
    const pass = document.getElementById('admin-password').value;
    
    const oriText = btn.innerHTML;
    btn.innerHTML = 'Memverifikasi...';
    await new Promise(r => setTimeout(r, 800));

    if (user === 'admin' && pass === '123') {
        localStorage.setItem('mdm_isAdminLoggedIn', 'true');
        showToast('Login Berhasil!', 'success');
        document.getElementById('form-admin-login').reset();
        toggleModal('adminLoginModal');
        setTimeout(() => toggleModal('adminDashboardModal'), 500); 
    } else {
        showToast('Akses Ditolak!', 'error');
    }
    btn.innerHTML = oriText;
}

function handleAdminLogout() {
    localStorage.removeItem('mdm_isAdminLoggedIn');
    toggleModal('adminDashboardModal');
    showToast('Anda telah logout.', 'success');
}

function switchAdminTab(target) {
    document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.remove('bg-white/10', 'text-white');
        t.classList.add('text-gray-400');
    });
    const tab = document.getElementById(`tab-${target}`);
    if(tab) {
        tab.classList.remove('text-gray-400'); tab.classList.add('bg-white/10', 'text-white');
    }
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById(`panel-${target}`);
    if(panel) {
        panel.classList.remove('hidden'); panel.classList.add('fade-in-element', 'block');
    }
}

document.addEventListener('DOMContentLoaded', renderAllUI);