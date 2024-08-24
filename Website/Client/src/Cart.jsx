import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useUserUUID from './hooks/useUserUUID';

// Import your images
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
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const userUUID = useUserUUID();  // Use the custom hook

    useEffect(() => {
        const productName = searchParams.get('product');
        if (productName && products[productName]) {
            setProduct(products[productName]);
        } else {
            console.error('No valid product specified');
        }
    }, [searchParams]);

    useEffect(() => {
        const handleCartButtonClick = () => {
            if (product) {
                const existingProduct = cartItems.find(item => item.id === product.id);
                if (existingProduct) {
                    updateQuantity(existingProduct.id, existingProduct.quantity + 1);
                } else {
                    setCartItems([...cartItems, { ...product, quantity: 1 }]);
                }
            }
        };

        // Add event listener for the cart button
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', handleCartButtonClick);
        }

        // Cleanup event listener on component unmount
        return () => {
            if (cartButton) {
                cartButton.removeEventListener('click', handleCartButtonClick);
            }
        };
    }, [product, cartItems]);

    useEffect(() => {
        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setSubtotal(total);
    }, [cartItems]);

    const updateQuantity = (id, quantity) => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch('http://localhost:3000/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: [
                        {
                            id: '2',
                            name: 'Beast',
                            price: 999.99,
                            quantity: 1
                        }
                    ],
                    userUUID: '96e68dab-867a-4c3e-9b81-b16fc84e5141' // Replace with actual UUID
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Redirect to Stripe Checkout
                const stripe = window.Stripe('pk_test_51PbjzsAvZVlzPgF8Wtv9GAhGKbDJYS26DUOXtqEJ8MeM7fU5jQYuIS4G2BevkamozcYBOOYjbWCFmNqSDJGoFcGp00LaSzm6UA'); // Replace with your Stripe public key
                stripe.redirectToCheckout({ sessionId: data.id });
            } else {
                console.error('Error during checkout:', data.error);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className="cart">
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="products">
                {cartItems.map(item => (
                    <div key={item.id} className="product-on-cart">
                        <img className="cart-item-image" src={item.imageUrl1} alt={item.name} />
                        <div>
                            <h2>{item.name}</h2>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <button className="remove-button" onClick={() => removeItem(item.id)}>Remove</button>
                        </div>
                        <button className="subtract-from-cart" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>-</button>
                        <input
                            id="quantity"
                            type="number"
                            value={item.quantity}
                            onChange={e => updateQuantity(item.id, Math.max(0, parseInt(e.target.value) || 0))}
                        />
                        <button className="add-to-cart" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                ))}
            </div>
            <div className="buying-info">
                <p className="info">Subtotal: ${subtotal.toFixed(2)}</p>
                <p className="info">Shipping: Calculated at Checkout</p>
                <p className="info">Tax: Calculated at Checkout</p>
                <button className="checkout-button" disabled={cartItems.length === 0} onClick={handleCheckout}>CHECKOUT</button>
            </div>
        </div>
    );
}