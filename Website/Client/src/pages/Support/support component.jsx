import { useState } from "react";

import SmootherImage1 from "../../assets/smoother/smoother1.jpg";
import SmootherImage2 from "../../assets/smoother/smoother2.jpg";
import SmootherImage3 from "../../assets/smoother/smoother3.jpg";
import SmootherImage4 from "../../assets/smoother/smoother4.jpg";

import BeastImage1 from "../../assets/beast/beast1.jpg";
import BeastImage2 from "../../assets/beast/beast2.jpg";
import BeastImage3 from "../../assets/beast/beast3.jpeg";
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

export default function Support() {
    const [searchTerm, setSearchTerm] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredProducts = Object.values(products).filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trackingNumber = document.getElementById('orderNumber').value.trim();
        
        try {
            const response = await fetch('http://localhost:3000/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trackingNumber }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tracking information');
            }

            const data = await response.json();
            setTrackingResult(data);
            setError(null);
        } catch (err) {
            setError('Error fetching tracking information. Please try again.');
            setTrackingResult(null);
            console.error('Tracking error:', err);
        }
    };

    return (
        <main className="support-main">
            <section className="product-search-section">
                <div className="support-image-header">
                    <h1 className="support-title">Support</h1>
                    <p className="support-text">Get help that fits your needs</p>
                    <form id="search-support">
                        <input
                            type="text"
                            id="text-search-support"
                            placeholder="Enter a product name"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <button type="submit" id="enter-search-support" className="fa-solid fa-magnifying-glass"></button>
                    </form>
                </div>
                <div className="products-to-search">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card" style={{ backgroundImage: `url(${product.imageUrl1})` }}>
                            <h3>{product.name}</h3>
                            <a href = 'mailto:bldgtechnolgics@gmail.com' target="_blank">
                                Contact Us
                            </a>
                            <a href = 'https://www.rednightconsulting.com/11-common-computer-issues-fix/' target="_blank">
                                Common Solutions
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section className="tracking-section" id="tracking-section">
                <h1 className="tracking-title">Order Tracking</h1>
                <form id="orderForm" onSubmit={handleSubmit}>
                    <input type="text" id="orderNumber" placeholder="Enter tracking number" required />
                    <button type="submit" className="order-button"><i className="fa-solid fa-truck-fast"></i></button>
                </form>
                <div id="result">
                    {error && <p className="error">{error}</p>}
                    {trackingResult && (
                        <div className="success">
                            <h2>Tracking Information</h2>
                            <p>Status: {trackingResult.status}</p>
                            <p>Estimated Delivery: {trackingResult.estimatedDeliveryDate}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="contact-section">
                <h2 className="contact-section-title">Any questions?</h2>
                <p>Feel free to email us at <a href="mailto:bldgtechnolgics@gmail.com">bldgtechnolgics@gmail.com</a> or contact us at <a href="tel:+1"></a></p>
                <div className="icon-container" id="icon-support-container">
                    <a href="https://www.facebook.com/profile.php?id=61560511531799" className="facebookAccount account fa-brands fa-facebook-f fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://x.com/BLDG_Tech" className="xAccount account fa-brands fa-x-twitter fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.instagram.com/bldg_build/" className="instagramAccount account fa-brands fa-instagram fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.tiktok.com/@bldgtech?lang=en" className="tiktokAccount account fa-brands fa-tiktok fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.youtube.com/channel/UCkdwly93IN-U34duTFW_ipA" className="youtubeAccount account fa-brands fa-youtube fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                </div>
                <div className="info-cards-section">
                <div className="info-card">
                    <img src="path-to-your-image1.jpg" alt="Description" className="info-card-image" />
                    <h3 className="info-card-title">Card Title 1</h3>
                    <p className="info-card-text">Some information about this card.</p>
                    <button className="info-card-button">Click Me</button>
                </div>
                <div className="info-card">
                    <img src="path-to-your-image2.jpg" alt="Description" className="info-card-image" />
                    <h3 className="info-card-title">Card Title 2</h3>
                    <p className="info-card-text">Some information about this card.</p>
                    <button className="info-card-button">Click Me</button>
                </div>
                <div className="info-card">
                    <img src="" alt="Description" className="info-card-image" />
                    <h3 className="info-card-title">Card Title 3</h3>
                    <p className="info-card-text">Some information about this card.</p>
                    <button className="info-card-button">Click Me</button>
                </div>
                </div>
            </section>
        </main>
    );
}

/*<dotlottie-player src="https://lottie.host/a75d8650-3e32-4c96-9b6c-f232485d8698/6dYIm4J7FU.json" background="transparent" speed="1" style={{width: "750px", height: "75px"}} loop autoplay></dotlottie-player>*/


