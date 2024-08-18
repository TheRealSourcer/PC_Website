import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import SmootherImage1 from "./assets/smoother/smoother1.jpg";
import SmootherImage2 from "./assets/smoother/smoother2.jpg";
import SmootherImage3 from "./assets/smoother/smoother3.jpg";
import SmootherImage4 from "./assets/smoother/smoother4.jpg";

import BeastImage1 from "./assets/beast/beast1.jpg";
import BeastImage2 from "./assets/beast/beast2.jpg";
import BeastImage3 from "./assets/beast/beast3.jpg";
import BeastImage4 from "./assets/beast/beast4.jpg";

import TerminatorImage1 from "./assets/terminator/terminator1.jpg";
import TerminatorImage2 from "./assets/terminator/terminator2.jpg";
import TerminatorImage3 from "./assets/terminator/terminator3.jpg";
import TerminatorImage4 from "./assets/terminator/terminator4.jpg";

import SpaceshipImage1 from "./assets/spaceship/spaceship1.jpg";
import SpaceshipImage2 from "./assets/spaceship/spaceship2.jpg";
import SpaceshipImage3 from "./assets/spaceship/spaceship3.jpg";
import SpaceshipImage4 from "./assets/spaceship/spaceship4.jpg";

const products = {
    Smoother: {
        id: "1",
        name: "Smoother",
        description: "Unleash Your Gaming Potential Without Breaking the Bank! <br>Introducing our latest budget-friendly gaming PC, designed for gamers who demand performance without the hefty price tag. This low-end gaming powerhouse is perfect for diving into the world of gaming, whether you're exploring vast open worlds, competing in intense multiplayer battles, or embarking on epic quests.",
        price: 649.99,
        features: ["4K Resolution", "Smart Features", "HDR"],
        imageUrl1: SmootherImage1,
        imageUrl2: SmootherImage2,
        imageUrl3: SmootherImage3,
        imageUrl4: SmootherImage4
    },
    Beast: {
        id: "2",
        name: "Beast",
        description: "Elevate Your Gaming Experience with Our Next-Level Gaming PC! <br>Step up your game with our new gaming PC, crafted for gamers who seek a perfect balance of performance, quality, and affordability. Whether you're aiming for high scores, exploring new worlds, or streaming your gameplay, this gaming rig is built to deliver an exceptional experience - Take the next step in your gaming journey and secure your system now!",
        price: 999.99,
        features: ["100% Cotton", "Machine Washable", "Various Colors"],
        imageUrl1: BeastImage1,
        imageUrl2: BeastImage2,
        imageUrl3: BeastImage3,
        imageUrl4: BeastImage4
    },
    Terminator: {
        id: "3",
        name: "Terminator",
        description: "Enhance Your Gaming Experience with Our Advanced Gaming PC! <br>Take your gaming to new heights with our advanced gaming PC, designed for enthusiasts who seek impressive performance and cutting-edge technology. Whether you're conquering the latest AAA titles, streaming your gameplay, or creating content, this rig delivers the power and precision needed to excel.",
        price: 1299.99,
        features: ["Genuine Leather", "3-Seater", "Reclining Function"],
        imageUrl1: TerminatorImage1,
        imageUrl2: TerminatorImage2,
        imageUrl3: TerminatorImage3,
        imageUrl4: TerminatorImage4
    },
    Spaceship: {
        id: "4",
        name: "Spaceship",
        description: "Command the Game with Our Ultimate Gaming PC! <br>Introducing the pinnacle of gaming technology: our Ultimate Gaming PC. Designed for the most demanding gamers and tech enthusiasts, this machine combines unrivaled power, cutting-edge features, and exceptional build quality. Whether you're playing the latest AAA titles, streaming in 4K, or creating high-end content, this rig delivers an unparalleled experience.",
        price: 1999.99,
        features: ["Genuine Leather", "3-Seater", "Reclining Function"],
        imageUrl1: SpaceshipImage1,
        imageUrl2: SpaceshipImage2,
        imageUrl3: SpaceshipImage3,
        imageUrl4: SpaceshipImage4
    }
};

