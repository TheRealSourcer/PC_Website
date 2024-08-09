import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import SmootherImage1 from "../../assets/smoother/smoother1.jpg";
import SmootherImage2 from "../../assets/smoother/smoother2.jpg";
import SmootherImage3 from "../../assets/smoother/smoother3.jpg";
import SmootherImage4 from "../../assets/smoother/smoother4.jpg";

import BeastImage1 from "../../assets/beast/beast1.jpg";
import BeastImage2 from "../../assets/beast/beast2.jpg";
import BeastImage3 from "../../assets/beast/beast3.jpg";
import BeastImage4 from "../../assets/beast/beast4.jpg";

import TerminatorImage1 from "../../assets/terminator/terminator1.jpg";
import TerminatorImage2 from "../../assets/terminator/terminator2.jpg";
import TerminatorImage3 from "../../assets/terminator/terminator3.jpg";
import TerminatorImage4 from "../../assets/terminator/terminator4.jpg";

import SpaceshipImage1 from "../../assets/spaceship/spaceship1.jpg";
import SpaceshipImage2 from "../../assets/spaceship/spaceship2.jpg";
import SpaceshipImage3 from "../../assets/spaceship/spaceship3.jpg";
import SpaceshipImage4 from "../../assets/spaceship/spaceship4.jpg";

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

export default function DreamPc() {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselRef = useRef(null);
    const dragStartX = useRef(0);
    const isDragging = useRef(false);

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
                    // Product already in cart, update quantity
                    const quantityInput = existingProduct.querySelector('input[type="number"]');
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                } else {
                    // Product not in cart, add new product
                    const productHTML = `
                        <div class="product-on-cart" data-name="${product.name}">
                            <img class="cart-item-image" src="${product.imageUrl1}">
                            <div>
                                <h2>${product.name}</h2>
                                <p>Price: $${product.price.toFixed(2)}</p>
                            </div>
                            <button class="remove-from-cart" data-id="${product.id}" data-name="${product.name}">-</button>
                            <input type="number" id="quantity" min="0" value="1">
                            <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">+</button>
                        </div>`;
                    cartItemsContainer.insertAdjacentHTML('beforeend', productHTML);
                    attachEventListeners();
                }

                updateSubtotal();
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
                const removeButtons = cartItemsContainer.querySelectorAll('.remove-from-cart');
                const quantityInputs = cartItemsContainer.querySelectorAll('input[type="number"]');

                addButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const input = button.previousElementSibling;
                        input.value = parseInt(input.value) + 1;
                        updateSubtotal();
                    });
                });

                removeButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const input = button.nextElementSibling;
                        input.value = Math.max(1, parseInt(input.value) - 1);
                        updateSubtotal();
                    });
                });

                quantityInputs.forEach(input => {
                    input.addEventListener('input', () => {
                        input.value = Math.max(1, parseInt(input.value) || 1);
                        updateSubtotal();
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
        }
    }, [product, searchParams]);

    const nextImage = () => {
        showSlide((currentImageIndex + 1) % 4);
    };

    const prevImage = () => {
        showSlide((currentImageIndex - 1 + 4) % 4);
    };

    const showSlide = (index) => {
        setCurrentImageIndex(index);
        if (carouselRef.current) {
            carouselRef.current.style.transition = 'transform 0.3s ease';
            carouselRef.current.style.transform = `translateX(${index * -100}%)`;
        }
    };

    const handleDragStart = (event) => {
        isDragging.current = true;
        dragStartX.current = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
        carouselRef.current.style.transition = 'none';
    };

    const handleDragMove = (event) => {
        if (!isDragging.current) return;
        const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        const moveX = currentX - dragStartX.current;
        carouselRef.current.style.transform = `translateX(calc(${currentImageIndex * -100}% + ${moveX}px))`;
    };

    const handleDragEnd = (event) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const endX = event.type === 'touchend' ? event.changedTouches[0].clientX : event.clientX;
        const movedBy = endX - dragStartX.current;

        if (movedBy < -100) {
            nextImage();
        } else if (movedBy > 100) {
            prevImage();
        } else {
            showSlide(currentImageIndex);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <main className='main-dream-pc'>
            <div className="product-info section">
                <h1 id="product-name" className="product-part">{product.name}</h1>
                <p id="product-price" className="product-part">${product.price.toFixed(2)}</p>
            </div>

            <div className="carousel-container">
                <button className="carousel-control prev" onClick={prevImage}>&lt;</button>
                <div className="carousel-dots-container">
                    <div className="carousel">
                        <div
                            className="carousel-inner"
                            ref={carouselRef}
                            onTouchStart={handleDragStart}
                            onTouchMove={handleDragMove}
                            onTouchEnd={handleDragEnd}
                            onMouseDown={handleDragStart}
                            onMouseMove={handleDragMove}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                        >
                            {[0, 1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className={`carousel-item ${index === currentImageIndex ? 'active' : ''}`}
                                >
                                    <img
                                        src={product[`imageUrl${index + 1}`]}
                                        alt={`${product.name} Image ${index + 1}`}
                                        className="product-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="carousel-dots">
                        {[0, 1, 2, 3].map((index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => showSlide(index)}
                            ></span>
                        ))}
                    </div>
                </div>
                <button className="carousel-control next" onClick={nextImage}>&gt;</button>
            </div>

            <div className="features section">
                <p id="product-description" className="product-part" dangerouslySetInnerHTML={{ __html: product.description }}></p>
                <div id="product-features" className="product-part">
                    <h3>Features:</h3>
                    <ul>
                        {product.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    <button className="cart-button"><i className="fa-solid fa-cart-shopping cart-button-icon"></i></button>
                </div>
            </div>
        </main>
    );
}