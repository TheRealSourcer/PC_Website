import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link, useNavigate, useLocation } from "react-router-dom";



export default function Menu() {
    const navigate = useNavigate();

    const handleBestSellersClick = (e) => {
        e.preventDefault();
        navigate('/', { replace: true, state: { scrollTo: 'pc-container' } });
        toggleMenu();
    };

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

    return (
        <div className="menu menu-hidden" aria-hidden="true">
            <div className='menu-title-toggle'>
                <h1 className="menu-title">MENU</h1>
                <i className='close-menu-icon fa-soli fa-x' onClick={toggleMenu}></i>
            </div>
            <div className="nav-menu">
                <div>
                    <i className='fa-solid fa-house' onClick={toggleMenu}></i>
                    <Link to="/" className="menu-nav-button" onClick={toggleMenu}>Home</Link>
                </div>
                
                <div>
                    <i className='fa-solid fa-heart' onClick={toggleMenu}></i>
                    <a href="" className="menu-nav-button" onClick={handleBestSellersClick}>Best Sellers</a>
                </div>

                <div>
                    <i className='fa-solid fa-wrench' onClick={toggleMenu}></i>
                    <Link to="/Support" className="menu-nav-button" onClick={toggleMenu}>Support</Link>
                </div>

                <div>
                    <i className='fa-solid fa-circle-info' onClick={toggleMenu}></i>
                    <Link to="/About Us" className="menu-nav-button" onClick={toggleMenu}>About Us</Link>
                </div>
            </div>
        </div>
    );
}

// Toggle menu visibility
