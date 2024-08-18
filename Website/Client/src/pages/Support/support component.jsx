import { useEffect } from "react"


export default function Support() {
    useEffect(()=>{
        const orders = {
            "ORD001": { status: "Shipped", eta: "2024-08-10" },
            "ORD002": { status: "Processing", eta: "2024-08-15" },
            "ORD003": { status: "Delivered", eta: "2024-08-01" }
        };
        
        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const orderNumber = document.getElementById('orderNumber').value.trim();
            const resultDiv = document.getElementById('result');
        
            if (orders[orderNumber]) {
                const order = orders[orderNumber];
                resultDiv.innerHTML = `
                    <h2>Order ${orderNumber}</h2>
                    <p>Status: ${order.status}</p>
                    <p>Estimated Delivery: ${order.eta}</p>
                    <dotlottie-player src="https://lottie.host/8e87ee98-8ccd-444a-a013-896351570d50/fJsFC2Vbzn.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
                `;
                resultDiv.className = 'success';
            } else {
                resultDiv.innerHTML = `
                    <p>Order not found. Please check the order number and try again.</p>
                    <dotlottie-player src="https://lottie.host/ca9e48df-b90f-436a-b852-8965afb393ed/Hj0KGN9rey.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
                `;
                resultDiv.className = 'error';
            }
        });
    },[])
    return (
        <main className="support-main">

            <section className="product-search-section">
                <div className="support-image-header">
                    <h1 className="support-title">Support</h1>
                    <p className="support-text">get help that fits your needs</p>
                    <form id="search-support">
                        <input type="text" id="text-search-support" placeholder="Enter a product name" required />
                        <button type="submit" id="enter-search-support" className="fa-solid fa-magnifying-glass"></button>
                    </form>
                </div>
            </section>
        
        <section className="tracking-section" id="tracking-section">
            <h1 className="tracking-title">Order Tracking</h1>
                <form id="orderForm">
                    <input type="text" id="orderNumber" placeholder="Enter order number" required />
                    <button type="submit" className="order-button"><i className="fa-solid fa-truck-fast"></i></button>
                </form>
                <div id="result"></div>
        </section>

        <section className="contact-section">
            <h2>Any questions?</h2>
            <p>Feel free to email us at <a href="mailto:bldgtechnolgics@gmail.com">bldgtechnolgics@gmail.com</a> or contact us at <a href="tel:+1"></a></p>
            <div className="icon-container" id="icon-footer-container">
                <a href="https://www.facebook.com/profile.php?id=61560511531799" className="facebookAccount account fa-brands fa-facebook-f fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                <a href="https://x.com/BLDG_Tech" className="xAccount account fa-brands fa-x-twitter fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                <a href="https://www.instagram.com/bldg_build/" className="instagramAccount account fa-brands fa-instagram fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                <a href="https://www.tiktok.com/@bldgtech?lang=en" className="tiktokAccount account fa-brands fa-tiktok fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                <a href="https://www.youtube.com/channel/UCkdwly93IN-U34duTFW_ipA" className="youtubeAccount account fa-brands fa-youtube fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
            </div>
            <div className="contact-cards-container">
                <div className="email-card"></div>
                <div className="phone-card"></div>
                <div className="discord-card"></div>
            </div>
            <dotlottie-player src="https://lottie.host/2f47b6eb-1b01-47c7-bb91-9890a1e0496d/y0784nWolA.json" background="transparent" speed="1" style={{width: "600px", height: "600px"}} loop autoplay></dotlottie-player>
        </section>
    </main>
    )
}


/*<dotlottie-player src="https://lottie.host/a75d8650-3e32-4c96-9b6c-f232485d8698/6dYIm4J7FU.json" background="transparent" speed="1" style={{width: "750px", height: "75px"}} loop autoplay></dotlottie-player>*/


