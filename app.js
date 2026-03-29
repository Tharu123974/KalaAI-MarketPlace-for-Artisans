// DOM Elements
document.addEventListener('DOMContentLoaded', () => {

    // Theme Switcher Logic
    const themeSelect = document.getElementById('theme-switch');
    if(themeSelect) {
        // Load saved theme
        const savedTheme = localStorage.getItem('kala-theme') || 'orange';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeSelect.value = savedTheme;

        // Change theme Event
        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('kala-theme', newTheme);
        });
    } else {
        // If no select element, at least apply the saved theme
        const savedTheme = localStorage.getItem('kala-theme') || 'orange';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // AI Generation Form Simulation
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = document.getElementById('generate-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Magic...';
            submitBtn.disabled = true;
            document.getElementById('loading-overlay').classList.add('active');

            // Simulate AI processing delay (2.5 seconds)
            setTimeout(() => {
                // Collect basic info to pass (optional, using localStorage for simplicity)
                const productName = document.getElementById('product-name').value;
                const category = document.getElementById('category').value;
                
                localStorage.setItem('recentGenName', productName);
                localStorage.setItem('recentGenCategory', category);

                // Redirect to results
                window.location.href = 'results.html';
            }, 2500);
        });
    }

    // Results Page - Copying logic
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const icon = e.currentTarget.querySelector('i');
                const originalIcon = icon.className;
                
                icon.className = 'fas fa-check text-green-600';
                e.currentTarget.innerHTML = `<i class="fas fa-check"></i> Copied!`;
                
                setTimeout(() => {
                    e.currentTarget.innerHTML = `<i class="${originalIcon}"></i> Copy`;
                }, 2000);
            });
        });
    });

    // File Upload Preview
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    
    if (imageUpload && imagePreview) {
        imageUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.addEventListener('load', function() {
                    imagePreview.innerHTML = `<img src="${this.result}" alt="Preview" style="max-height: 200px; border-radius: 8px;">`;
                });
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Dark Mode Toggle ---
    const navLinksList = document.querySelector('.nav-links');
    if(navLinksList) {
        const modeLi = document.createElement('li');
        const savedMode = localStorage.getItem('kala-mode') || 'light';
        document.documentElement.setAttribute('data-mode', savedMode);
        
        modeLi.innerHTML = `<button id="mode-toggle" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.85rem; height: 32px; border-color: var(--border); margin-top: -3px;" title="Toggle Light/Dark Mode">
            <i class="fas ${savedMode === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
        </button>`;
        navLinksList.appendChild(modeLi);

        document.getElementById('mode-toggle').addEventListener('click', (e) => {
            const currentMode = document.documentElement.getAttribute('data-mode');
            const newMode = currentMode === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-mode', newMode);
            localStorage.setItem('kala-mode', newMode);
            
            const icon = e.currentTarget.querySelector('i');
            icon.className = `fas ${newMode === 'dark' ? 'fa-sun' : 'fa-moon'}`;
        });

        // --- Cart Icon Injection ---
        const cartLi = document.createElement('li');
        cartLi.innerHTML = `<a href="javascript:void(0)" onclick="toggleCart()" style="position:relative; font-size: 1.1rem; top: 3px;" class="text-muted"><i class="fas fa-shopping-cart"></i><span id="cart-count" style="position:absolute; top:-10px; right:-12px; background:var(--primary); color:white; border-radius:50%; padding:2px 6px; font-size:0.7rem; font-weight: bold;">0</span></a>`;
        navLinksList.appendChild(cartLi);
        updateCartCount();
        injectCartDrawer();
    }

    // --- Auth Guards ---
    const userRole = localStorage.getItem('kala-role');
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';

    // Guard Upload Page
    if(window.location.pathname.includes('upload.html')) {
        if(!isLoggedIn || userRole !== 'seller') {
            document.body.style.display = 'none'; // hide immediately
            showToast('Only authenticated Artisans/Sellers can generate listings.', 'error');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
        }
    }

    // --- E-Commerce Marketplace Logic ---
    initMarketplace();

    if(window.location.pathname.includes('shop.html')) {
        renderProducts();
    }
    
    if(window.location.pathname.includes('product.html')) {
        renderProductPage();
    }

});

