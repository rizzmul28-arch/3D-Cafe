// script.js - CMS Multi-Page Connector & Cloud Supabase State Bridge

// =========================================================================
// PENTING: TEMPELKAN KREDENSIAL API SUPABASE ANDA DI SINI UNTUK MENGAKTIFKAN CLOUD
// =========================================================================
const SUPABASE_URL = "https://eurdskcecakayvkoyleg.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_E-ra5tx4P0o0TXAWzGo81A_m3Xrn2df"; 
// =========================================================================

const ADMIN_WA_NUMBER = "6281278327756"; 
const OBFUSCATED_USER = "admin";
const OBFUSCATED_PASS_HASH = "MTIz"; 

let supabaseClient = null;
let isSupabaseActive = false;

if (SUPABASE_URL && SUPABASE_KEY) {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        isSupabaseActive = true;
    } catch (e) {
        console.warn("Inisialisasi Supabase gagal, beralih ke Fallback LocalStorage Mode.", e);
    }
}

const defaultConfig = {
    name1: "3D CAFE",
    name2: "& Space",
    tagline: "4.9 ★ (110 ULASAN) • PORIS INDAH",
    hours: "Buka • Tutup pukul 23.30 WIB",
    about: "3D CAFE hadir di Poris Indah sebagai ruang temu yang menggabungkan konsep arsitektur modern industrial yang kokoh dengan racikan kopi artisan kelas dunia.",
    address: "Jl. Poris Indah Blk. E No.860B, RT.002/RW.004, Cipondoh Indah, Kec. Cipondoh, Kota Tangerang, Banten 15148",
    hero_bg_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    about_img_url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80"
};

let appConfig = JSON.parse(localStorage.getItem('3d_config')) || defaultConfig;
let menuState = JSON.parse(localStorage.getItem('3d_menu')) || [];
let galleryState = JSON.parse(localStorage.getItem('3d_gallery')) || [];

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
const updateStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

async function syncDatabaseState() {
    if (isSupabaseActive) {
        try {
            const { data: configDb } = await supabaseClient.from('cafe_profile').select('*');
            if (configDb && configDb.length > 0) {
                let tempConfig = {};
                configDb.forEach(item => tempConfig[item.key] = item.value);
                appConfig = { ...defaultConfig, ...tempConfig };
            }
            const { data: menuDb } = await supabaseClient.from('menu').select('*').order('created_at', { ascending: false });
            if (menuDb) menuState = menuDb;

            const { data: galleryDb } = await supabaseClient.from('gallery').select('*').order('created_at', { ascending: false });
            if (galleryDb) galleryState = galleryDb;
        } catch (error) {
            console.error("Gagal sinkronisasi data dari cloud Supabase.", error);
        }
    }
}

async function uploadDirectImage(inputElement, previewElementId, hiddenInputId, configKeyToBind = null) {
    const file = inputElement.files[0];
    if (!file) return;

    const previewDOM = document.getElementById(previewElementId);
    const hiddenDOM = document.getElementById(hiddenInputId);
    const uploadTextDOM = inputElement.closest('div, label, article, fieldset').querySelector('.upload-txt, .upload-txt-hero, .upload-txt-about');
    const originalText = uploadTextDOM ? uploadTextDOM.innerText : "Pilih file gambar";

    if (uploadTextDOM) uploadTextDOM.innerText = "⏳ Sedang mengunggah...";
    showToast("Mengunggah gambar ke cloud storage...", "success");

    if (!isSupabaseActive) {
        setTimeout(() => {
            const fakeUrl = URL.createObjectURL(file);
            if (hiddenDOM) hiddenDOM.value = fakeUrl;
            if (previewDOM) { previewDOM.src = fakeUrl; previewDOM.classList.remove('hidden'); }
            if (configKeyToBind) { appConfig[configKeyToBind] = fakeUrl; updateStorage('3d_config', appConfig); }
            if (uploadTextDOM) uploadTextDOM.innerText = originalText;
            showToast("Sukses simpan gambar lokal (Fallback Mode).", "success");
            renderAllUI();
        }, 1000);
        return;
    }

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        let { error: uploadError } = await supabaseClient.storage.from('3d-cafe').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage.from('3d-cafe').getPublicUrl(filePath);

        if (hiddenDOM) hiddenDOM.value = publicUrl;
        if (previewDOM) { previewDOM.src = publicUrl; previewDOM.classList.remove('hidden'); }

        if (configKeyToBind) {
            appConfig[configKeyToBind] = publicUrl;
            await supabaseClient.from('cafe_profile').upsert({ key: configKeyToBind, value: publicUrl }, { onConflict: 'key' });
            showToast("Gambar tampilan beranda diperbarui!", "success");
        } else {
            showToast("Berkas fisik sukses ter-upload!", "success");
        }
        if (uploadTextDOM) uploadTextDOM.innerText = originalText;
        renderAllUI();
    } catch (err) {
        console.error("Upload error:", err);
        showToast("Gagal unggah foto ke cloud storage.", "error");
        if (uploadTextDOM) uploadTextDOM.innerText = "Gagal upload.";
    }
}

function applyScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal-el').forEach(el => observer.observe(el));
}

async function renderAllUI() {
    await syncDatabaseState();

    const warningBanner = document.getElementById('fallback-warning-banner');
    const statusBadge = document.getElementById('supabase-status-badge');
    if (!isSupabaseActive) {
        if (warningBanner) warningBanner.classList.remove('hidden');
        if (statusBadge) { statusBadge.innerText = "Live (Fallback Local Mode)"; statusBadge.className = "text-xl font-bold text-amber-500"; }
    } else {
        if (warningBanner) warningBanner.classList.add('hidden');
    }

    const heroSection = document.getElementById('hero');
    if (heroSection) heroSection.style.backgroundImage = `url('${appConfig.hero_bg_url}')`;
    const aboutImg = document.getElementById('about-img');
    if (aboutImg) aboutImg.src = appConfig.about_img_url;

    const heroPreview = document.getElementById('hero-bg-preview');
    if (heroPreview && appConfig.hero_bg_url) heroPreview.src = appConfig.hero_bg_url;
    const aboutPreview = document.getElementById('about-img-preview');
    if (aboutPreview && appConfig.about_img_url) aboutPreview.src = appConfig.about_img_url;

    Object.keys(appConfig).forEach(key => {
        const viewDOM = document.getElementById(`live-${key}`); if(viewDOM) viewDOM.innerText = appConfig[key];
        const editDOM = document.getElementById(`liveEdit-${key}`); if(editDOM) editDOM.value = appConfig[key];
    });

    if (document.getElementById('home-menu-container')) renderHomeMenu();
    if (document.getElementById('home-gallery-container')) renderHomeGallery();
    if (document.getElementById('full-menu-grid')) renderFullMenuPage();
    if (document.getElementById('full-gallery-grid')) renderFullGalleryPage();
    if (document.getElementById('admin-menu-tbody')) renderAdminMenu();
    if (document.getElementById('admin-gallery-tbody')) renderAdminGallery();

    setTimeout(() => applyScrollReveal(), 100);
}

