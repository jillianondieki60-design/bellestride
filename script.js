// Bellestride E-commerce App JavaScript

// Data Storage
let products = [];
let cart = [];
let orders = [];
let currentFilter = 'all';
let productsLoadedFromGitHub = false; // True when products came from the shared GitHub source

// GitHub Pages Compatible Data Management
let githubConfig = {
    repo: 'jillianondieki60-design/bellestride', // Full owner/repo, auto-detected on GitHub Pages
    branch: 'main',
    logoPath: 'assets/logo.png',
    productsPath: 'data/products.json',
    ordersPath: 'data/orders.json',
    token: '' // Will be set by admin
};

// Detect the full "owner/repo" slug when running on GitHub Pages.
// Owner comes from the "username.github.io" hostname, repo from the first path segment.
function detectGitHubRepo() {
    if (window.location.hostname.includes('github.io')) {
        const owner = window.location.hostname.split('.')[0];
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const repoName = pathParts.length > 0 ? pathParts[0] : '';
        if (owner && repoName) {
            return `${owner}/${repoName}`;
        }
    }
    return 'jillianondieki60-design/bellestride';
}

// Logo Management Functions
function initializeLogo() {
    // Try to detect GitHub Pages environment
    if (window.location.hostname.includes('github.io')) {
        githubConfig.repo = detectGitHubRepo();
        loadLogoFromGitHub();
    } else {
        // Fallback to localStorage for local development
        const savedLogo = localStorage.getItem('bellestrideLogo');
        if (savedLogo) {
            updateLogoDisplay(savedLogo);
            const currentLogoImg = document.getElementById('current-logo');
            if (currentLogoImg) {
                currentLogoImg.src = savedLogo;
            }
        } else {
            const defaultLogo = '<div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center"><i class="fas fa-high-heel text-white text-lg"></i></div>';
            document.getElementById('header-logo').innerHTML = defaultLogo;
        }
    }
}

function uploadLogo() {
    const fileInput = document.getElementById('logo-upload');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a logo file', 'error');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('Logo size must be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoData = e.target.result;
        
        if (window.location.hostname.includes('github.io')) {
            // GitHub Pages deployment - save to GitHub
            saveLogoToGitHub(logoData);
        } else {
            // Local development - save to localStorage
            localStorage.setItem('bellestrideLogo', logoData);
            updateLogoDisplay(logoData);
            const currentLogoImg = document.getElementById('current-logo');
            if (currentLogoImg) {
                currentLogoImg.src = logoData;
            }
            showNotification('Logo uploaded successfully! It will remain until you change it.', 'success');
        }
        
        // Clear the file input
        fileInput.value = '';
    };
    reader.readAsDataURL(file);
}

function updateLogoDisplay(logoData) {
    const headerLogo = document.getElementById('header-logo');
    headerLogo.innerHTML = `<img src="${logoData}" alt="Bellestride" class="w-10 h-10 rounded-full object-cover">`;
}

function resetLogo() {
    if (window.location.hostname.includes('github.io')) {
        // GitHub Pages - delete logo from GitHub
        deleteLogoFromGitHub();
    } else {
        // Local development - remove from localStorage
        localStorage.removeItem('bellestrideLogo');
        const defaultLogo = '<div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center"><i class="fas fa-high-heel text-white text-lg"></i></div>';
        document.getElementById('header-logo').innerHTML = defaultLogo;
        const currentLogoImg = document.getElementById('current-logo');
        if (currentLogoImg) {
            currentLogoImg.src = '';
        }
        const logoPreview = document.getElementById('logo-preview');
        if (logoPreview) {
            logoPreview.src = '';
            logoPreview.classList.add('hidden');
        }
        showNotification('Logo reset to default', 'success');
    }
}

