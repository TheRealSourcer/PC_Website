import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import LogoImage from './assets/Logo.png';

export default function Footer() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleExpandableClick = (event) => {
            if (event.target.classList.contains('expandable-title')) {
                const content = event.target.nextElementSibling;
                const icon = event.target.querySelector('.expand-icon');
                
                content.classList.toggle('expanded');
                icon.classList.toggle('rotated');
                
                icon.textContent = content.classList.contains('expanded') ? '-' : '+';
            }
        };

        document.addEventListener('click', handleExpandableClick);

        return () => {
            document.removeEventListener('click', handleExpandableClick);
        };
    }, []);

    const selectProduct = (product) => {
        navigate(`/pc?product=${product}`);
    };

    return (
        <footer className="footer">
            <div className="flex-footer-container">
                <div className="footer-column">
                    <form className="advice">
                        <p className="advice-instructions">Send Us Advice or Concerns</p>
                        <div className="submission-elements">
                            <input type="text" className="input-advice" placeholder="advice or concerns" />
                            <input type="submit" className="submit-advice" value="Submit" />
                        </div>
                    </form>
        
                    <div className="iconContainer" id="icon-footer-container">
                        <div className="facebookAccount account fa-brands fa-facebook-f fa-xl">
                            <a href="https://www.facebook.com/profile.php?id=61560511531799" className="account-link" target="_blank" rel="noopener noreferrer" />
                        </div>
                        <div className="xAccount account fa-brands fa-x-twitter fa-xl">
                            <a href="https://x.com/BLDG_Tech" className="account-link" target="_blank" rel="noopener noreferrer" />
                        </div>
                        <div className="instagramAccount account fa-brands fa-instagram fa-xl">
                            <a href="https://www.instagram.com/bldg_build/" className="account-link" target="_blank" rel="noopener noreferrer" />
                        </div>
                        <div className="tiktokAccount account fa-brands fa-tiktok fa-xl">
                            <a href="https://www.tiktok.com/@bldgtech?lang=en" className="account-link" target="_blank" rel="noopener noreferrer" />
                        </div>
                        <div className="youtubeAccount account fa-brands fa-youtube fa-xl">
                            <a href="https://www.youtube.com/channel/UCkdwly93IN-U34duTFW_ipA" className="account-link" target="_blank" rel="noopener noreferrer" />
                        </div>
                    </div>
                </div>
    
                <div className="footer-column footer-column-links">
                <div className="footer-link-container">
                    <div className="expandable-section">
                        <h3 className="expandable-title">Shop <span className="expand-icon">+</span></h3>
                        <ul className="shop link-c">
                            <li onClick={() => selectProduct('Smoother')} className="footer-link choose">Smoother</li>
                            <li onClick={() => selectProduct('Beast')} className="footer-link choose">Beast</li>
                            <li onClick={() => selectProduct('Terminator')} className="footer-link choose">Terminator</li>
                            <li onClick={() => selectProduct('Spaceship')} className="footer-link choose">Spaceship</li>
                        </ul>
                    </div>
                        <div className="expandable-section">
                            <h3 className="expandable-title">Support <span className="expand-icon">+</span></h3>
                            <ul className="Support link-c">
                                <li><Link to="/Reviews" className="footer-link">Reviews</Link></li>
                                <li><Link to="/Why The BLDG" className="footer-link">Why BLDG</Link></li>
                                <li><Link to="/Support" className="footer-link">Track Order</Link></li>
                                <li><Link to="/BLDG Upgrader" className="footer-link">BLDG Upgrader</Link></li>
                            </ul>
                        </div>
                        <div className="expandable-section">
                            <h3 className="expandable-title">Legal <span className="expand-icon">+</span></h3>
                            <ul className="Legal link-c">
                                <li><Link to="/Terms & Conditions" className="footer-link">Terms & Conditions</Link></li>
                                <li><Link to="/Privacy Policy" className="footer-link">Privacy Policy</Link></li>
                                <li><Link to="/Refund Policy" className="footer-link">Refund Policy</Link></li>
                                <li><Link to="/Shipping Policy" className="footer-link">Shipping Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
    
                <div className="footer-column footer-column-logo">
                    <Link to="/"><img src={LogoImage} alt="BLDG Logo" className="footer-logo" /></Link>
                </div>
            </div>
            <div className="copyright-container">
                <p className="copyright">Copyright © 2024 BLDG Technologies. All Rights Reserved.</p>
            </div>
        </footer>
    );
}