// DOM Elements
document.addEventListener('DOMContentLoaded', () => {

    const themeSelect = document.getElementById('theme-switch');
    if(themeSelect) {
        // Populate new themes dynamically
        const themes = [
            {val: 'orange', label: '🟠 Orange'},
            {val: 'blue', label: '🔵 Blue'},
            {val: 'green', label: '🟢 Green'},
            {val: 'red', label: '🔴 Red'},
            {val: 'pink', label: '🌺 Pink'},
            {val: 'violet', label: '💜 Violet'},
            {val: 'yellow', label: '☀️ Yellow'},
            {val: 'teal', label: '🌊 Teal'},
            {val: 'sandal', label: '🪔 Sandal'},
            {val: 'wood', label: '🪵 Wood'},
            {val: 'gradient-sunset', label: '🌅 Sunset'}
        ];
        themeSelect.innerHTML = themes.map(t => `<option value="${t.val}">${t.label}</option>`).join('');

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
                
                // BACKEND INTEGRATION: Instead of saving to localStorage, send a POST request to the backend
                // e.g., fetch('/api/generate', { method: 'POST', body: JSON.stringify({ productName, category }) })
                // to trigger the actual AI generation process and return the result.
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
    // BACKEND INTEGRATION: Replace localStorage checks with proper session validation
    // or token verification (e.g., decoding a JWT from cookies or Authorization header) via an API endpoint.
    const userRole = localStorage.getItem('kala-role');
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';

    // Update Login link to Logout if logged in
    const authLinks = document.querySelectorAll('.nav-links li a[href="auth.html"]');
    if (isLoggedIn) {
        authLinks.forEach(link => {
            link.innerText = 'Logout';
            link.href = '#';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('kala-loggedin');
                localStorage.removeItem('kala-role');
                localStorage.removeItem('kala-username');
                localStorage.removeItem('kala-email');
                window.location.href = 'index.html';
            });
            
            // Add Profile link before Logout
            const profileLi = document.createElement('li');
            profileLi.innerHTML = `<a href="profile.html">Profile</a>`;
            link.parentElement.parentNode.insertBefore(profileLi, link.parentElement);
        });
    }

    // Form Star Rating Interactions
    ['review-stars-input', 'prod-stars-input'].forEach(id => {
        const starContainer = document.getElementById(id);
        if(starContainer) {
            const stars = starContainer.querySelectorAll('i');
            const hiddenInput = document.getElementById(id.replace('stars-input', 'rating-value'));
            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    const rating = parseInt(e.target.getAttribute('data-rating'));
                    if(hiddenInput) hiddenInput.value = rating;
                    
                    stars.forEach((s, index) => {
                        if(index < rating) {
                            s.className = 'fas fa-star';
                        } else {
                            s.className = 'far fa-star';
                        }
                    });
                });
            });
        }
    });

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
        
        // Add View Toggle listeners
        const cardBtn = document.getElementById('card-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        if(cardBtn && listBtn) {
            cardBtn.addEventListener('click', () => {
                localStorage.setItem('kala-shop-view', 'grid');
                cardBtn.classList.add('active');
                listBtn.classList.remove('active');
                renderProducts();
            });
            listBtn.addEventListener('click', () => {
                localStorage.setItem('kala-shop-view', 'list');
                listBtn.classList.add('active');
                cardBtn.classList.remove('active');
                renderProducts();
            });
            
            // Set initial active state
            const currentView = localStorage.getItem('kala-shop-view') || 'grid';
            if(currentView === 'list') {
                listBtn.classList.add('active');
            } else {
                cardBtn.classList.add('active');
            }
        }
    }
    
    if(window.location.pathname.includes('product.html')) {
        renderProductPage();
    }
});

// Helper for average ratings
window.getRatingData = function(productId) {
    const allReviews = JSON.parse(localStorage.getItem('kala-reviews') || '{}');
    const reviews = allReviews[productId] || [];
    if(reviews.length === 0) return null;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => dist[r.rating]++);
    return {
        average: (sum / reviews.length).toFixed(1),
        count: reviews.length,
        distribution: dist
    };
}

