/**
 * E-Menu Rasa Rasa - Core App Javascript
 * Handles State management, API loading, UI rendering, LocalStorage, Cart animations, Modals & Checkout
 */

// 1. App Configuration
const API_URL = 'https://docs.google.com/spreadsheets/d/1Q22OpFVpqufsynYMLpuk6qEMelsIMrUJwENa7aAtXBQ/export?format=csv';
const WHATSAPP_PHONE = '60123456789'; // Format: 601XXXXXXXX (Gunakan kod negara Malaysia '60')

// 2. High-Quality Mock/Fallback Data (for offline usage or API errors)
const MOCK_PRODUCTS = [
    {
        id: 'mock-1',
        nama: 'Nasi Lemak Ayam Berempah',
        harga: 12.90,
        gambar: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=600&q=80',
        kategori: 'Makanan Utama',
        deskripsi: 'Nasi lemak wangi bersantan disajikan dengan ayam goreng rempah garing, sambal tumis pedas manis, telur rebus, timun, kacang dan ikan bilis.'
    },
    {
        id: 'mock-2',
        nama: 'Satay Ayam Klasik (6 Cucuk)',
        harga: 9.00,
        gambar: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80',
        kategori: 'Makanan Ringan',
        deskripsi: 'Cucukan daging ayam segar diperap dengan serai dan rempah tradisional, dibakar arang dan disajikan dengan kuah kacang pekat.'
    },
    {
        id: 'mock-3',
        nama: 'Roti Canai Tsunami',
        harga: 5.50,
        gambar: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&q=80',
        kategori: 'Makanan Utama',
        deskripsi: 'Dua keping roti canai garing dicarik-carik dan dibanjiri kuah dhal pekat serta sambal tumis pedas.'
    },
    {
        id: 'mock-4',
        nama: 'Mee Goreng Mamak Special',
        harga: 8.50,
        gambar: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
        kategori: 'Makanan Utama',
        deskripsi: 'Mee kuning digoreng basah bersama telur, tahu, taugeh, cili kisar dan sos kicap istimewa mamak.'
    },
    {
        id: 'mock-5',
        nama: 'Teh Tarik Kaw',
        harga: 3.20,
        gambar: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
        kategori: 'Minuman',
        deskripsi: 'Teh merah premium dibrew segar dan ditarik sempurna dengan susu pekat manis sehingga berbuih tebal.'
    },
    {
        id: 'mock-6',
        nama: 'Kopi Ais Kaw',
        harga: 3.50,
        gambar: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80',
        kategori: 'Minuman',
        deskripsi: 'Ekstrak biji kopi tempatan yang pekat dibancuh sejuk bersama ketulan ais padat.'
    },
    {
        id: 'mock-7',
        nama: 'Rendang Daging Tok',
        harga: 15.00,
        gambar: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&q=80',
        kategori: 'Makanan Utama',
        deskripsi: 'Resipi tradisional Perak dengan daging lembu premium yang direneh perlahan bersama kerisik kelapa dan rempah ratus sehingga kering dan empuk.'
    },
    {
        id: 'mock-8',
        nama: 'Ais Kacang (ABC) Gula Melaka',
        harga: 6.00,
        gambar: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80',
        kategori: 'Pencuci Mulut',
        deskripsi: 'Ais serut halus dilimpahi sirap merah, susu cair, kacang merah, jagung manis, cincau, kacang tanah dan sirap tulen Gula Melaka.'
    }
];

// 3. State Variables
let allProducts = [];
let cart = [];
let selectedCategory = 'semua';
let searchQuery = '';
let activeProductForModal = null;