// GitHub API Functions
async function loadLogoFromGitHub() {
    try {
        const logoUrl = `https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.logoPath}`;
        const response = await fetch(logoUrl);
        
        if (response.ok) {
            const data = await response.json();
            const logoData = atob(data.content);
            updateLogoDisplay(`data:image/png;base64,${logoData}`);
            
            const currentLogoImg = document.getElementById('current-logo');
            if (currentLogoImg) {
                currentLogoImg.src = `data:image/png;base64,${logoData}`;
            }
        } else {
            // No custom logo found, use default
            const defaultLogo = '<div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center"><i class="fas fa-high-heel text-white text-lg"></i></div>';
            document.getElementById('header-logo').innerHTML = defaultLogo;
        }
    } catch (error) {
        console.log('No custom logo found, using default');
        const defaultLogo = '<div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center"><i class="fas fa-high-heel text-white text-lg"></i></div>';
        document.getElementById('header-logo').innerHTML = defaultLogo;
    }
}

async function saveLogoToGitHub(logoData) {
    const token = prompt('Enter GitHub Personal Access Token (with repo scope):');
    if (!token) {
        showNotification('GitHub token required for logo upload', 'error');
        return;
    }
    
    try {
        // Convert base64 to base64 without data URL prefix
        const base64Data = logoData.split(',')[1];
        
        const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.logoPath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update logo',
                content: base64Data,
                branch: githubConfig.branch
            })
        });
        
        if (response.ok) {
            updateLogoDisplay(logoData);
            const currentLogoImg = document.getElementById('current-logo');
            if (currentLogoImg) {
                currentLogoImg.src = logoData;
            }
            showNotification('Logo uploaded to GitHub! Changes will be visible after GitHub Pages rebuild (1-2 minutes).', 'success');
        } else {
            const error = await response.json();
            showNotification(`GitHub error: ${error.message}`, 'error');
        }
    } catch (error) {
        showNotification('Failed to upload logo to GitHub', 'error');
    }
}

async function deleteLogoFromGitHub() {
    const token = prompt('Enter GitHub Personal Access Token (with repo scope):');
    if (!token) {
        showNotification('GitHub token required for logo deletion', 'error');
        return;
    }
    
    try {
        // First get the current file SHA
        const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.logoPath}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Delete the file
            const deleteResponse = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.logoPath}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Remove custom logo',
                    sha: data.sha,
                    branch: githubConfig.branch
                })
            });
            
            if (deleteResponse.ok) {
                const defaultLogo = '<div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center"><i class="fas fa-high-heel text-white text-lg"></i></div>';
                document.getElementById('header-logo').innerHTML = defaultLogo;
                const currentLogoImg = document.getElementById('current-logo');
                if (currentLogoImg) {
                    currentLogoImg.src = '';
                }
                const logoPreview = document.getElementById('logo-preview');
                if (logoPreview) {
                    logoPreview.src = '';
                    logoPreview.classList.add('hidden');
                }
                showNotification('Logo deleted from GitHub! Changes will be visible after GitHub Pages rebuild.', 'success');
            } else {
                const error = await deleteResponse.json();
                showNotification(`GitHub error: ${error.message}`, 'error');
            }
        } else {
            showNotification('No custom logo found to delete', 'info');
        }
    } catch (error) {
        showNotification('Failed to delete logo from GitHub', 'error');
    }
}

