import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link, useNavigate, useLocation } from "react-router-dom";



export default function Menu() {
    const navigate = useNavigate();

    const handleBestSellersClick = (e) => {
        e.preventDefault();
        navigate('/', { replace: true, state: { scrollTo: 'pc-container' } });
    };

    return (
        <div className="menu menu-hidden" aria-hidden="true">
            <h1 className="menu-title">MENU</h1>
            <div className="nav-menu">
                <Link to="/" className="menu-nav-button">Home</Link>
                <a href="" className="menu-nav-button" onClick={handleBestSellersClick}>Best Sellers</a>
                <Link to="/Support" className="menu-nav-button">Support</Link>
                <Link to="/About Us" className="menu-nav-button">About Us</Link>
            </div>
        </div>
    );
}

// Toggle menu visibility
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