// 4. DOM Elements
const elements = {
    html: document.documentElement,
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    cartToggleBtn: document.getElementById('cart-toggle-btn'),
    cartCount: document.getElementById('cart-count'),
    searchInput: document.getElementById('search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    categoryContainer: document.getElementById('category-container'),
    btnAll: document.getElementById('btn-all'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    menuGrid: document.getElementById('menu-grid'),
    noResults: document.getElementById('no-results'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    
    // Drawer
    cartBackdrop: document.getElementById('cart-backdrop'),
    cartDrawer: document.getElementById('cart-drawer'),
    closeCartBtn: document.getElementById('close-cart-btn'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    summaryTotalQty: document.getElementById('summary-total-qty'),
    cartDrawerCount: document.getElementById('cart-drawer-count'),
    tableNumber: document.getElementById('table-number'),
    checkoutBtn: document.getElementById('checkout-btn'),
    
    // Modal
    modalBackdrop: document.getElementById('modal-backdrop'),
    productDetailModal: document.getElementById('product-detail-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    modalProductImg: document.getElementById('modal-product-img'),
    modalProductBadge: document.getElementById('modal-product-badge'),
    modalProductCategory: document.getElementById('modal-product-category'),
    modalProductTitle: document.getElementById('modal-product-title'),
    modalProductDesc: document.getElementById('modal-product-desc'),
    modalProductPrice: document.getElementById('modal-product-price'),
    modalQtyMinus: document.getElementById('modal-qty-minus'),
    modalQtyPlus: document.getElementById('modal-qty-plus'),
    modalQtyVal: document.getElementById('modal-qty-val'),
    modalProductNote: document.getElementById('modal-product-note'),
    modalAddToCartBtn: document.getElementById('modal-add-to-cart-btn'),
    
    // Toast
    toastNotification: document.getElementById('toast-notification'),
    toastMessage: document.getElementById('toast-message'),
    toastIcon: document.getElementById('toast-icon'),
    
    // Retry/Fallback buttons
    retryBtn: document.getElementById('retry-btn'),
    fallbackBtn: document.getElementById('fallback-btn'),
    
    // Trending search tags
    trendTags: document.querySelectorAll('.trend-tag')
};

// 5. Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadLocalStorageData();
    registerEventListeners();
    fetchMenuData();
});

// 6. Theme Logic (Light / Dark Mode)
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setTheme(true);
    } else {
        setTheme(false);
    }
}

function setTheme(dark) {
    if (dark) {
        elements.html.setAttribute('data-theme', 'dark');
        elements.themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        elements.html.setAttribute('data-theme', 'light');
        elements.themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
}

// 7. Load LocalStorage details
function loadLocalStorageData() {
    // Load Table Number / Contact details
    const savedTable = localStorage.getItem('tableNumber');
    if (savedTable && elements.tableNumber) {
        elements.tableNumber.value = savedTable;
    }
    
    // Load Cart items
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error('Error parsing cart from LocalStorage:', e);
            cart = [];
        }
    }
}

// 8. Event Listeners setup
function registerEventListeners() {
    // Theme Toggle
    elements.themeToggleBtn.addEventListener('click', () => {
        const isCurrentlyDark = elements.html.getAttribute('data-theme') === 'dark';
        setTheme(!isCurrentlyDark);
    });
    
    // Drawer Cart toggling
    elements.cartToggleBtn.addEventListener('click', toggleCartDrawer);
    elements.closeCartBtn.addEventListener('click', toggleCartDrawer);
    elements.cartBackdrop.addEventListener('click', toggleCartDrawer);
    
    // Modal controls
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.modalBackdrop.addEventListener('click', closeModal);
    
    elements.modalQtyMinus.addEventListener('click', () => adjustModalQty(-1));
    elements.modalQtyPlus.addEventListener('click', () => adjustModalQty(1));
    elements.modalAddToCartBtn.addEventListener('click', handleModalAddToCart);
    
    // Search event inputs
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.searchClearBtn.addEventListener('click', clearSearch);
    elements.clearSearchBtn.addEventListener('click', clearSearch);
    
    // Search trending tag clicks
    elements.trendTags.forEach(tag => {
        tag.addEventListener('click', () => {
            elements.searchInput.value = tag.textContent;
            handleSearchInput();
        });
    });
    
    // Retry/Fallback buttons
    elements.retryBtn.addEventListener('click', fetchMenuData);
    elements.fallbackBtn.addEventListener('click', loadFallbackMenu);
    
    // Table number change updates LocalStorage
    elements.tableNumber.addEventListener('input', (e) => {
        localStorage.setItem('tableNumber', e.target.value.trim());
    });
    
    // Checkout Submit
    elements.checkoutBtn.addEventListener('click', handleCheckout);
    
    // Keyboard Esc key close drawers/modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (!elements.cartDrawer.classList.contains('closed')) {
                toggleCartDrawer();
            }
        }
    });
}

