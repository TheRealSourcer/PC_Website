export default function AboutUs() {
    return (
        <main>
        
        <section className="about-section about-hero">
            <h2 className="hero-title">About Us</h2>
            <p className="hero-message">For gamers everywhere.</p>
        </section>
        
        <section className="about-section mission">
            <div className="title-text">
                <h2 className="title">Our Mission</h2>
                <p className="about-text">
                    This company was founded because we once tried to buy a pc. but i couldnt find any pre-built pc for less than 1000 bucks that wasn´t a ripoff, so we decided to take it upon ourselves to try and offer the best prices in the market with a reliable insurance and real customer support for performance builds all around the globe.
                </p>
            </div>
            <dotlottie-player src="https://lottie.host/49c04db8-d2b8-4070-a259-25cdd5838c99/i9PMMvnilk.json" background="transparent" speed="1" style={{width: "500px", height: "500px"}} loop autoplay className="about-us-animation"></dotlottie-player>
        </section>
    
        <section className="about-section performance">
            <div className="title-text">
                <h2 className="title">Performance</h2>
                <p className="about-text">
                    This company was founded because we once tried to buy a pc. but i couldnt find any pre-built pc for less than 1000 bucks that wasn´t a ripoff, so we decided to take it upon ourselves to try and offer the best prices in the market with a reliable insurance and real customer support for performance builds all around the globe.
                </p>
            </div>
            <dotlottie-player src="https://lottie.host/034552f2-5962-4bef-b6ae-d1b4ba62a82c/ZoxtBVFy7S.json" background="transparent" speed="1" style={{width: "500px", height: "500px"}} loop autoplay className="about-us-animation"></dotlottie-player>
        </section>
    
        <section className="about-section warranty">
            <div className="title-text">
                <h2 className="title">We offer warranty</h2>
                <p className="about-text">
                    In case your pc doesn´t work, always rember we offer warranty, we understand we make mistakes and we are willing to fix them ;)
                </p>
            </div>
            <dotlottie-player src="https://lottie.host/507f2428-e074-4f18-badc-c3859a0fd411/wcR38FQSL1.json" background="transparent" speed="1" style={{width: "500px", height: "500px"}} loop autoplay ></dotlottie-player>
        </section>
    
        <section className="about-section thank-you">
            <div className="title-text">
                <h2 className="title">Thank You!</h2>
                <p className="about-text">
                    Thank you regardless of if you chose to buy or now, so ... thank you genuinly for visiting our website, not all heroes ware capes, maybe you do🤨
                    The BLDG will always consider you a friend.
                    <br />
                    <br />
                    sincerily, the BLDG team.
                </p>
            </div>
            <div>
                <dotlottie-player src="https://lottie.host/be5dc02b-06ad-4b49-a503-86e106c8b05b/3ZTWb84mRz.json" background="transparent" speed="1" style={{width: "500px", height: "500px"}}  loop autoplay className="about-us-animation"></dotlottie-player>
            </div>
        </section>
    
    </main>
    )
}