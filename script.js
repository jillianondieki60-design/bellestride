// Bellestride E-commerce App JavaScript

// Data Storage
let products = [];
let cart = [];
let orders = [];
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    initializeSampleProducts();
    renderProducts();
    updateCartUI();
});

// Local Storage Management
function saveToLocalStorage() {
    localStorage.setItem('bellestride_products', JSON.stringify(products));
    localStorage.setItem('bellestride_cart', JSON.stringify(cart));
    localStorage.setItem('bellestride_orders', JSON.stringify(orders));
}

function loadFromLocalStorage() {
    const savedProducts = localStorage.getItem('bellestride_products');
    const savedCart = localStorage.getItem('bellestride_cart');
    const savedOrders = localStorage.getItem('bellestride_orders');
    
    if (savedProducts) products = JSON.parse(savedProducts);
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedOrders) orders = JSON.parse(savedOrders);
}

// Initialize Sample Products
function initializeSampleProducts() {
    if (products.length === 0) {
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
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
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

function placeOrder(event) {
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
        status: 'pending'
    };
    
    orders.push(orderData);
    saveToLocalStorage();
    
    // Show confirmation
    showOrderConfirmation(orderData);
    
    // Clear cart and close modal
    cart = [];
    saveToLocalStorage();
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

function addProduct(event) {
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
    saveToLocalStorage();
    renderProducts();
    loadAdminProducts();
    
    showNotification('Product added successfully!');
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

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveToLocalStorage();
        renderProducts();
        loadAdminProducts();
        showNotification('Product deleted successfully!');
    }
}

function loadAdminOrders() {
    const container = document.getElementById('orders-list');
    const recentOrders = orders.slice(-5).reverse();
    
    if (recentOrders.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No orders yet</p>';
    } else {
        container.innerHTML = recentOrders.map(order => `
            <div class="bg-white border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold">Order #${order.id}</h4>
                        <p class="text-sm text-gray-600">${order.customerName} - ${order.phoneNumber}</p>
                        <p class="text-sm text-gray-600">${order.location} - Ksh ${order.total.toLocaleString()}</p>
                    </div>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">${order.status}</span>
                </div>
                <p class="text-xs text-gray-500">${new Date(order.date).toLocaleString()}</p>
            </div>
        `).join('');
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