// Helper to parse CSV text into a 2D array
function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const row = [];
        let insideQuote = false;
        let entry = '';
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"') {
                insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
                row.push(entry);
                entry = '';
            } else {
                entry += char;
            }
        }
        row.push(entry);
        result.push(row);
    }
    return result;
}

// 9. Helper: Convert Google Drive share links to direct image URLs
function convertToDirectImageUrl(url) {
    if (!url) return '';
    
    // Match Google Drive share URL patterns:
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?export=view&id=FILE_ID
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                        url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    
    if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        // Use thumbnail API — more reliable than uc?export=view (avoids Google's warning page)
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
    }
    
    // Not a Drive link — return as-is
    return url;
}

// 10. Fetch Menu from Sheets CSV directly
async function fetchMenuData() {
    showState('loading');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API Response error');
        
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        
        if (rows.length <= 1) {
            throw new Error('Menu list returned empty');
        }
        
        // Normalize headers
        const headers = rows[0].map(h => h.trim().toLowerCase());
        
        // Locate column indices dynamically
        const idIdx = headers.findIndex(h => h === 'id');
        const namaIdx = headers.findIndex(h => h.includes('nama') || h.includes('name') || h.includes('tajuk') || h.includes('title'));
        const hargaIdx = headers.findIndex(h => h.includes('harga') || h.includes('price'));
        const kategoriIdx = headers.findIndex(h => h.includes('kategori') || h.includes('category'));
        const gambarIdx = headers.findIndex(h => h.includes('gambar') || h.includes('image') || h.includes('url'));
        const deskripsiIdx = headers.findIndex(h => h.includes('deskripsi') || h.includes('description') || h.includes('desc'));
        
        allProducts = [];
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length === 0 || (namaIdx !== -1 && !row[namaIdx])) continue;
            
            // Standardize image
            const rawImg = gambarIdx !== -1 && row[gambarIdx] ? row[gambarIdx].trim() : '';
            let imgUrl = convertToDirectImageUrl(rawImg);
            if (!imgUrl || imgUrl.includes('instagram.com') || imgUrl.includes('facebook.com')) {
                // If it's a social post link or empty, use our default food placeholder
                imgUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
            }
            
            allProducts.push({
                id: idIdx !== -1 && row[idIdx] ? String(row[idIdx]).trim() : `sheet-${i}`,
                nama: namaIdx !== -1 && row[namaIdx] ? row[namaIdx].trim() : 'Hidangan Tanpa Nama',
                harga: hargaIdx !== -1 && row[hargaIdx] ? parseFloat(row[hargaIdx].replace(/[^\d.-]/g, '')) || 0 : 0,
                gambar: imgUrl,
                kategori: kategoriIdx !== -1 && row[kategoriIdx] ? row[kategoriIdx].trim() : 'Lain-lain',
                deskripsi: deskripsiIdx !== -1 && row[deskripsiIdx] ? row[deskripsiIdx].trim() : 'Hidangan tradisional lazat di Rasa Rasa.'
            });
        }
        
        generateCategoryTabs();
        renderProducts();
        showState('success');
    } catch (error) {
        console.error('Fetch Menu failed:', error);
        showState('error');
    }
}

// Load Mock Fallback Menu
function loadFallbackMenu() {
    allProducts = [...MOCK_PRODUCTS];
    generateCategoryTabs();
    renderProducts();
    showState('success');
    showToast('Memuatkan menu contoh berjaya!', 'fa-circle-check');
}

// State display management
function showState(state) {
    elements.loading.classList.add('hidden');
    elements.error.classList.add('hidden');
    elements.menuGrid.classList.add('hidden');
    
    if (state === 'loading') {
        elements.loading.classList.remove('hidden');
    } else if (state === 'error') {
        elements.error.classList.remove('hidden');
    } else if (state === 'success') {
        elements.menuGrid.classList.remove('hidden');
    }
}