export default function Cart() {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const productName = searchParams.get('product');
        if (productName && products[productName]) {
            setProduct(products[productName]);
        } else {
            console.error('No valid product specified');
        }
    }, [searchParams]);

    useEffect(() => {
        if (product) {
            const cartItemsContainer = document.querySelector(".products");
            const cartTotal = document.getElementById('cart-total');
            const addToCartButton = document.querySelector(".cart-button");

            const updateCart = (category) => {
                const product = products[category];
                if (!product) return;

                const existingProduct = cartItemsContainer.querySelector(`.product-on-cart[data-name="${product.name}"]`);
                
                if (existingProduct) {
                    const quantityInput = existingProduct.querySelector('input[type="number"]');
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                } else {
                    const productHTML = `
                        <div class="product-on-cart" data-name="${product.name}">
                            <img class="cart-item-image" src="${product.imageUrl1}">
                            <div>
                                <h2>${product.name}</h2>
                                <p>Price: $${product.price.toFixed(2)}</p>
                                <button class="remove-button" data-id="${product.id}">remove</button>
                            </div>
                            <button class="subtract-from-cart" data-id="${product.id}" data-name="${product.name}">-</button>
                            <input type="number" id="quantity" min="0" value="1">
                            <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">+</button>
                        </div>`;
                    cartItemsContainer.insertAdjacentHTML('beforeend', productHTML);
                    attachEventListeners();
                }

                updateSubtotal();
                updateCheckoutButtonState();
            };

            const updateSubtotal = () => {
                let total = 0;
                const quantityInputs = cartItemsContainer.querySelectorAll('input[type="number"]');
                quantityInputs.forEach(input => {
                    const productDiv = input.closest('.product-on-cart');
                    const price = parseFloat(productDiv.querySelector('.add-to-cart').getAttribute('data-price'));
                    const quantity = parseInt(input.value);
                    total += price * quantity;
                });
                cartTotal.textContent = total.toFixed(2);
            };

            const attachEventListeners = () => {
                const addButtons = cartItemsContainer.querySelectorAll('.add-to-cart');
                const subtractButtons = cartItemsContainer.querySelectorAll('.subtract-from-cart');
                const quantityInputs = cartItemsContainer.querySelectorAll('input[type="number"]');
                const removeButtons = cartItemsContainer.querySelectorAll('.remove-button');

                addButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const input = button.previousElementSibling;
                        input.value = parseInt(input.value) + 1;
                        updateSubtotal();
                        updateCheckoutButtonState();
                    });
                });

                subtractButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const input = button.nextElementSibling;
                        input.value = Math.max(0, parseInt(input.value) - 1);
                        updateSubtotal();
                        updateCheckoutButtonState();
                    });
                });

                quantityInputs.forEach(input => {
                    input.addEventListener('input', () => {
                        input.value = Math.max(0, parseInt(input.value) || 0);
                        updateSubtotal();
                        updateCheckoutButtonState();
                    });
                });

                removeButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = button.getAttribute('data-id');
                        removeFromCart(productId);
                        updateSubtotal();
                        updateCheckoutButtonState();
                    });
                });
            };

            if (addToCartButton) {
                addToCartButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    const category = searchParams.get('product');
                    if (category && products[category]) {
                        updateCart(category);
                    }
                });
            }

            // Call this after attaching event listeners
            updateCheckoutButtonState();
        }
    }, [product, searchParams]);

    return (
        <div className="cart cart-hidden" aria-hidden="true">
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="products"></div>
            <div className="buying-info">
                <p className="info">Subtotal: $<span id="cart-total">0</span></p>
                <p className="info">Shipping: $<span id="cart-shipping">0</span></p>
                <p className="info">Tax: $<span id="cart-tax">0</span></p>
                <button className="checkout-button" disabled>CHECKOUT</button>  
            </div>
        </div>
    );
}

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
    const subtractButtons = document.querySelectorAll('.subtract-from-cart');
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
            updateQuantity(productId, Math.max(1, currentQuantity - 1));
        });
    });

    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.closest('.product-on-cart').querySelector('.add-to-cart').getAttribute('data-id');
            updateQuantity(productId, Math.max(1, parseInt(input.value) || 1));
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            removeFromCart(productId);
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
                    <button class="remove-button" data-id="${item.id}">remove</button>
                </div>
                <button class="subtract-from-cart" data-id="${item.id}" data-name="${item.name}">-</button>
                <input type="number" id="quantity" min="1" value="${item.quantity}">
                <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">+</button>
            </div>`;
        cartItemsContainer.insertAdjacentHTML('beforeend', productHTML);
        total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
    attachEventListeners();
    updateCheckoutButtonState();
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

// Remove item from cart
function removeFromCart(productId) {
    let cartItems = loadCart();
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart(cartItems);
    updateCartUI(cartItems);
}

// Toggle cart visibility
function toggleCart() {
    const cart = document.querySelector(".cart");
    const isCartVisible = cart.getAttribute('aria-hidden') === 'false';

    if (isCartVisible) {
        cart.classList.remove('cart-visible');
        cart.classList.add('cart-hidden');
        cart.setAttribute('aria-hidden', 'true');
    } else {
        cart.classList.remove('cart-hidden');
        cart.classList.add('cart-visible');
        cart.setAttribute('aria-hidden', 'false');
    }
}

// Initialize cart functionality
function initializeCart() {
    const cartIcon = document.querySelector(".cart-icon");

    if (!cartIcon) {
        console.error("Cart icon element not found. Retrying in 1 second.");
        setTimeout(initializeCart, 1000);
        return;
    }

    cartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        toggleCart();
    });

    const cartItems = loadCart();
    updateCartUI(cartItems);
}

// Update checkout button state
function updateCheckoutButtonState() {
    const checkoutButton = document.querySelector(".checkout-button");

    if (!checkoutButton) {
        console.error("Checkout button element not found. Retrying in 1 second.");
        setTimeout(updateCheckoutButtonState, 1000);
        return;
    }

    const cartItems = loadCart();
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    checkoutButton.disabled = totalQuantity === 0;
    checkoutButton.style.opacity = totalQuantity === 0 ? "0.5" : "1";
}

// Initialize the cart and checkout button state when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    updateCheckoutButtonState();

    const checkoutButton = document.querySelector(".checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            const cartItems = loadCart();
            
            // Calculate total quantity across all items
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            
            if (totalQuantity === 0) {
                alert("Please add at least one item to the cart before checking out.");
                return;
            }

            const items = cartItems.filter(item => item.quantity > 0).map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            fetch("http://localhost:3000/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items }),
            })
            .then(res => {
                if (res.ok) return res.json();
                return res.json().then(json => Promise.reject(json));
            })
            .then(({ url }) => {
                window.location = url;
            })
            .catch(e => {
                console.error('Checkout error:', e.error);
                alert('An error occurred during checkout. Please try again.');
            });
        });
    }
});