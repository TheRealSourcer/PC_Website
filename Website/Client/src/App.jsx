import React from 'react';
import { Route, Routes } from "react-router-dom";
import Cursor from "./Cursor.jsx";
import Navbar from "./NavBar.jsx";
import Menu from './Menu.jsx';
import Cart from "./Cart.jsx";
import Footer from "./Footer.jsx";
import AboutUs from "./pages/about us/about us.jsx";
import Home from "./pages/Home/Home.jsx";
import Support from "./pages/Support/support component.jsx";
import TrackOrder from "./pages/Track order/track order component.jsx";
import WhyTheBldg from "./pages/why the bldg/why the bldg.jsx";
import PrivacyPolicy from "./pages/privacy policy/privacy policy.jsx";
import RefundPolicy from "./pages/refund policy/refund policy.jsx";
import ShippingPolicy from "./pages/shipping policy/shipping policy.jsx";
import Reviews from "./pages/reviews/reviews.jsx";
import TermsAndConditions from "./pages/terms and conditions/terms and conditions.jsx";
import BldgUpgrader from "./pages/bldg upgrader/bldg upgrader.jsx";
import DreamPc from "./pages/dream PC/dream pc component.jsx";
import Success from './pages/success/success.jsx';
import Cancel from './pages/cancel/cancel.jsx';
import PurchaseHistory from './pages/purchase history/purchase history.jsx';

function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      <Menu />
      <Cart />   
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Support" element={<Support />} />
          <Route path="/About Us" element={<AboutUs />} />
          <Route path="/pc" element={<DreamPc />} />
          <Route path="/Reviews" element={<Reviews />} />
          <Route path="/Why the BLDG" element={<WhyTheBldg />} />
          <Route path="/Track Order" element={<TrackOrder />} />
          <Route path="/BLDG Upgrader" element={<BldgUpgrader />} />
          <Route path="/Terms & Conditions" element={<TermsAndConditions />} />
          <Route path="/Privacy Policy" element={<PrivacyPolicy />} />
          <Route path="/Refund Policy" element={<RefundPolicy />} />
          <Route path="/Shipping Policy" element={<ShippingPolicy />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/Cancel" element={<Cancel />} />
          <Route path="/Purchase History" element={<PurchaseHistory />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;