// 10. Category Tabs Generation
function generateCategoryTabs() {
    // Keep 'All' category button
    elements.categoryContainer.innerHTML = '';
    elements.categoryContainer.appendChild(elements.btnAll);
    
    // Extract unique categories
    const categories = [...new Set(allProducts.map(p => p.kategori.trim()))];
    
    categories.forEach(cat => {
        if (!cat || cat.toLowerCase() === 'semua') return;
        
        const btn = document.createElement('button');
        btn.className = 'category-card';
        btn.setAttribute('data-category', cat);
        
        // Premium Icons based on name
        let iconHtml = '<i class="fa-solid fa-utensils"></i>';
        const lowerCat = cat.toLowerCase();
        if (lowerCat.includes('makan') || lowerCat.includes('utama') || lowerCat.includes('nasi') || lowerCat.includes('mee')) {
            iconHtml = '<i class="fa-solid fa-bowl-food"></i>';
        } else if (lowerCat.includes('minum') || lowerCat.includes('air') || lowerCat.includes('jus')) {
            iconHtml = '<i class="fa-solid fa-glass-water"></i>';
        } else if (lowerCat.includes('pencuci') || lowerCat.includes('manis') || lowerCat.includes('kek') || lowerCat.includes('dessert') || lowerCat.includes('ais')) {
            iconHtml = '<i class="fa-solid fa-ice-cream"></i>';
        } else if (lowerCat.includes('ringan') || lowerCat.includes('snack') || lowerCat.includes('satay') || lowerCat.includes('goreng')) {
            iconHtml = '<i class="fa-solid fa-cookie"></i>';
        }
        
        btn.innerHTML = `${iconHtml}<span>${cat}</span>`;
        btn.addEventListener('click', () => filterByCategory(cat, btn));
        elements.categoryContainer.appendChild(btn);
    });
    
    // Register 'All' button click explicitly
    elements.btnAll.onclick = () => filterByCategory('semua', elements.btnAll);
}

// Filter products by category
function filterByCategory(cat, activeBtn) {
    selectedCategory = cat;
    
    // Reset active class
    const categoryCards = elements.categoryContainer.querySelectorAll('.category-card');
    categoryCards.forEach(card => card.classList.remove('active'));
    activeBtn.classList.add('active');
    
    renderProducts();
}

// 11. Render Products in Grid
function renderProducts() {
    elements.menuGrid.innerHTML = '';
    
    const filtered = allProducts.filter(p => {
        const matchesCategory = selectedCategory === 'semua' || p.kategori === selectedCategory;
        const matchesSearch = p.nama.toLowerCase().includes(searchQuery) || p.deskripsi.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });
    
    if (filtered.length === 0) {
        elements.menuGrid.classList.add('hidden');
        elements.noResults.classList.remove('hidden');
        return;
    }
    
    elements.noResults.classList.add('hidden');
    elements.menuGrid.classList.remove('hidden');
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <div class="card-image-box">
                <img src="${p.gambar}" alt="${p.nama}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'">
                <span class="card-category-badge">${p.kategori}</span>
            </div>
            <div class="card-body">
                <h4 class="card-title">${p.nama}</h4>
                <p class="card-desc">${p.deskripsi}</p>
                <div class="card-footer">
                    <span class="card-price">RM ${p.harga.toFixed(2)}</span>
                    <button class="card-add-btn" aria-label="Tambah ${p.nama} ke troli" data-id="${p.id}">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Click on body opens Detail Modal
        card.addEventListener('click', (e) => {
            // Prevent trigger modal when clicking the add-to-cart button directly
            if (e.target.closest('.card-add-btn')) {
                const btn = e.target.closest('.card-add-btn');
                const pId = btn.getAttribute('data-id');
                addToCart(pId, 1, 'Biasa', '', btn);
                return;
            }
            openProductDetailModal(p);
        });
        
        elements.menuGrid.appendChild(card);
    });
}

// Search Inputs logic
function handleSearchInput() {
    searchQuery = elements.searchInput.value.toLowerCase().trim();
    if (searchQuery.length > 0) {
        elements.searchClearBtn.classList.remove('hidden');
    } else {
        elements.searchClearBtn.classList.add('hidden');
    }
    renderProducts();
}

function clearSearch() {
    elements.searchInput.value = '';
    searchQuery = '';
    elements.searchClearBtn.classList.add('hidden');
    renderProducts();
}