// Initialize dummy products if empty or containing old links
function initMarketplace() {
    const existing = localStorage.getItem('kala-products');
    if(!existing || existing.includes('unsplash') || !existing.includes('story')) {
        const dummyProducts = [
            {
                id: 1,
                title: 'Hand-Painted Azure Jaipur Pottery Vase',
                price: '$45.00',
                artisan: 'Jaipur Craft House',
                image: 'pottery.png',
                story: 'A magnificent piece depicting the traditional blue pottery art of Jaipur. Made with quartz stone powder, powdered glass, and brilliantly hued in cobalt blue, preserving a 14th-century craft.'
            },
            {
                id: 2,
                title: 'Authentic Handwoven Banarasi Silk Saree',
                price: '$120.00',
                artisan: 'Varanasi Weavers Co.',
                image: 'saree.png',
                story: 'Woven in the holy city of Varanasi, this silk saree features intricate gold zari brocade. It takes artisans up to a fortnight to weave, symbolizing centuries of royal Indian textile heritage.'
            },
            {
                id: 3,
                title: 'Intricately Carved Rosewood Elephant',
                price: '$65.00',
                artisan: 'Mysore Woodworks',
                image: 'elephant.png',
                story: 'Masterfully carved from a single block of dark rosewood by the artisans of Mysore. The detailed floral motifs on the back mimic the royal ceremonial elephants of ancient Indian kingdoms.'
            }
        ];
        localStorage.setItem('kala-products', JSON.stringify(dummyProducts));
    }
}

