import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import LogoImage from './assets/Logo.png';

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBestSellersClick = (e) => {
        e.preventDefault();
        navigate('/', { replace: true, state: { scrollTo: 'pc-container' } });
    };

    useEffect(() => {
        const { state } = location;
        if (state && state.scrollTo) {
            const element = document.getElementById(state.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            // Clear the state to prevent re-scrolling on route changes
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    return (
        <nav className="navigation">
            <div className="nav-left">
                <i className="fa-solid fa-bars bars"></i>
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
                <i className="fa-solid fa-cart-shopping cart-icon"></i>
            </div>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}

document.querySelectorAll('.choose').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        window.location.href = `../Dream PC/dream pc.html?product=${product}`;
    });
});