// 12. Modal Handlers
function openProductDetailModal(product) {
    activeProductForModal = product;
    
    // Set content details
    elements.modalProductImg.src = product.gambar;
    elements.modalProductTitle.textContent = product.nama;
    elements.modalProductCategory.textContent = product.kategori;
    elements.modalProductDesc.textContent = product.deskripsi;
    elements.modalProductPrice.textContent = `RM ${product.harga.toFixed(2)}`;
    
    // Reset options
    elements.modalQtyVal.textContent = '1';
    elements.modalProductNote.value = '';
    
    // Select default 'Biasa' preference
    const defaultRadio = elements.productDetailModal.querySelector('input[name="preference"][value="Biasa"]');
    if (defaultRadio) defaultRadio.checked = true;
    
    // Show components
    elements.modalBackdrop.classList.remove('hidden');
    elements.productDetailModal.classList.remove('hidden');
    elements.html.style.overflow = 'hidden'; // Lock main scroll
}

function closeModal() {
    elements.modalBackdrop.classList.add('hidden');
    elements.productDetailModal.classList.add('hidden');
    elements.html.style.overflow = ''; // Unlock scroll
    activeProductForModal = null;
}

function adjustModalQty(change) {
    let currentQty = parseInt(elements.modalQtyVal.textContent);
    currentQty += change;
    if (currentQty < 1) currentQty = 1;
    elements.modalQtyVal.textContent = currentQty;
}

function handleModalAddToCart() {
    if (!activeProductForModal) return;
    
    const qty = parseInt(elements.modalQtyVal.textContent);
    const pref = elements.productDetailModal.querySelector('input[name="preference"]:checked').value;
    const note = elements.modalProductNote.value.trim();
    
    addToCart(activeProductForModal.id, qty, pref, note, elements.modalAddToCartBtn);
    closeModal();
}

// 13. State & Cart updates
function addToCart(productId, qty = 1, preference = 'Biasa', note = '', triggerElement = null) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Check if same item with same options is already in cart
    const existingIndex = cart.findIndex(item => 
        item.product.id === productId && 
        item.preference === preference && 
        item.note === note
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            product,
            qty,
            preference,
            note
        });
    }
    
    updateCartUI();
    
    // Trigger flying fly-to-cart animation if a trigger element is provided
    if (triggerElement) {
        triggerFlyToCartAnimation(triggerElement, product.gambar);
    } else {
        showToast(`Item "${product.nama}" ditambahkan!`, 'fa-circle-check');
    }
}

function updateCartQty(index, amount) {
    cart[index].qty += amount;
    
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
        showToast('Item dikeluarkan dari troli.', 'fa-circle-check');
    }
    
    updateCartUI();
}