// Base64-encode a UTF-8 string. Plain btoa() throws on non-Latin1 characters
// (e.g. emoji or accented text in product names), which would silently fail the save.
function encodeBase64Utf8(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// Fetch a shared JSON data file from GitHub and return the parsed value (or null).
// Primary: the contents API (raw media type) — returns fresh data (~60s cache), handles
// files >1MB, and uses the admin token when present. raw.githubusercontent.com is avoided
// as the primary source because its CDN caches for ~5 minutes and ignores cache-busting
// query params, which made freshly added products appear to "disappear" on reload.
// Fallback: raw.githubusercontent.com (no API rate limit) in case the API read fails.
async function fetchDataFileFromGitHub(path) {
    // Primary: GitHub contents API with the raw media type.
    try {
        const apiUrl = `https://api.github.com/repos/${githubConfig.repo}/contents/${path}?ref=${githubConfig.branch}&t=${Date.now()}`;
        const headers = { 'Accept': 'application/vnd.github.raw' };
        if (githubConfig.token) {
            headers['Authorization'] = `token ${githubConfig.token}`;
        }
        const response = await fetch(apiUrl, { headers, cache: 'no-store' });
        if (response.ok) {
            return JSON.parse(await response.text());
        }
    } catch (error) {
        // fall through to the raw fallback
    }

    // Fallback: raw file (no rate limit, but may be up to ~5 minutes stale).
    try {
        const rawUrl = `https://raw.githubusercontent.com/${githubConfig.repo}/${githubConfig.branch}/${path}?t=${Date.now()}`;
        const response = await fetch(rawUrl, { cache: 'no-store' });
        if (response.ok) {
            return JSON.parse(await response.text());
        }
    } catch (error) {
        // ignore
    }

    return null;
}

// GitHub Data Sync Functions for Products
async function loadProductsFromGitHub() {
    // Public read: only the repo is required, no token needed.
    if (!githubConfig.repo) {
        return false;
    }

    const data = await fetchDataFileFromGitHub(githubConfig.productsPath);
    if (Array.isArray(data)) {
        products = data;
        localStorage.setItem('bellestride_products', JSON.stringify(products)); // Update local cache
        return true;
    }
    console.log('No products data on GitHub yet');
    return false;
}

async function saveProductsToGitHub() {
    if (!githubConfig.repo || !githubConfig.token) {
        return false;
    }
    
    try {
        const content = encodeBase64Utf8(JSON.stringify(products, null, 2));
        
        // First check if file exists
        const checkResponse = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.productsPath}`, {
            headers: {
                'Authorization': `token ${githubConfig.token}`
            }
        });
        
        let body = {
            message: 'Update products data',
            content: content,
            branch: githubConfig.branch
        };
        
        if (checkResponse.ok) {
            const data = await checkResponse.json();
            body.sha = data.sha;
        }
        
        const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.productsPath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubConfig.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Failed to save products to GitHub:', error);
        return false;
    }
}

// GitHub Data Sync Functions for Orders
async function loadOrdersFromGitHub() {
    // Public read: only the repo is required, no token needed.
    if (!githubConfig.repo) {
        return false;
    }

    const data = await fetchDataFileFromGitHub(githubConfig.ordersPath);
    if (Array.isArray(data)) {
        orders = data;
        localStorage.setItem('bellestride_orders', JSON.stringify(orders)); // Update local cache
        return true;
    }
    console.log('No orders data on GitHub yet');
    return false;
}

async function saveOrdersToGitHub() {
    if (!githubConfig.repo || !githubConfig.token) {
        return false;
    }
    
    try {
        const content = encodeBase64Utf8(JSON.stringify(orders, null, 2));
        
        // First check if file exists
        const checkResponse = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.ordersPath}`, {
            headers: {
                'Authorization': `token ${githubConfig.token}`
            }
        });
        
        let body = {
            message: 'Update orders data',
            content: content,
            branch: githubConfig.branch
        };
        
        if (checkResponse.ok) {
            const data = await checkResponse.json();
            body.sha = data.sha;
        }
        
        const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.ordersPath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubConfig.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Failed to save orders to GitHub:', error);
        return false;
    }
}

// GitHub Configuration Functions
function saveGitHubConfig() {
    const tokenInput = document.getElementById('github-token');
    const token = tokenInput.value.trim();
    
    if (!token) {
        showNotification('Please enter a GitHub token', 'error');
        return;
    }
    
    githubConfig.token = token;
    localStorage.setItem('bellestride_github_token', token);
    
    // Auto-detect the full owner/repo slug
    githubConfig.repo = detectGitHubRepo();
    
    showNotification('GitHub configuration saved! Your data will now sync across devices.', 'success');
    updateGitHubStatus('Configuration saved. Sync enabled.', 'success');
}

