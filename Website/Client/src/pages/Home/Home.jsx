import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import HomeVideo from '/Home-Video.mp4';
import VanillaTilt from 'vanilla-tilt';

import Smoother from '../../assets/smoother/smoother1.jpg';
import Beast from '../../assets/beast/beast1.jpg';
import Terminator from '../../assets/terminator/terminator1.jpg';
import Spaceship from '../../assets/spaceship/spaceship1.jpg';

export default function Home() {
    const iconContainerRef = useRef(null);
    const pcContainerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const accounts = document.querySelectorAll(".account");
        accounts.forEach(account => {
            account.addEventListener("mouseover", () => {
                account.classList.add("fa-bounce");
            });

            account.addEventListener("mouseleave", () => {
                account.classList.remove("fa-bounce");
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                } else {
                    entry.target.classList.remove("show");
                }
            });
        });

        if (iconContainerRef.current) {
            observer.observe(iconContainerRef.current);
        }

        // Set isLoaded to true after a short delay
        const loadTimeout = setTimeout(() => setIsLoaded(true), 100);

        return () => {
            accounts.forEach(account => {
                account.removeEventListener("mouseover", () => {});
                account.removeEventListener("mouseleave", () => {});
            });
            observer.disconnect();
            clearTimeout(loadTimeout);
        };
    }, []);

    useEffect(() => {
        if (isLoaded && pcContainerRef.current) {
            const products = pcContainerRef.current.querySelectorAll(".product");
            VanillaTilt.init(products, {
                max: 25,
                speed: 400,
                glare: true,
                "max-glare": 0.1,
                axis: "x",
            });

            return () => {
                products.forEach(product => {
                    if (product.vanillaTilt) {
                        product.vanillaTilt.destroy();
                    }
                });
            };
        }
    }, [isLoaded]);

    const selectProduct = (product) => {
        navigate(`/pc?product=${product}`);
    };

    return (
        <main>
            <video id="background-video" className="intro" autoPlay loop muted>
                <source src={HomeVideo} type="video/mp4" />
            </video>
            <div className="text-wrapper">
                <p className="text">
                    Built For Gamers 
                    <br />
                    <span className="by">
                        By Gamers
                    </span>
                </p>
            </div>
            
            <div className="pc-container" id="pc-container" ref={pcContainerRef}>
                <div className="background-smoother-image pc product">
                    <div className="smoother pc-info">
                        <h3 className="pc-title">SMOOTHER</h3>
                        <p className="pc-description">
                            Unleash Your Gaming Potential Without Breaking the Bank!
                            Introducing our latest budget-friendly gaming PC, designed for gamers who demand performance without the hefty price tag. This low-end gaming powerhouse is perfect for diving into the world of gaming, whether you're exploring vast open worlds, competing in intense multiplayer battles, or embarking on epic quests.
                        </p>
                        <img className="img-pc" src={Smoother} alt="Smoother PC" />
                        <div className="buy choose" onClick={() => selectProduct('Smoother')}>BUY</div>
                    </div>
                </div>
                
                <div className="background-beast-image pc product">
                    <div className="beast pc-info">
                        <h3 className="pc-title">BEAST</h3>
                        <p className="pc-description">
                            Elevate Your Gaming Experience with Our Next-Level Gaming PC!
                            Step up your game with our new gaming PC, crafted for gamers who seek a perfect balance of performance, quality, and affordability. Whether you're aiming for high scores, exploring new worlds, or streaming your gameplay, this gaming rig is built to deliver an exceptional experience - Take the next step in your gaming journey and secure your system now!
                        </p>
                        <img className="img-pc" src={Beast} alt="Beast PC" />
                        <div className="buy choose" onClick={() => selectProduct('Beast')}>BUY</div>
                    </div>
                </div>
        
                <div className="background-terminator-image pc product">
                    <div className="terminator pc-info">
                        <h3 className="pc-title">TERMINATOR</h3>
                        <p className="pc-description">
                            Enhance Your Gaming Experience with Our Advanced Gaming PC!
                            Take your gaming to new heights with our advanced gaming PC, designed for enthusiasts who seek impressive performance and cutting-edge technology. Whether you're conquering the latest AAA titles, streaming your gameplay, or creating content, this rig delivers the power and precision needed to excel.
                        </p>
                        <img className="img-pc" src={Terminator} alt="Terminator PC" />
                        <div className="buy choose" onClick={() => selectProduct('Terminator')}>BUY</div>
                    </div>
                </div>
                
                <div className="background-spaceship-image pc product">
                    <div className="spaceship pc-info">
                        <h3 className="pc-title">SPACESHIP</h3>
                        <p className="pc-description">
                            Command the Game with Our Ultimate Gaming PC!
                            Introducing the pinnacle of gaming technology: our Ultimate Gaming PC. Designed for the most demanding gamers and tech enthusiasts, this machine combines unrivaled power, cutting-edge features, and exceptional build quality. Whether you're playing the latest AAA titles, streaming in 4K, or creating high-end content, this rig delivers an unparalleled experience.
                        </p>
                        <img className="img-pc" src={Spaceship} alt="Spaceship PC" />
                        <div className="buy choose" onClick={() => selectProduct('Spaceship')}>BUY</div>
                    </div>
                </div>
            </div>
        
            <div className="follow">
                <p className="follow-text">FOLLOW THE <a className="follow-link" href="https://www.instagram.com/bldg_build/" target="_blank" rel="noopener noreferrer">@BLDG</a></p>
                <div ref={iconContainerRef} className="iconContainer icon-follow-section-container hidden">
                    <a href="https://www.facebook.com/profile.php?id=61560511531799" className="facebookAccount account fa-brands fa-facebook-f fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://x.com/BLDG_Tech" className="xAccount account fa-brands fa-x-twitter fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.instagram.com/bldg_build/" className="instagramAccount account fa-brands fa-instagram fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.tiktok.com/@bldgtech?lang=en" className="tiktokAccount account fa-brands fa-tiktok fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.youtube.com/channel/UCkdwly93IN-U34duTFW_ipA" className="youtubeAccount account fa-brands fa-youtube fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                </div>
            </div>
        </main>
    );
}