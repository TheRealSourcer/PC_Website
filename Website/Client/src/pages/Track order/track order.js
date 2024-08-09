// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './track order';

function App() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/order/${orderNumber}`);
      setOrderStatus(response.data);
      setError('');
    } catch (error) {
      setOrderStatus(null);
      setError('Order not found or server error');
    }
  };

  return (
    <div className="App">
      <h1>Order Tracking</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter order number"
          required
        />
        <button type="submit">Track Order</button>
      </form>
      {error && <p className="error">{error}</p>}
      {orderStatus && (
        <div className="order-status">
          <h2>Order {orderStatus.orderNumber}</h2>
          <p>Status: {orderStatus.status}</p>
          <p>ETA: {new Date(orderStatus.eta).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default App;