function testGitHubConnection() {
    const statusDiv = document.getElementById('github-status');
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Testing connection...';
    
    const token = document.getElementById('github-token').value.trim() || githubConfig.token;
    
    if (!token) {
        statusDiv.innerHTML = '<span class="text-red-600"><i class="fas fa-times-circle mr-2"></i>Please enter a token first</span>';
        return;
    }
    
    // Test with GitHub API
    fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `token ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Invalid token');
    })
    .then(data => {
        statusDiv.innerHTML = `<span class="text-green-600"><i class="fas fa-check-circle mr-2"></i>Connected as ${data.login}</span>`;
        showNotification('GitHub connection successful!', 'success');
    })
    .catch(error => {
        statusDiv.innerHTML = '<span class="text-red-600"><i class="fas fa-times-circle mr-2"></i>Connection failed. Check your token.</span>';
        showNotification('GitHub connection failed. Please check your token.', 'error');
    });
}

function updateGitHubStatus(message, type) {
    const statusDiv = document.getElementById('github-status');
    const colorClass = type === 'success' ? 'text-green-600' : 'text-red-600';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-times-circle';
    statusDiv.innerHTML = `<span class="${colorClass}"><i class="fas ${icon} mr-2"></i>${message}</span>`;
}

// Load GitHub token from localStorage on startup
function loadGitHubConfig() {
    const savedToken = localStorage.getItem('bellestride_github_token');
    if (savedToken) {
        githubConfig.token = savedToken;
        const tokenInput = document.getElementById('github-token');
        if (tokenInput) {
            tokenInput.value = savedToken;
        }
    }
    
    // Auto-detect the full owner/repo slug
    githubConfig.repo = detectGitHubRepo();
}

// Preview logo on file selection
document.addEventListener('DOMContentLoaded', function() {
    const logoUpload = document.getElementById('logo-upload');
    if (logoUpload) {
        logoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('logo-preview');
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Initialize App
document.addEventListener('DOMContentLoaded', async function() {
    loadGitHubConfig();
    await loadFromLocalStorage();
    initializeSampleProducts();
    renderProducts();
    updateCartUI();
    loadAdminOrders();
    initializeLogo();
});

// Local Storage Management
async function saveToLocalStorage() {
    localStorage.setItem('bellestride_products', JSON.stringify(products));
    localStorage.setItem('bellestride_cart', JSON.stringify(cart));
    localStorage.setItem('bellestride_orders', JSON.stringify(orders));
    
    // Sync to GitHub if configured
    if (githubConfig.token && githubConfig.repo) {
        const productsSynced = await saveProductsToGitHub();
        const ordersSynced = await saveOrdersToGitHub();
        return { attempted: true, productsSynced, ordersSynced };
    }
    return { attempted: false, productsSynced: false, ordersSynced: false };
}

async function loadFromLocalStorage() {
    const savedProducts = localStorage.getItem('bellestride_products');
    const savedCart = localStorage.getItem('bellestride_cart');
    const savedOrders = localStorage.getItem('bellestride_orders');
    
    // Always attempt to load shared data from GitHub (public read, no token needed)
    let productsLoaded = false;
    let ordersLoaded = false;
    if (githubConfig.repo) {
        productsLoaded = await loadProductsFromGitHub();
        ordersLoaded = await loadOrdersFromGitHub();
    }
    productsLoadedFromGitHub = productsLoaded;
    
    // Fall back to localStorage / sample data only if the GitHub fetch failed
    if (!productsLoaded && savedProducts) {
        products = JSON.parse(savedProducts);
    }
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    if (!ordersLoaded && savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

// Initialize Sample Products
function initializeSampleProducts() {
    // Only seed sample products when there is no shared GitHub source.
    // If the shared products.json loaded (even as an empty list), respect it.
    if (products.length === 0 && !productsLoadedFromGitHub) {
        products = [
            {
                id: 1,
                name: "Elegant Pink Heels",
                price: 8500,
                category: "women",
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
                description: "Stunning pink heels perfect for special occasions"
            },
            {
                id: 2,
                name: "Rose Gold Sneakers",
                price: 12000,
                category: "women",
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
                description: "Premium sneakers with rose gold accents"
            },
            {
                id: 3,
                name: "Chic Ballet Flats",
                price: 6500,
                category: "women",
                image: "https://images.unsplash.com/photo-1525966226184-efb5ad2e5c6e?w=500&h=500&fit=crop",
                description: "Comfortable and stylish everyday flats"
            },
            {
                id: 4,
                name: "Designer Pumps",
                price: 7200,
                category: "women",
                image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
                description: "Classic pumps for professional elegance"
            },
            {
                id: 5,
                name: "Men's Classic Oxford",
                price: 9500,
                category: "men",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
                description: "Timeless leather oxford shoes for gentlemen"
            },
            {
                id: 6,
                name: "Men's Sports Sneakers",
                price: 7500,
                category: "men",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
                description: "Athletic sneakers for active lifestyle"
            },
            {
                id: 7,
                name: "Running Pro Shoes",
                price: 5500,
                category: "sports",
                image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop",
                description: "Professional running shoes with advanced cushioning"
            },
            {
                id: 8,
                name: "Training Sneakers",
                price: 4500,
                category: "sports",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
                description: "Versatile training shoes for all workouts"
            }
        ];
        saveToLocalStorage();
    }
}

// Product Management
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card cursor-pointer" onclick="showProductDetails(${product.id})">
            <div class="relative h-56 overflow-hidden bg-gradient-to-br from-pink-50 to-orange-50">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500">
                <div class="absolute top-3 right-3">
                    <span class="category-badge px-3 py-1 rounded-full text-xs font-medium capitalize">${product.category}</span>
                </div>
            </div>
            <div class="p-5">
                <h3 class="font-bold text-lg mb-2 text-gray-800">${product.name}</h3>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">${product.description || 'Premium quality shoes designed for elegance and comfort'}</p>
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-2xl font-bold price-tag">Ksh ${product.price.toLocaleString()}</span>
                    </div>
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" class="add-to-cart-btn text-white p-3 rounded-full hover:scale-110 transition-all">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-orange-400', 'from-pink-500', 'to-pink-600', 'from-gray-600', 'to-gray-700', 'from-orange-500', 'to-orange-600', 'text-white', 'shadow-lg', 'border-pink-500', 'border-gray-600', 'border-orange-500');
        btn.classList.add('bg-white', 'border-2');
    });
    
    // Reset all to default styles
    document.querySelectorAll('.filter-btn').forEach((btn, index) => {
        if (category === 'all' && index === 0) { // All button
            btn.classList.remove('bg-white', 'border-2');
            btn.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-orange-400', 'text-white', 'shadow-lg');
        } else if (category === 'women' && index === 1) { // For Her
            btn.classList.remove('bg-white', 'border-pink-200');
            btn.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-pink-600', 'text-white', 'border-pink-500');
        } else if (category === 'men' && index === 2) { // For Him
            btn.classList.remove('bg-white', 'border-gray-200');
            btn.classList.add('bg-gradient-to-r', 'from-gray-600', 'to-gray-700', 'text-white', 'border-gray-600');
        } else if (category === 'sports' && index === 3) { // Sports
            btn.classList.remove('bg-white', 'border-orange-200');
            btn.classList.add('bg-gradient-to-r', 'from-orange-500', 'to-orange-600', 'text-white', 'border-orange-500');
        }
    });
    
    renderProducts();
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="relative">
            <button onclick="closeProductModal()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                <i class="fas fa-times text-xl"></i>
            </button>
            <div class="md:flex">
                <div class="md:w-1/2">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-96 object-cover">
                </div>
                <div class="md:w-1/2 p-6">
                    <h2 class="text-2xl font-bold mb-4">${product.name}</h2>
                    <p class="text-gray-600 mb-6">${product.description || 'Premium quality shoes designed for comfort and style.'}</p>
                    <div class="mb-6">
                        <span class="text-3xl font-bold text-indigo-600">Ksh ${product.price.toLocaleString()}</span>
                    </div>
                    <div class="mb-6">
                        <span class="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm capitalize">${product.category}</span>
                    </div>
                    <button onclick="addToCart(${product.id}); closeProductModal();" class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-cart-plus mr-2"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveToLocalStorage();
    updateCartUI();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToLocalStorage();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveToLocalStorage();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count badge
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-semibold">${item.name}</h4>
                        <p class="text-indigo-600 font-bold">Ksh ${item.price.toLocaleString()}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center space-x-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">-</button>
                        <span class="font-semibold">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">+</button>
                    </div>
                    <span class="font-bold">Ksh ${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    cartTotal.textContent = `Ksh ${totalPrice.toLocaleString()}`;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('translate-x-full');
}

// Checkout Process
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    const summary = document.getElementById('checkout-summary');
    const total = document.getElementById('checkout-total');
    
    // Update checkout summary
    summary.innerHTML = cart.map(item => `
        <div class="flex justify-between text-sm">
            <span>${item.name} x${item.quantity}</span>
            <span>Ksh ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    total.textContent = `Ksh ${totalPrice.toLocaleString()}`;
    
    modal.classList.remove('hidden');
    toggleCart();
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

async function placeOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const orderData = {
        id: Date.now(),
        customerName: form[0].value,
        phoneNumber: form[1].value,
        location: form[2].value,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending',
        statusHistory: [{
            status: 'pending',
            timestamp: new Date().toISOString()
        }]
    };
    
    orders.push(orderData);
    await saveToLocalStorage();
    
    // Show confirmation
    showOrderConfirmation(orderData);
    
    // Clear cart and close modal
    cart = [];
    await saveToLocalStorage();
    updateCartUI();
    closeCheckoutModal();
    form.reset();
}