// RENDER BERANDA UTAMA (Berdasarkan Kolom showOnHome)
function renderHomeMenu() {
    const container = document.getElementById('home-menu-container'); if (!container) return;
    const homeShowcaseItems = menuState.filter(m => m.showOnHome === true).slice(0, 4);

    if (homeShowcaseItems.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-6">Belum ada produk yang dipilih untuk Beranda.</p>`;
        return;
    }

    container.innerHTML = homeShowcaseItems.map(item => {
        const hasPromo = item.discountPrice && item.discountPrice > 0;
        const badge = hasPromo ? `<div class="absolute top-2 right-2 bg-primary text-dark text-[10px] font-bold px-2 py-0.5 rounded-full z-10">Promo</div>` : '';
        const priceDisplay = hasPromo
            ? `<span class="text-accent font-bold text-sm md:text-lg">${formatRupiah(item.discountPrice)}</span><span class="text-gray-500 text-xs line-through">${formatRupiah(item.price)}</span>`
            : `<span class="text-accent font-bold text-sm md:text-lg">${formatRupiah(item.price)}</span>`;

        return `
        <article class="reveal-el bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative hover-card-effect p-3 md:p-4 flex flex-col justify-between">
            ${badge}
            <figure class="overflow-hidden rounded-xl h-24 md:h-48 mb-3">
                <img src="${item.img || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80'}" class="w-full h-full object-cover" loading="lazy" alt="${item.name}">
            </figure>
            <div>
                <span class="text-[9px] uppercase tracking-wider text-primary font-bold block mb-1">${item.category}</span>
                <h4 class="font-bold text-xs md:text-base text-white font-serif line-clamp-1 mb-2">${item.name}</h4>
                <div class="flex items-center gap-2 flex-wrap">${priceDisplay}</div>
            </div>
        </article>
        `;
    }).join('');
}

