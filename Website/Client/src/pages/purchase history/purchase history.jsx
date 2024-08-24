import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PurchaseHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userUUID = localStorage.getItem('userUUID'); // Assuming you're storing userUUID in localStorage
                const response = await axios.get(`/api/orders/${userUUID}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <main>
            <h2>Welcome to your Purchase History</h2>
            <p>Here you will be able to monitor all your purchases as well as their arrival times and any information regarding them.</p>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <h3>Order placed on: {new Date(order.createdAt).toLocaleDateString()}</h3>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} - ${item.price} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                        <p>Total: ${order.totalAmount}</p>
                        <p>Status: {order.status}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