function showOrderConfirmation(order) {
    const modal = document.getElementById('confirmation-modal');
    const details = document.getElementById('order-details');
    
    details.innerHTML = `
        <p class="text-sm"><strong>Order ID:</strong> #${order.id}</p>
        <p class="text-sm"><strong>Name:</strong> ${order.customerName}</p>
        <p class="text-sm"><strong>Phone:</strong> ${order.phoneNumber}</p>
        <p class="text-sm"><strong>Location:</strong> ${order.location}</p>
        <p class="text-sm"><strong>Total:</strong> Ksh ${order.total.toLocaleString()}</p>
        <p class="text-sm"><strong>Items:</strong> ${order.items.length} product(s)</p>
    `;
    
    modal.classList.remove('hidden');
}

function closeConfirmationModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
}

// Admin Panel
function showAdminPanel() {
    document.getElementById('admin-panel').classList.remove('hidden');
}

function closeAdminPanel() {
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-content').classList.add('hidden');
    document.getElementById('admin-password').value = '';
}

function loginAdmin() {
    const password = document.getElementById('admin-password').value;
    if (password === 'Jillian') {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        loadAdminProducts();
        loadAdminOrders();
    } else {
        showNotification('Invalid password!', 'error');
    }
}

async function addProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const imageUrl = formData.get('image');
    
    // Validate image
    if (!imageUrl) {
        showNotification('Please select or upload an image', 'error');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name: formData.get('name'),
        price: parseInt(formData.get('price')),
        category: formData.get('category'),
        image: imageUrl,
        description: formData.get('description')
    };
    
    products.push(newProduct);
    const sync = await saveToLocalStorage(); // Immediate persistence with GitHub sync
    renderProducts();
    loadAdminProducts();

    if (sync.attempted && sync.productsSynced) {
        showNotification('Product added and published! It will appear for everyone within ~1 minute.', 'success');
    } else if (sync.attempted) {
        showNotification('Saved locally but publishing to GitHub failed. Check your token has "repo" scope and is still valid.', 'error');
    } else {
        showNotification('Saved locally only. Add your GitHub token in the admin GitHub settings to publish it online.', 'error');
    }
    form.reset();
    clearImage(); // Clear image preview
}

