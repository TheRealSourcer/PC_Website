//you might not need this after te new code Claude generated

// Simulate order data (replace this with actual data storage/retrieval)
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
        `;
        resultDiv.className = 'success';
    } else {
        resultDiv.textContent = 'Order not found. Please check the order number and try again.';
        resultDiv.className = 'error';
    }
});