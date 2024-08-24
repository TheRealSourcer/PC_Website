import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import React from "react";
import LogoImage from './assets/Logo.png';

export default function NavBar() {
    const { cartItemCount, setCartItemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBestSellersClick = (e) => {
        e.preventDefault();
        navigate('/', { replace: true, state: { scrollTo: 'pc-container' } });
    };

    React.useEffect(() => {
        const { state } = location;
        if (state && state.scrollTo) {
            const element = document.getElementById(state.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    function toggleMenu() {
        const menu = document.querySelector(".menu");
        const isMenuVisible = menu.getAttribute('aria-hidden') === 'false';
        if (isMenuVisible) {
            menu.classList.remove('menu-visible');
            menu.classList.add('menu-hidden');
            menu.setAttribute('aria-hidden', 'true');
        } else {
            menu.classList.remove('menu-hidden');
            menu.classList.add('menu-visible');
            menu.setAttribute('aria-hidden', 'false');
        }
    }

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
            setCartItemCount(0);  // Reset cart item count when the cart is opened
        }
    }

    const displayCartItemCount = cartItemCount > 9 ? '9+' : cartItemCount;

    return (
        <nav className="navigation">
            <div className="nav-left">
                <i className="fa-solid fa-bars bars menu-icon" onClick={toggleMenu}></i>
            </div>
            <div className="nav-center">
                <Link to="/" className="dream-pc navBtn">Home</Link>
                <a href="" className="navBtn border-nav-btn" onClick={handleBestSellersClick}>Best Sellers</a>
                <Link to="/" className="logo-container">
                    <img src={LogoImage} alt="Logo" className="logo" />
                </Link>
                <Link to="/Support" className="navBtn border-nav-btn">Support</Link>
                <Link to="/About Us" className="navBtn border-nav-btn">About Us</Link>
            </div>
            <div className="nav-right">
                <div className="cart-container">
                    <i className="fa-solid fa-cart-shopping cart-icon" onClick={toggleCart}></i>
                    <div className={`cart-badge ${cartItemCount > 0 ? '' : 'hidden'}`}>
                        {displayCartItemCount}
                    </div>
                </div>
            </div>
        </nav>
    );
}

document.querySelectorAll('.choose').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        window.location.href = `../Dream PC/dream pc.html?product=${product}`;
    });
});