function loadAdminProducts() {
    const container = document.getElementById('admin-products-list');
    if (products.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No products added yet</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="flex items-center space-x-3 mb-3">
                <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg border-2 border-gray-200">
                <div class="flex-1">
                    <h4 class="font-bold text-lg text-gray-800">${product.name}</h4>
                    <p class="text-sm font-semibold text-indigo-600">Ksh ${product.price.toLocaleString()}</p>
                    <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mt-1 capitalize">${product.category}</span>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="deleteProduct(${product.id})" class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-semibold">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>
            </div>
        </div>
    `).join('');
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        products = products.filter(p => p.id !== productId);
        const sync = await saveToLocalStorage(); // Immediate persistence with GitHub sync
        renderProducts(); // Update main display
        loadAdminProducts(); // Update admin display

        if (sync.attempted && sync.productsSynced) {
            showNotification('Product deleted. The change will reflect for everyone within ~1 minute.', 'success');
        } else if (sync.attempted) {
            showNotification('Deleted locally but publishing to GitHub failed. Check your token has "repo" scope.', 'error');
        } else {
            showNotification('Deleted locally only. Add your GitHub token in the admin GitHub settings to publish the change.', 'error');
        }
    }
}

function loadAdminOrders() {
    const ordersList = document.getElementById('admin-orders-list');
    // Filter out completed orders - they should disappear when marked as complete
    const activeOrders = orders.filter(order => order.status !== 'completed');
    
    if (activeOrders.length === 0) {
        ordersList.innerHTML = '<p class="text-gray-500">No active orders</p>';
        return;
    }
    
    ordersList.innerHTML = activeOrders.map(order => `
        <div class="border rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h4 class="font-semibold mb-1">Order #${order.id}</h4>
                    <span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}">
                        ${getStatusText(order.status)}
                    </span>
                </div>
                <select onchange="updateOrderStatus(${order.id}, this.value)" class="px-2 py-1 border rounded text-sm">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
            <p class="text-sm text-gray-600">Customer: ${order.customerName}</p>
            <p class="text-sm text-gray-600">Phone: ${order.customerPhone}</p>
            <p class="text-sm text-gray-600">Location: ${order.location}</p>
            <p class="text-sm text-gray-600">Total: Ksh ${order.total.toLocaleString()}</p>
            <p class="text-sm text-gray-600">Date: ${new Date(order.date).toLocaleString()}</p>
            ${order.notes ? `<p class="text-sm text-blue-600 mt-2"><strong>Notes:</strong> ${order.notes}</p>` : ''}
            <div class="mt-2">
                <strong>Items:</strong>
                <ul class="list-disc list-inside text-sm">
                    ${order.items.map(item => `
                        <li>${item.name} x${item.quantity} - Ksh ${item.price.toLocaleString()}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="mt-3">
                <input type="text" placeholder="Add notes..." class="w-full px-2 py-1 border rounded text-sm" 
                       onblur="addOrderNote(${order.id}, this.value)">
            </div>
        </div>
    `).join('');
}

function getStatusStyle(status) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || styles.pending;
}