// Render products to shop grid
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;

    const products = JSON.parse(localStorage.getItem('kala-products') || '[]');
    grid.innerHTML = '';

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}" class="product-img">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-artisan" style="margin-bottom: 8px;"><i class="fas fa-store"></i> ${p.artisan}</div>
                <div class="product-story" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; font-style: italic;">"${p.story || 'An authentic handcrafted piece with a rich cultural heritage.'}"</div>
                <div class="product-bottom" style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
                    <div class="product-price" style="margin-bottom: 5px;">${p.price}</div>
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <button class="btn btn-secondary" style="flex: 1; padding: 8px;" onclick="addToCart('${p.title.replace(/'/g, "\\'")}', '${p.price}', '${p.image}')"><i class="fas fa-cart-plus"></i> Add</button>
                        <button class="btn btn-primary" style="flex: 1; padding: 8px;" onclick="viewProduct('${p.title.replace(/'/g, "\\'")}', '${p.price}', '${p.image}', '${p.artisan.replace(/'/g, "\\'")}', '${(p.story || '').replace(/'/g, "\\'")}')"><i class="fas fa-eye"></i> View details</button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Publish current AI listing to store
window.publishListing = function() {
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';
    const role = localStorage.getItem('kala-role');
    
    if(!isLoggedIn || role !== 'seller') {
        showToast('Only Artisans can publish products.', 'error');
        return;
    }

    const titleEl = document.getElementById('out-title');
    const storyEl = document.getElementById('out-story');
    if(!titleEl) return;

    let storyText = 'A beautifully generated artisan craft.';
    if(storyEl) {
        storyText = storyEl.innerText;
    }

    const newProduct = {
        id: Date.now(),
        title: titleEl.innerText,
        price: '$50.00', // Mock extracted price
        artisan: 'Your Store',
        image: 'pottery.png', // Default mock image
        story: storyText
    };

    const products = JSON.parse(localStorage.getItem('kala-products') || '[]');
    products.unshift(newProduct);
    localStorage.setItem('kala-products', JSON.stringify(products));

    showToast('Listing successfully published to Marketplace!', 'success');
    setTimeout(() => window.location.href = 'shop.html', 1500);
}

// Global Custom Toast function
window.showToast = function(message, type = 'success') {
    let container = document.getElementById('custom-toast-container');
    if(!container) {
        container = document.createElement('div');
        container.id = 'custom-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    
    let icon = type === 'error' ? 'fa-exclamation-circle text-secondary' : 'fa-check-circle text-green-600';
    if(type === 'success') icon = 'fa-check-circle'
    
    toast.innerHTML = `<i class="fas ${icon}" style="font-size: 1.5rem;"></i> <div>${message}</div>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Global Buy Action
window.buyProduct = function() {
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';
    const role = localStorage.getItem('kala-role');

    if(!isLoggedIn) {
        showToast('Please login to your account to buy products.', 'error');
        setTimeout(() => window.location.href = 'auth.html', 1500);
        return;
    }
    
    if(role !== 'buyer') {
        showToast('Only Customer accounts can make purchases.', 'error');
        return;
    }

    showToast('Processing your secure purchase...', 'success');
}

// Global Add to Cart
window.addToCart = function(title = 'Custom Artisan Item', price = '$50.00', image = 'pottery.png') {
    let cart = JSON.parse(localStorage.getItem('kala-cart-items') || '[]');
    cart.push({ id: Date.now(), title, price, image });
    localStorage.setItem('kala-cart-items', JSON.stringify(cart));
    
    updateCartCount();
    showToast('Product added to your cart.', 'success');
}

window.updateCartCount = function() {
    const el = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('kala-cart-items') || '[]');
    if(el) {
        el.innerText = cart.length;
    }
    renderCartItems();
}

window.injectCartDrawer = function() {
    if(document.getElementById('cart-drawer')) return;
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="cart-overlay" class="cart-overlay" onclick="toggleCart()"></div>
        <div id="cart-drawer" class="cart-drawer">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="close-btn" onclick="toggleCart()">&times;</button>
            </div>
            <div class="cart-items" id="cart-items-container">
            </div>
            <div class="cart-footer">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: bold; font-size: 1.1rem; color: var(--text-main);">
                    <span>Total:</span>
                    <span id="cart-total-price">$0.00</span>
                </div>
                <button class="btn btn-primary" style="width:100%" onclick="checkoutCart()">Checkout Securely</button>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);
}

window.toggleCart = function() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if(drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
        renderCartItems();
    }
}

window.renderCartItems = function() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    if(!container) return;

    const cart = JSON.parse(localStorage.getItem('kala-cart-items') || '[]');
    container.innerHTML = '';
    
    if(cart.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align: center; margin-top: 50px;">Your cart is empty.</p>';
        if(totalEl) totalEl.innerText = '$0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        total += numericPrice;
        
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <button class="cart-item-remove" onclick="removeCartItem(${item.id})">Remove</button>
                </div>
            </div>
        `;
    });
    
    if(totalEl) totalEl.innerText = '$' + total.toFixed(2);
}

window.removeCartItem = function(id) {
    let cart = JSON.parse(localStorage.getItem('kala-cart-items') || '[]');
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('kala-cart-items', JSON.stringify(cart));
    updateCartCount();
}

window.checkoutCart = function() {
    const cart = JSON.parse(localStorage.getItem('kala-cart-items') || '[]');
    if(cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Check Guard
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';
    const userRole = localStorage.getItem('kala-role');
    
    if(!isLoggedIn || userRole !== 'buyer') {
        showToast('Please login as a Customer to checkout.', 'error');
        setTimeout(() => window.location.href = 'auth.html', 1500);
    } else {
        showToast('Processing advanced checkout...', 'success');
        localStorage.removeItem('kala-cart-items');
        updateCartCount();
        setTimeout(() => toggleCart(), 1500);
    }
}

// Global Product View Redirect Mapping
window.viewProduct = function(title, price, image, artisan, story) {
    const prod = { title, price, image, artisan, story };
    localStorage.setItem('kala-current-product', JSON.stringify(prod));
    window.location.href = 'product.html';
}

window.renderProductPage = function() {
    const prod = JSON.parse(localStorage.getItem('kala-current-product'));
    if(!prod) return;
    
    document.getElementById('tpl-title').innerText = prod.title;
    document.getElementById('tpl-price').innerText = prod.price;
    document.getElementById('tpl-img').src = prod.image;
    document.getElementById('tpl-artisan').innerHTML = `<i class="fas fa-store"></i> ${prod.artisan}`;
    document.getElementById('tpl-story').innerText = prod.story || 'An authentic handcrafted piece with a rich cultural heritage.';
}

window.checkCreatorGuard = function() {
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';
    const userRole = localStorage.getItem('kala-role');
    if(!isLoggedIn || userRole !== 'seller') {
        showToast('Only authenticated Artisans/Sellers can generate listings.', 'error');
        setTimeout(() => window.location.href = 'auth.html', 2000);
    } else {
        window.location.href = 'upload.html';
    }
}