function renderHomeGallery() {
    const container = document.getElementById('home-gallery-container'); if (!container) return;
    const featuredGallery = galleryState.filter(g => g.isFeatured === true).slice(0, 3);

    container.innerHTML = featuredGallery.map((img, idx) => {
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

function renderFullMenuPage() {
    const container = document.getElementById('full-menu-grid'); if (!container) return;
    renderFilteredMenuGrid(menuState);
}

function renderFilteredMenuGrid(list) {
    const container = document.getElementById('full-menu-grid'); if (!container) return;
    if (list.length === 0) { container.innerHTML = `<div class="col-span-full py-20 text-center"><p class="text-xl font-serif text-primary/50">Menu tidak ditemukan.</p></div>`; return; }

    container.innerHTML = list.map(item => {
        const hasPromo = item.discountPrice && item.discountPrice > 0;
        const badge = hasPromo ? `<div class="absolute top-2 right-2 bg-primary text-dark text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">Promo</div>` : '';
        const priceDisplay = hasPromo
            ? `<span class="text-accent font-bold text-base md:text-xl">${formatRupiah(item.discountPrice)}</span><span class="text-gray-500 text-xs md:text-sm line-through">${formatRupiah(item.price)}</span>`
            : `<span class="text-accent font-bold text-base md:text-xl">${formatRupiah(item.price)}</span>`;

        // Badge Emas Premium untuk status Best Seller Bebas Batasan
        const bsBadge = item.isFeatured ? `<span class="ml-2 bg-cyan-500/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/20 whitespace-nowrap">★ Best Seller</span>` : '';

        return `
        <article class="reveal-el flex md:flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover-card-effect p-3 md:p-0 relative">
            ${badge}
            <figure class="w-20 h-20 md:w-full md:h-56 shrink-0 order-2 md:order-1 ml-3 md:ml-0 overflow-hidden rounded-xl md:rounded-none">
                <img src="${item.img || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80'}" class="w-full h-full object-cover" loading="lazy" alt="${item.name}">
            </figure>
            <div class="flex-1 order-1 md:order-2 flex flex-col justify-between md:p-5">
                <div>
                    <span class="text-[9px] uppercase tracking-wider text-primary font-bold block mb-1">${item.category}</span>
                    <h4 class="font-bold text-sm md:text-xl text-white font-serif flex items-center flex-wrap gap-1 leading-snug mb-2">${item.name} ${bsBadge}</h4>
                </div>
                <div class="flex items-center gap-2 mt-2 flex-wrap">${priceDisplay}</div>
            </div>
        </article>
        `;
    }).join('');
    setTimeout(() => applyScrollReveal(), 50);
}

function filterMenuPage(category, btn) {
    document.querySelectorAll('.menu-filter-btn').forEach(b => {
        b.className = "menu-filter-btn px-6 py-2.5 glass-panel border border-white/10 text-secondary rounded-full font-medium whitespace-nowrap hover:bg-white/10 transition-colors";
    });
    btn.className = "menu-filter-btn px-6 py-2.5 bg-primary text-dark rounded-full font-bold whitespace-nowrap transition-colors shadow-md";
    const filtered = category === 'Semua' ? menuState : menuState.filter(item => item.category === category);
    renderFilteredMenuGrid(filtered);
}

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

function renderFullGalleryPage() {
    const container = document.getElementById('full-gallery-grid'); if (!container) return;
    if (galleryState.length === 0) { container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Galeri foto masih kosong.</p>`; return; }

    container.innerHTML = galleryState.map((img, idx) => `
    <div class="masonry-item rounded-2xl overflow-hidden border border-white/10 shadow-lg reveal-el relative group cursor-pointer" onclick="openLightbox(${idx})">
        <img src="${img.url}" class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" loading="lazy" alt="${img.alt}">
        <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p class="text-white font-medium font-serif text-sm">${img.alt}</p>
        </div>
    </div>
    `).join('');
}

let lightboxIndex = 0;
function openLightbox(idx) {
    if (galleryState.length === 0) return; lightboxIndex = idx; syncLightboxDOM();
    const modal = document.getElementById('lightboxModal'); modal.classList.remove('hidden'); modal.classList.add('flex', 'fade-in-element');
}
function syncLightboxDOM() {
    const data = galleryState[lightboxIndex]; const imgDOM = document.getElementById('lightbox-img'); const capDOM = document.getElementById('lightbox-caption');
    if (imgDOM) { imgDOM.style.opacity = 0; setTimeout(() => { imgDOM.src = data.url; capDOM.innerText = data.alt; imgDOM.style.opacity = 1; }, 120); }
}
function closeLightbox() {
    const modal = document.getElementById('lightboxModal'); modal.classList.add('fade-out-element');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex', 'fade-out-element'); }, 300);
}
function nextLightbox() { lightboxIndex = (lightboxIndex + 1) % galleryState.length; syncLightboxDOM(); }
function prevLightbox() { lightboxIndex = (lightboxIndex - 1 + galleryState.length) % galleryState.length; syncLightboxDOM(); }

const formReservasi = document.getElementById('form-reservasi');
if (formReservasi) {
    const dateInput = document.getElementById('res-tanggal');
    if (dateInput) {
        dateInput.addEventListener('change', function(e) {
            if (new Date(e.target.value).getDay() === 6) document.getElementById('sat-warning').classList.remove('hidden');
            else document.getElementById('sat-warning').classList.add('hidden');
        });
    }
    formReservasi.addEventListener('submit', async function(e) {
        e.preventDefault(); const btn = document.getElementById('btn-submit-res'); const defaultTxt = btn.innerHTML;
        btn.innerHTML = '<span>Mengirim...</span>'; btn.disabled = true;
        const msg = `Halo Admin 3D CAFE, saya reservasi:%0A%0A*Nama:* ${document.getElementById('res-nama').value}%0A*Jumlah:* ${document.getElementById('res-jumlah').value}%0A*Waktu:* ${document.getElementById('res-tanggal').value} ${document.getElementById('res-waktu').value}`;
        await new Promise(r => setTimeout(r, 400)); showToast('Membuka WhatsApp...', 'success');
        window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${msg}`, '_blank');
        btn.innerHTML = defaultTxt; btn.disabled = false; this.reset();
    });
}

function showToast(msg, type = 'success') {
    const box = document.getElementById('toast-container'); if (!box) return;
    const toast = document.createElement('div');
    const color = type === 'success' ? 'bg-[#111827] text-[#22D3EE] border-[#06B6D4]' : 'bg-red-950/80 text-red-400 border-red-500/30';
    toast.className = `flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${color} pointer-events-auto transition-all duration-300`;
    toast.innerHTML = `<div class="font-bold text-sm tracking-wide font-serif">${msg}</div>`;
    box.appendChild(toast); setTimeout(() => { toast.remove(); }, 3000);
}

// MANAGEMENT CMS: SUPABASE AUTH SYSTEM
async function handleLoginSubmit(e) {
    e.preventDefault(); const b = document.getElementById('btn-login-admin');
    const email = document.getElementById('admin-username').value; const p = document.getElementById('admin-password').value;
    b.innerHTML = 'Memverifikasi...';

    if (isSupabaseActive) {
        try {
            const { error } = await supabaseClient.auth.signInWithPassword({ email: email, password: p });
            if (error) throw error;
            localStorage.setItem('3d_isAdminLoggedIn', 'true'); showToast('Sesi Admin Aktif!', 'success');
            document.getElementById('adminLoginModal').classList.add('hidden'); document.getElementById('adminDashboardModal').classList.remove('hidden'); document.getElementById('adminDashboardModal').classList.add('flex');
            renderAllUI();
        } catch (err) { showToast(err.message || 'Gagal ter-autentikasi!', 'error'); b.innerHTML = 'Login'; }
    } else {
        setTimeout(() => {
            if (email === "admin@3dcafe.com" && btoa(p) === OBFUSCATED_PASS_HASH) {
                localStorage.setItem('3d_isAdminLoggedIn', 'true');
                document.getElementById('adminLoginModal').classList.add('hidden'); document.getElementById('adminDashboardModal').classList.remove('hidden'); document.getElementById('adminDashboardModal').classList.add('flex');
                renderAllUI();
            } else { showToast('Kredensial salah!', 'error'); b.innerHTML = 'Login'; }
        }, 400);
    }
}

function handleAdminLogout() {
    if (isSupabaseActive) supabaseClient.auth.signOut();
    localStorage.removeItem('3d_isAdminLoggedIn');
    document.getElementById('adminDashboardModal').className = "hidden"; document.getElementById('adminLoginModal').classList.remove('hidden');
}

if (document.getElementById('adminLoginModal') && localStorage.getItem('3d_isAdminLoggedIn') === 'true') {
    document.getElementById('adminLoginModal').classList.add('hidden'); document.getElementById('adminDashboardModal').className = "flex w-full min-h-screen";
}

function switchAdminTab(target) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('bg-white/10', 'text-white'));
    document.getElementById(`tab-${target}`).className = "admin-tab whitespace-nowrap text-left px-4 py-3 bg-white/10 text-white font-medium rounded-lg";
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(`panel-${target}`).className = "admin-panel fade-in-element block";
}