function getStatusText(status) {
    const texts = {
        pending: 'Order Received',
        confirmed: 'Order Confirmed',
        processing: 'Preparing Order',
        completed: 'Order Delivered',
        cancelled: 'Order Cancelled'
    };
    return texts[status] || 'Order Received';
}

async function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        order.statusHistory = order.statusHistory || [];
        order.statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString()
        });
        await saveToLocalStorage();
        
        if (newStatus === 'completed') {
            showNotification(`Order #${orderId} marked as completed and removed from active orders`, 'success');
        } else {
            showNotification(`Order #${orderId} updated to ${getStatusText(newStatus)}`, 'success');
        }
        
        loadAdminOrders();
    }
}

async function addOrderNote(orderId, note) {
    const order = orders.find(o => o.id === orderId);
    if (order && note.trim()) {
        order.notes = note.trim();
        await saveToLocalStorage();
        loadAdminOrders();
        showNotification('Note added to order', 'success');
    }
}

// Image Upload Functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification('Image size must be less than 10MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            showImagePreview(e.target.result);
            // Convert to base64 and store
            document.getElementById('image-url').value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleUrlInput(url) {
    if (url && isValidImageUrl(url)) {
        showImagePreview(url);
    } else {
        hideImagePreview();
    }
}

function showImagePreview(src) {
    const preview = document.getElementById('image-preview');
    const img = document.getElementById('preview-img');
    img.src = src;
    preview.classList.remove('hidden');
}

function hideImagePreview() {
    document.getElementById('image-preview').classList.add('hidden');
}

function clearImage() {
    document.getElementById('image-file').value = '';
    document.getElementById('image-url').value = '';
    hideImagePreview();
}

function isValidImageUrl(url) {
    try {
        new URL(url);
        return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
    } catch {
        return false;
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg text-white z-50 fade-in ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
document.getElementById('product-modal').addEventListener('click', function(e) {
    if (e.target === this) closeProductModal();
});

document.getElementById('checkout-modal').addEventListener('click', function(e) {
    if (e.target === this) closeCheckoutModal();
});

document.getElementById('confirmation-modal').addEventListener('click', function(e) {
    if (e.target === this) closeConfirmationModal();
});

document.getElementById('admin-panel').addEventListener('click', function(e) {
    if (e.target === this) closeAdminPanel();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProductModal();
        closeCheckoutModal();
        closeConfirmationModal();
        closeAdminPanel();
    }
});