// Track Purchase after successful buy
window.recordPurchase = function(productIds) {
    const username = localStorage.getItem('kala-username') || 'Demo Customer';
    let purchased = JSON.parse(localStorage.getItem('kala-purchases') || '[]');
    const products = JSON.parse(localStorage.getItem('kala-products') || '[]');
    
    productIds.forEach(id => {
        const p = products.find(prod => prod.id === id);
        if(p) {
            purchased.push({
                productId: p.id,
                title: p.title,
                price: p.price,
                image: p.image,
                date: new Date().toLocaleDateString(),
                user: username
            });
        }
    });
    localStorage.setItem('kala-purchases', JSON.stringify(purchased));
}

// Initialize dummy products if empty or containing old links
function initMarketplace() {
    // BACKEND INTEGRATION: Fetch products from the backend database (e.g., GET /api/products)
    // instead of seeding mock data into localStorage.
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
    
    const viewMode = localStorage.getItem('kala-shop-view') || 'grid';
    if(viewMode === 'list') {
        grid.className = 'product-grid list-view';
    } else {
        grid.className = 'grid-3 mb-4';
    }
    
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';
    const role = localStorage.getItem('kala-role');
    const username = localStorage.getItem('kala-username') || 'Your Store';

    products.forEach(p => {
        const ratingData = getRatingData(p.id);
        const ratingHtml = ratingData ? `<div class="rating-badge"><i class="fas fa-star"></i> ${ratingData.average} <span style="font-size: 0.75rem; color: var(--text-muted); opacity: 0.7">(${ratingData.count})</span></div>` : '';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let actionButtons = `
            <button class="btn btn-secondary" style="flex: 1; min-width: 100px; padding: 8px;" onclick="addToCart('${(p.title || '').replace(/'/g, "\\'")}', '${p.price}', '${p.image}')"><i class="fas fa-cart-plus"></i> Add</button>
            <button class="btn btn-primary" style="flex: 1; min-width: 100px; padding: 8px;" onclick="viewProduct(${p.id})"><i class="fas fa-eye"></i> View details</button>
        `;

        if (isLoggedIn && role === 'seller' && (p.artisan === username || p.artisan === 'Your Store')) {
             actionButtons += `
                 <button class="btn" style="flex: 1; min-width: 100%; padding: 8px; background-color: var(--secondary); color: white; border: none; margin-top: 10px;" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i> Delete</button>
             `;
        }

        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}" class="product-img">
            <div class="product-info">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div class="product-title">${p.title}</div>
                    ${ratingHtml}
                </div>
                <div class="product-artisan" style="margin-bottom: 8px;"><i class="fas fa-store"></i> ${p.artisan}</div>
                <div class="product-story" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; font-style: italic;">"${p.story || 'An authentic handcrafted piece with a rich cultural heritage.'}"</div>
                <div class="product-bottom" style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
                    <div class="product-price" style="margin-bottom: 5px;">${p.price}</div>
                    <div style="display: flex; gap: 10px; width: 100%; flex-wrap: wrap;">
                        ${actionButtons}
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.deleteProduct = function(id) {
    if(!confirm("Are you sure you want to delete this item?")) return;
    let products = JSON.parse(localStorage.getItem('kala-products') || '[]');
    products = products.filter(p => p.id !== id);
    localStorage.setItem('kala-products', JSON.stringify(products));
    showToast('Product deleted successfully.', 'success');
    renderProducts();
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
    const priceEl = document.getElementById('out-price');
    const descEl = document.getElementById('out-desc');
    if(!titleEl) return;

    let storyText = 'A beautifully generated artisan craft.';
    if(storyEl) {
        storyText = storyEl.innerText;
    }

    const newProduct = {
        id: Date.now(),
        title: titleEl.innerText,
        price: priceEl ? priceEl.value : '$50.00',
        artisan: localStorage.getItem('kala-username') || 'Your Store',
        image: 'pottery.png', // Default mock image
        story: storyText,
        description: descEl ? descEl.innerText : ''
    };

    // BACKEND INTEGRATION: Submit the new product to the backend API
    // e.g., fetch('/api/products', { method: 'POST', body: JSON.stringify(newProduct) })
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

    const currentProd = JSON.parse(localStorage.getItem('kala-current-product'));
    if(currentProd) {
        recordPurchase([currentProd.id]);
    }
    showToast('Processing your secure purchase...', 'success');
}

// Global Add to Cart
window.addToCart = function(title = 'Custom Artisan Item', price = '$50.00', image = 'pottery.png') {
    // BACKEND INTEGRATION: For authenticated users, sync the cart with the server
    // e.g., fetch('/api/cart/add', { method: 'POST', body: JSON.stringify({ title, price, image }) })
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
    // BACKEND INTEGRATION: Call the server to remove the item
    // e.g., fetch(`/api/cart/${id}`, { method: 'DELETE' })
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
        // Record all items in the cart as purchased
        const products = JSON.parse(localStorage.getItem('kala-products') || '[]');
        const purchasedIds = [];
        cart.forEach(item => {
            const p = products.find(prod => prod.title === item.title);
            if(p) purchasedIds.push(p.id);
        });
        recordPurchase(purchasedIds);
        
        showToast('Processing advanced checkout...', 'success');
        // BACKEND INTEGRATION: Process the order via backend and payment gateway (Stripe, Razorpay, etc.)
        // e.g., fetch('/api/checkout', { method: 'POST', body: JSON.stringify(cart) })
        localStorage.removeItem('kala-cart-items');
        updateCartCount();
        setTimeout(() => toggleCart(), 1500);
    }
}

// Global Product View Redirect Mapping
window.viewProduct = function(id) {
    const products = JSON.parse(localStorage.getItem('kala-products') || '[]');
    const prod = products.find(p => p.id === id);
    if(prod) {
        localStorage.setItem('kala-current-product', JSON.stringify(prod));
        window.location.href = 'product.html';
    } else {
        showToast('Product details not found!', 'error');
    }
}

window.renderProductPage = function() {
    const prod = JSON.parse(localStorage.getItem('kala-current-product'));
    if(!prod) return;
    
    const ratingData = getRatingData(prod.id);
    const avgHtml = ratingData ? `<span class="rating-badge" style="font-size: 1.1rem; vertical-align: middle;">Rating ${ratingData.average} / 5 <i class="fas fa-star"></i> <span style="font-size: 0.8rem; font-weight: normal; opacity: 0.7">(${ratingData.count} reviews)</span></span>` : '';
    
    document.getElementById('tpl-title').innerText = prod.title;
    document.getElementById('tpl-price').innerText = prod.price;
    document.getElementById('tpl-img').src = prod.image;
    document.getElementById('tpl-artisan').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <span><i class="fas fa-store"></i> ${prod.artisan}</span>
            ${avgHtml}
        </div>
    `;
    document.getElementById('tpl-story').innerText = prod.story || 'An authentic handcrafted piece with a rich cultural heritage.';
    
    // Check and render rating bar graph
    if(ratingData) {
        let barsHtml = `
            <div class="rating-distribution">
                <div style="font-weight: bold; margin-bottom: 15px;">Rating distribution</div>
        `;
        for(let star=5; star>=1; star--) {
            const pct = ratingData.count > 0 ? (ratingData.distribution[star] / ratingData.count) * 100 : 0;
            barsHtml += `
                <div class="rating-row">
                    <span class="star-num">${star}</span>
                    <div class="rating-bar-bg">
                        <div class="rating-bar-fill" style="width: ${pct}%"></div>
                    </div>
                    <span class="rating-count">${ratingData.distribution[star]}</span>
                </div>
            `;
        }
        barsHtml += `</div>`;
        const storyEl = document.getElementById('tpl-story');
        if(storyEl) {
             const existingDist = document.getElementById('prod-rating-dist');
             if(existingDist) existingDist.remove();
             const div = document.createElement('div');
             div.id = 'prod-rating-dist';
             div.innerHTML = barsHtml;
             storyEl.parentNode.insertBefore(div, storyEl.nextSibling);
        }
    }
    
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';
    const role = localStorage.getItem('kala-role');
    const username = localStorage.getItem('kala-username') || 'Your Store';
    
    if(isLoggedIn && role === 'seller' && (prod.artisan === username || prod.artisan === 'Your Store')) {
        const editSection = document.getElementById('edit-product-section');
        if(editSection) editSection.style.display = 'block';
    }
    
    if(window.renderReviews) {
        renderReviews(prod.id);
    }
}

window.toggleEditMode = function() {
    const isEdit = document.getElementById('tpl-title').isContentEditable;
    if(isEdit) return; // already in edit mode
    
    document.getElementById('tpl-title').contentEditable = true;
    document.getElementById('tpl-title').style.borderBottom = "1px dashed var(--primary)";
    
    document.getElementById('tpl-price').contentEditable = true;
    document.getElementById('tpl-price').style.borderBottom = "1px dashed var(--primary)";
    
    document.getElementById('tpl-story').contentEditable = true;
    document.getElementById('tpl-story').style.border = "1px dashed var(--primary)";
    
    document.getElementById('toggle-edit-btn').style.display = 'none';
    document.getElementById('save-product-btn').style.display = 'block';
}

window.saveProductEdits = function() {
    const prod = JSON.parse(localStorage.getItem('kala-current-product'));
    if(!prod) return;
    
    prod.title = document.getElementById('tpl-title').innerText;
    prod.price = document.getElementById('tpl-price').innerText;
    prod.story = document.getElementById('tpl-story').innerText;
    
    localStorage.setItem('kala-current-product', JSON.stringify(prod));
    
    let products = JSON.parse(localStorage.getItem('kala-products') || '[]');
    let index = products.findIndex(p => p.id === prod.id);
    if(index !== -1) {
        products[index] = prod;
        localStorage.setItem('kala-products', JSON.stringify(products));
    }
    
    document.getElementById('tpl-title').contentEditable = false;
    document.getElementById('tpl-title').style.borderBottom = "none";
    
    document.getElementById('tpl-price').contentEditable = false;
    document.getElementById('tpl-price').style.borderBottom = "none";
    
    document.getElementById('tpl-story').contentEditable = false;
    document.getElementById('tpl-story').style.border = "none";
    document.getElementById('tpl-story').style.borderLeft = "3px solid var(--primary)";
    
    document.getElementById('toggle-edit-btn').style.display = 'block';
    document.getElementById('save-product-btn').style.display = 'none';
    
    showToast('Product updated successfully.', 'success');
}

window.renderReviews = function(productId) {
    const list = document.getElementById('reviews-list');
    const emptyMsg = document.getElementById('no-reviews-msg');
    if(!list) return;
    
    const allReviews = JSON.parse(localStorage.getItem('kala-reviews') || '{}');
    const prodReviews = allReviews[productId] || [];
    
    Array.from(list.children).forEach(child => {
        if(child.id !== 'no-reviews-msg') child.remove();
    });
    
    if(prodReviews.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if(emptyMsg) emptyMsg.style.display = 'none';
        
        prodReviews.forEach(rev => {
            const div = document.createElement('div');
            div.style.padding = '15px';
            div.style.borderBottom = '1px solid var(--border)';
            
            let starsHtml = '';
            for(let i=1; i<=5; i++) {
                starsHtml += `<i class="${i <= rev.rating ? 'fas fa-star' : 'far fa-star'}" style="color: #f1c40f;"></i>`;
            }
            
            div.innerHTML = `
                <div style="margin-bottom: 5px;">${starsHtml}</div>
                <p style="margin-bottom: 5px;">"${rev.text}"</p>
                <small class="text-muted">- Anonymous Customer</small>
            `;
            list.appendChild(div);
        });
    }
}

window.submitReview = function() {
    const prod = JSON.parse(localStorage.getItem('kala-current-product'));
    if(!prod) return;
    
    // Check and enforce login
    const isLoggedIn = localStorage.getItem('kala-loggedin') === 'true';
    if(!isLoggedIn) {
        showToast('Please login to post a review.', 'error');
        setTimeout(() => window.location.href = 'auth.html', 1500);
        return;
    }
    
    // Check and enforce purchase
    const purchased = JSON.parse(localStorage.getItem('kala-purchases') || '[]');
    const username = localStorage.getItem('kala-username') || 'Demo Customer';
    const hasPurchased = purchased.some(p => p.productId === prod.id && p.user === username);
    
    if(!hasPurchased) {
        showToast('You can only review products you have purchased.', 'error');
        return;
    }
    
    const textEl = document.getElementById('prod-review-text');
    const ratingEl = document.getElementById('prod-rating-value');
    
    const text = textEl.value.trim();
    if(!text) {
        showToast('Please enter a review comment.', 'error');
        return;
    }
    
    const rating = parseInt(ratingEl.value) || 5;
    
    const allReviews = JSON.parse(localStorage.getItem('kala-reviews') || '{}');
    if(!allReviews[prod.id]) {
        allReviews[prod.id] = [];
    }
    
    allReviews[prod.id].push({
        rating,
        text,
        date: new Date().toISOString(),
        reviewer: username
    });
    
    localStorage.setItem('kala-reviews', JSON.stringify(allReviews));
    textEl.value = '';
    
    showToast('Review submitted! Thank you.', 'success');
    renderReviews(prod.id);
    renderProductPage(); // update title/rating UI
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
