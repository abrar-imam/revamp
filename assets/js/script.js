document.addEventListener('DOMContentLoaded', () => {

    // Sample product data using the provided images
    // In a real application, this would come from a database.
    const products = [
        { id: 1, name: 'Red Floral Saree', price: 2500, category: 'womens', image: 'assets/images/image_1759e4.jpg' },
        { id: 2, name: 'Maroon Party Dress', price: 3800, category: 'womens', image: 'assets/images/image_1759ca.jpg' },
        { id: 3, name: 'Casual Jeans', price: 1500, category: 'mens', image: 'assets/images/image_1759e9.jpg' },
        { id: 4, name: 'Maroon Formal Shirt', price: 1800, category: 'mens', image: 'assets/images/image_175a04.jpg' },
        { id: 5, name: 'Black Formal Shirt', price: 1600, category: 'mens', image: 'assets/images/image_175a0a.jpg' },
        { id: 6, name: 'Silver Wrist Watch', price: 950, category: 'womens', image: 'assets/images/image_175a25.jpg' },
    ];

    const cart = [];
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartModal = document.getElementById('cart-modal');
    const openCartModalBtn = document.getElementById('open-cart-modal');
    const closeCartModalBtn = document.getElementById('close-cart-modal');
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    // Get the checkout button from the DOM
    const checkoutBtn = document.querySelector('.bg-stone-900.px-6.py-3');
    // Remove old "Notify Me" button, as the RENT section now has a different function.
    // const notifyMeBtn = document.querySelector('.cursor-not-allowed');

    /**
     * Renders a single product card to the DOM.
     * @param {Object} product - The product object to render.
     * @returns {string} The HTML string for the product card.
     */
    function renderProductCard(product) {
        return `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-5 text-center">
                    <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                    <p class="text-lg text-gray-600 mb-4">BDT ${product.price}</p>
                    <button data-product-id="${product.id}" class="add-to-cart-btn bg-stone-900 text-white px-6 py-2 rounded-full hover:bg-stone-700 transition duration-300 shadow-md hover:shadow-lg">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Renders a single rent product card to the DOM.
     * @param {Object} product - The product object to render.
     * @returns {string} The HTML string for the rent product card.
     */
    function renderRentCard(product) {
        return `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-5 text-center">
                    <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                    <p class="text-lg text-gray-600 mb-4">BDT ${product.price} / day</p>
                    <button data-product-id="${product.id}" class="rent-now-btn bg-stone-900 text-white px-6 py-2 rounded-full hover:bg-stone-700 transition duration-300 shadow-md hover:shadow-lg">
                        Rent Now
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Renders all products for a given category.
     * @param {string} category - The category of products to render.
     */
    function renderProducts(category) {
        const containerId = `${category}-products`;
        const container = document.getElementById(containerId);
        const productsToRender = category === 'new-arrivals' ? products : products.filter(p => p.category === category);
        if (container) {
            container.innerHTML = productsToRender.map(renderProductCard).join('');
        }
    }

    /**
     * Adds a product to the shopping cart.
     * @param {number} productId - The ID of the product to add.
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartUI();
        }
    }
    
    /**
     * Handles the "Rent Now" button click.
     * @param {number} productId - The ID of the product to rent.
     */
    function handleRentClick(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            alert(`You are now renting "${product.name}". An email with rental details will be sent to you shortly.`);
        }
    }

    /**
     * Updates the cart icon count and the cart modal content.
     */
    function updateCartUI() {
        cartCountEl.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Render cart items
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                <div class="flex-1">
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-gray-600">BDT ${item.price} x ${item.quantity}</p>
                </div>
                <span class="font-bold text-lg">BDT ${item.price * item.quantity}</span>
            </div>
        `).join('');

        // Calculate and render total
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalEl.textContent = `BDT ${total}`;
    }

    /**
     * Handles navigation by showing the correct content section.
     * @param {string} sectionId - The ID of the section to show.
     */
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Scroll to the section for a smoother experience
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Special handling for the 'buy-content' and 'rent-content' sections to render all products
            if (sectionId === 'buy-content') {
                renderAllProducts('buy');
            } else if (sectionId === 'rent-content') {
                renderAllProducts('rent');
            }
        }
    }
    
    /**
     * Renders products for a given section.
     * @param {string} section - The section to render (e.g., 'buy', 'rent').
     */
    function renderAllProducts(section) {
        const container = document.getElementById(`${section}-products`);
        if (container) {
            if (section === 'rent') {
                container.innerHTML = products.map(renderRentCard).join('');
            } else {
                container.innerHTML = products.map(renderProductCard).join('');
            }
        }
    }

    /**
     * Clears the cart and provides an order confirmation message.
     */
    function handleCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Clear the cart
        cart.length = 0;
        updateCartUI();
        closeCartModal();
        alert('Thank you for your order! Your purchase is complete.');
    }

    // Event listener for "Add to Cart" and "Rent Now" buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.productId, 10);
            addToCart(productId);
            openCartModal();
        } else if (e.target.classList.contains('rent-now-btn')) {
            const productId = parseInt(e.target.dataset.productId, 10);
            handleRentClick(productId);
        }
    });

    // Event listeners for cart modal
    openCartModalBtn.addEventListener('click', openCartModal);
    closeCartModalBtn.addEventListener('click', closeCartModal);

    // Event listener for the checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    /**
     * Opens the shopping cart modal.
     */
    function openCartModal() {
        cartModal.classList.remove('hidden');
        setTimeout(() => {
            cartModal.querySelector('div').classList.remove('scale-95');
            cartModal.querySelector('div').classList.add('scale-100');
        }, 10);
    }

    /**
     * Closes the shopping cart modal.
     */
    function closeCartModal() {
        cartModal.querySelector('div').classList.remove('scale-100');
        cartModal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            cartModal.classList.add('hidden');
        }, 300);
    }

    // Event listener for mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('-translate-y-full');
    });

    // Event listeners for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = e.target.dataset.section;
            if (sectionId) {
                // Prevent default anchor link behavior
                e.preventDefault(); 
                showSection(sectionId);
                // Hide mobile menu after clicking a link
                mobileMenu.classList.add('-translate-y-full');
            }
        });
    });

    // Initial rendering of products
    renderProducts('new-arrivals');
    renderProducts('mens');
    renderProducts('womens');
    // Also render products for the 'buy' section on load
    renderAllProducts('buy');
});