function updateCartUI() {
    // Save to LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Counter updates
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    elements.cartCount.textContent = totalQty;
    elements.summaryTotalQty.textContent = totalQty;
    elements.cartDrawerCount.textContent = `${totalQty} item`;
    
    if (totalQty > 0) {
        elements.cartCount.classList.remove('hidden');
    } else {
        elements.cartCount.classList.add('hidden');
    }
    
    // Rendering cart list
    elements.cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart-view">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Troli anda masih kosong.</p>
            </div>
        `;
        elements.cartTotal.textContent = 'RM 0.00';
        return;
    }
    
    let grandTotal = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.product.harga * item.qty;
        grandTotal += subtotal;
        
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        
        let customOptionsText = item.preference;
        if (item.note) {
            customOptionsText += ` (Nota: ${item.note})`;
        }
        
        row.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.product.gambar}" class="cart-item-img" alt="${item.product.nama}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'">
                <div class="cart-item-details">
                    <h5 class="cart-item-name">${item.product.nama}</h5>
                    <span class="cart-item-pref">${customOptionsText}</span>
                    <span class="cart-item-subtotal">RM ${subtotal.toFixed(2)}</span>
                </div>
            </div>
            <div class="cart-item-qty-control">
                <button class="qty-control-btn minus-btn" aria-label="Kurangkan item"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-control-val">${item.qty}</span>
                <button class="qty-control-btn plus-btn" aria-label="Tambahkan item"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        
        // Stepper click binds
        row.querySelector('.minus-btn').addEventListener('click', () => updateCartQty(index, -1));
        row.querySelector('.plus-btn').addEventListener('click', () => updateCartQty(index, 1));
        
        elements.cartItems.appendChild(row);
    });
    
    elements.cartTotal.textContent = `RM ${grandTotal.toFixed(2)}`;
}

// Toggle drawer state
function toggleCartDrawer() {
    const isClosed = elements.cartDrawer.classList.contains('closed');
    if (isClosed) {
        elements.cartDrawer.classList.remove('closed');
        elements.cartBackdrop.classList.remove('hidden');
        elements.html.style.overflow = 'hidden';
    } else {
        elements.cartDrawer.classList.add('closed');
        elements.cartBackdrop.classList.add('hidden');
        elements.html.style.overflow = '';
    }
}

// 14. Checkout Logic via WhatsApp
function handleCheckout() {
    if (cart.length === 0) {
        showToast('Troli anda kosong!', 'fa-circle-exclamation');
        return;
    }
    
    const tableNo = elements.tableNumber.value.trim();
    if (!tableNo) {
        showToast('Sila isi Nombor Meja atau No. Telefon!', 'fa-circle-exclamation');
        elements.tableNumber.focus();
        return;
    }
    
    // Save table to LocalStorage
    localStorage.setItem('tableNumber', tableNo);
    
    // Build WhatsApp message payload
    let message = `*PESANAN E-MENU BARU (Rasa Rasa)*\n`;
    message += `===============================\n`;
    message += `*Meja / No. Telefon:* ${tableNo}\n`;
    message += `*Tarikh/Masa:* ${new Date().toLocaleString('ms-MY')}\n`;
    message += `===============================\n\n`;
    
    let grandTotal = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.product.harga * item.qty;
        grandTotal += itemTotal;
        
        message += `${index + 1}. *${item.product.nama}* (x${item.qty})\n`;
        message += `   - Pilihan: ${item.preference}\n`;
        if (item.note) {
            message += `   - Nota: _${item.note}_\n`;
        }
        message += `   - Harga: RM ${item.product.harga.toFixed(2)} -> *RM ${itemTotal.toFixed(2)}*\n\n`;
    });
    
    message += `-------------------------------\n`;
    message += `*JUMLAH KESELURUHAN: RM ${grandTotal.toFixed(2)}*\n`;
    message += `-------------------------------\n\n`;
    message += `Mohon sahkan pesanan ini segera. Terima kasih!`;
    
    const encodedText = encodeURIComponent(message);
    const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
    
    // Open Link
    window.open(waLink, '_blank');
}

// 15. Fly-to-Cart Animation Logic
function triggerFlyToCartAnimation(triggerBtn, imageSrc) {
    // Locate coordinate positions
    const btnRect = triggerBtn.getBoundingClientRect();
    const cartBtnRect = elements.cartToggleBtn.getBoundingClientRect();
    
    // Create animated floating element
    const thumb = document.createElement('img');
    thumb.src = imageSrc;
    thumb.className = 'flying-thumbnail';
    thumb.style.left = `${btnRect.left + (btnRect.width / 2) - 30}px`;
    thumb.style.top = `${btnRect.top + (btnRect.height / 2) - 30}px`;
    
    document.body.appendChild(thumb);
    
    // Request frame render to compute start positions
    requestAnimationFrame(() => {
        thumb.style.transform = `translate(${cartBtnRect.left - btnRect.left}px, ${cartBtnRect.top - btnRect.top}px) scale(0.2)`;
        thumb.style.opacity = '0.3';
    });
    
    // Cleanup on end
    setTimeout(() => {
        thumb.remove();
        
        // Bounce the cart badge
        elements.cartCount.classList.add('bounce');
        setTimeout(() => {
            elements.cartCount.classList.remove('bounce');
        }, 300);
        
        showToast('Item ditambah ke troli!', 'fa-circle-check');
    }, 500);
}

// 16. Floating Toast Notifications
let toastTimeout = null;
function showToast(message, iconClass = 'fa-circle-check') {
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    elements.toastIcon.className = `fa-solid ${iconClass}`;
    elements.toastMessage.textContent = message;
    elements.toastNotification.classList.remove('hidden');
    
    toastTimeout = setTimeout(() => {
        elements.toastNotification.classList.add('hidden');
    }, 3000);
}