async function handleLiveEdit(configKey, txtValue) {
    appConfig[configKey] = txtValue; updateStorage('3d_config', appConfig);
    if (isSupabaseActive) await supabaseClient.from('cafe_profile').upsert({ key: configKey, value: txtValue }, { onConflict: 'key' });
}

// CMS: MANAJEMEN DATA FORM KELOLA MENU (DUAL SWITCH INTERACTION)
function renderAdminMenu() {
    const tb = document.getElementById('admin-menu-tbody'); if(!tb) return;
    if(menuState.length === 0) { tb.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-gray-500">Buku menu kosong.</td></tr>`; return; }
    
    tb.innerHTML = menuState.map(m => `
        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td class="p-4 text-center">
                <button onclick="toggleShowOnHome('${m.id}')" class="text-xl transition-transform hover:scale-125 focus:outline-none ${m.showOnHome ? 'text-primary drop-shadow-md' : 'text-gray-600 grayscale opacity-40'}">
                    🏠
                </button>
            </td>
            <td class="p-4 text-center">
                <button onclick="toggleFeaturedMenu('${m.id}')" class="text-2xl transition-transform hover:scale-125 focus:outline-none ${m.isFeatured ? 'text-amber-400 drop-shadow-md' : 'text-gray-600 grayscale opacity-40'}">
                    ★
                </button>
            </td>
            <td class="p-4 flex items-center gap-4">
                <img src="${m.img || 'https://via.placeholder.com/100'}" class="w-12 h-12 rounded-xl object-cover border border-white/10 bg-black/40">
                <span class="font-bold text-white font-serif">${m.name}</span>
            </td>
            <td class="p-4"><span class="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-xs">${m.category}</span></td>
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

// TOGGLE SHOW ON HOME - PROTEKSI MAKSIMAL 4 ITEM
async function toggleShowOnHome(id) {
    const idx = menuState.findIndex(m => m.id === id); if(idx === -1) return;
    const currentStatus = menuState[idx].showOnHome || false;
    const totalOnHome = menuState.filter(m => m.showOnHome === true).length;

    if (!currentStatus && totalOnHome >= 4) {
        showToast('Maksimal hanya 4 menu yang boleh dipajang di Beranda!', 'error'); return;
    }

    menuState[idx].showOnHome = !currentStatus; updateStorage('3d_menu', menuState);
    if (isSupabaseActive) await supabaseClient.from('menu').update({ showOnHome: !currentStatus }).eq('id', id);
    renderAdminMenu(); showToast(menuState[idx].showOnHome ? 'Menu tampil di halaman utama!' : 'Menu dicopot dari halaman utama!', 'success');
}

// TOGGLE BEST SELLER - BEBAS TANPA BATASAN JUMLAH
async function toggleFeaturedMenu(id) {
    const idx = menuState.findIndex(m => m.id === id); if(idx === -1) return;
    const currentStatus = menuState[idx].isFeatured || false;

    menuState[idx].isFeatured = !currentStatus; updateStorage('3d_menu', menuState);
    if (isSupabaseActive) await supabaseClient.from('menu').update({ isFeatured: !currentStatus }).eq('id', id);
    renderAdminMenu(); showToast(menuState[idx].isFeatured ? 'Ditandai sebagai Best Seller!' : 'Status Best Seller dicopot!', 'success');
}

function openFormMenu() {
    document.getElementById('form-crud-menu').reset(); document.getElementById('crud-menu-id').value = ''; document.getElementById('crud-menu-img').value = '';
    const preview = document.getElementById('menu-img-preview'); if (preview) { preview.src = ''; preview.classList.add('hidden'); }
    document.getElementById('crud-menu-title').innerText = 'Tambah Menu Baru';
    document.getElementById('crudMenuModal').className = "fixed inset-0 z-[130] flex items-center justify-center p-4 fade-in-element";
}

function editMenu(id) {
    const m = menuState.find(item => item.id === id); if(!m) return;
    document.getElementById('crud-menu-id').value = m.id; document.getElementById('crud-menu-name').value = m.name;
    document.getElementById('crud-menu-category').value = m.category; document.getElementById('crud-menu-price').value = m.price;
    document.getElementById('crud-menu-discount').value = m.discountPrice || ''; document.getElementById('crud-menu-img').value = m.img || '';
    
    const preview = document.getElementById('menu-img-preview');
    if (preview && m.img) { preview.src = m.img; preview.classList.remove('hidden'); }
    document.getElementById('crud-menu-title').innerText = 'Edit Menu';
    document.getElementById('crudMenuModal').className = "fixed inset-0 z-[130] flex items-center justify-center p-4 fade-in-element";
}

async function handleSaveMenu(e) {
    e.preventDefault(); const id = document.getElementById('crud-menu-id').value;
    const dp = document.getElementById('crud-menu-discount').value; const discountPrice = dp && parseInt(dp) > 0 ? parseInt(dp) : null;
    
    let isFeaturedStatus = false; let showOnHomeStatus = false;
    if(id) {
        const existingItem = menuState.find(item => item.id === id);
        if(existingItem) { isFeaturedStatus = existingItem.isFeatured || false; showOnHomeStatus = existingItem.showOnHome || false; }
    }
    
    const data = {
        id: id || 'M-' + Date.now(), name: document.getElementById('crud-menu-name').value, category: document.getElementById('crud-menu-category').value,
        price: parseInt(document.getElementById('crud-menu-price').value), discountPrice: discountPrice,
        img: document.getElementById('crud-menu-img').value || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
        isPromo: discountPrice ? true : false, isFeatured: isFeaturedStatus, showOnHome: showOnHomeStatus
    };
    
    if (id) {
        const idx = menuState.findIndex(item => item.id === id); if(idx > -1) menuState[idx] = data;
        if (isSupabaseActive) await supabaseClient.from('menu').update(data).eq('id', id);
        showToast('Menu diperbarui!', 'success');
    } else {
        menuState.unshift(data);
        if (isSupabaseActive) await supabaseClient.from('menu').insert(data);
        showToast('Menu ditambahkan!', 'success');
    }
    updateStorage('3d_menu', menuState); renderAdminMenu(); closeFormModal('crudMenuModal');
}

async function deleteMenu(id) {
    if(!confirm('Hapus menu ini?')) return;
    menuState = menuState.filter(m => m.id !== id); updateStorage('3d_menu', menuState);
    if (isSupabaseActive) await supabaseClient.from('menu').delete().eq('id', id);
    renderAdminMenu();
}

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
            <td class="p-4"><img src="${g.url}" class="w-20 h-14 object-cover rounded-md border border-white/10 bg-black/40"></td>
            <td class="p-4 text-gray-300"><span class="font-bold text-white block mb-1">${g.alt}</span><span class="text-xs text-primary block truncate max-w-xs">${g.url}</span></td>
            <td class="p-4 text-right"><button onclick="deleteGallery('${g.id}')" class="text-red-400 hover:bg-white/5 px-3 py-1.5 rounded-lg text-sm font-medium">Hapus</button></td>
        </tr>
    `).join('');
    document.getElementById('stat-gallery').innerText = galleryState.length;
}

async function toggleFeaturedGallery(id) {
    const idx = galleryState.findIndex(g => g.id === id); if(idx === -1) return;
    const nextState = !galleryState[idx].isFeatured; if(nextState && galleryState.filter(g => g.isFeatured === true).length >= 3) { showToast('Maksimal 3 Highlight Galeri!', 'error'); return; }
    galleryState[idx].isFeatured = nextState; updateStorage('3d_gallery', galleryState);
    if (isSupabaseActive) await supabaseClient.from('gallery').update({ isFeatured: nextState }).eq('id', id);
    renderAdminGallery(); showToast('Galeri beranda di-update!', 'success');
}

function openFormGallery() {
    document.getElementById('form-crud-gallery').reset(); document.getElementById('crud-gal-url').value = '';
    const preview = document.getElementById('gal-img-preview'); if (preview) { preview.src = ''; preview.classList.add('hidden'); }
    document.getElementById('crudGalleryModal').className = "fixed inset-0 z-[130] flex items-center justify-center p-4 fade-in-element";
}

async function handleSaveGallery(e) {
    e.preventDefault(); const imgUrl = document.getElementById('crud-gal-url').value;
    if (!imgUrl) { showToast("Wajib upload gambar terlebih dahulu!", "error"); return; }
    const data = { id: 'G-' + Date.now(), url: imgUrl, alt: document.getElementById('crud-gal-alt').value, isFeatured: false };
    galleryState.unshift(data);
    if (isSupabaseActive) await supabaseClient.from('gallery').insert(data);
    updateStorage('3d_gallery', galleryState); renderAdminGallery(); closeFormModal('crudGalleryModal'); showToast('Foto ditambahkan!', 'success');
}

async function deleteGallery(id) {
    if(!confirm('Hapus foto dari galeri?')) return;
    galleryState = galleryState.filter(g => g.id !== id); updateStorage('3d_gallery', galleryState);
    if (isSupabaseActive) await supabaseClient.from('gallery').delete().eq('id', id);
    renderAdminGallery();
}

function closeFormModal(id) {
    const modal = document.getElementById(id); modal.classList.add('fade-out-element');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex', 'fade-out-element'); }, 300);
}

document.addEventListener('DOMContentLoaded', renderAllUI);
