// Save cart to local storage
function saveCart(cartItems) {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
}

// Load cart from local storage
function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
}

// Attach event listeners for cart items
function attachEventListeners() {
    const addButtons = document.querySelectorAll('.add-to-cart');
    const subtractButtons = document.querySelectorAll('.remove-from-cart');
    const quantityInputs = document.querySelectorAll('input[type="number"]');
    const removeButtons = document.querySelectorAll('.remove-button');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const currentQuantity = loadCart().find(item => item.id === productId)?.quantity || 0;
            updateQuantity(productId, currentQuantity + 1);
        });
    });

    subtractButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const currentQuantity = loadCart().find(item => item.id === productId)?.quantity || 0;
            updateQuantity(productId, Math.max(0, currentQuantity - 1));
        });
    });

    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.closest('.product-on-cart').querySelector('.add-to-cart').getAttribute('data-id');
            updateQuantity(productId, Math.max(0, parseInt(input.value) || 0));
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            removeItem(productId);
        });
    });
}

// Update cart UI
function updateCartUI(cartItems) {
    const cartItemsContainer = document.querySelector(".products");
    cartItemsContainer.innerHTML = ''; // Clear existing items

    let total = 0;

    cartItems.forEach(item => {
        const productHTML = `
            <div class="product-on-cart" data-name="${item.name}">
                <img class="cart-item-image" src="${item.imageUrl1}">
                <div>
                    <h2>${item.name}</h2>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <button class="remove-button" data-id="${item.id}">Remove</button>
                </div>
                <button class="remove-from-cart" data-id="${item.id}" data-name="${item.name}">-</button>
                <input type="number" id="quantity" min="0" value="${item.quantity}">
                <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">+</button>
            </div>`;
        cartItemsContainer.insertAdjacentHTML('beforeend', productHTML);
        total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
    attachEventListeners();
}

// Add item to cart
function addToCart(product, quantity = 1) {
    let cartItems = loadCart();
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({...product, quantity});
    }

    saveCart(cartItems);
    updateCartUI(cartItems);
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    let cartItems = loadCart();
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, newQuantity);
        saveCart(cartItems);
        updateCartUI(cartItems);
    }
}

function removeItem(productId) {
    let cartItems = loadCart();
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart(cartItems);
    updateCartUI(cartItems);
}

// Toggle cart visibility
function initializeCart() {
    const cart = document.querySelector(".cart");
    const cartIcon = document.querySelector(".cart-icon");

    if (!cart || !cartIcon) {
        console.error("Cart or cart icon elements not found. Retrying in 1 second.");
        setTimeout(initializeCart, 1000);
        return;
    }

    let isCartVisible = false;

    function toggleCart() {
        if (!isCartVisible) {
            // Show cart
            cart.style.display = 'flex';
            setTimeout(() => {
                cart.style.right = '0px';
            }, 1);
            cart.setAttribute('aria-hidden', 'false');
        } else {
            // Hide cart
            cart.style.right = '-600px';
            cart.setAttribute('aria-hidden', 'true');
            
            // Remove cart from DOM after transition
            setTimeout(() => {
                cart.style.display = 'none';
            }, 800); // Adjust this value to match your transition duration
        }
        isCartVisible = !isCartVisible;
    }

    cartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        toggleCart();
    });

    // Load and display cart on page load
    const cartItems = loadCart();
    updateCartUI(cartItems);
}

// Call the initialize function when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCart);
} else {
    initializeCart();
}

