
document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.querySelector(".checkout-button");
    
    checkoutButton.addEventListener("click", () => {
        const cartItems = loadCart();
        
        // Calculate total quantity across all items
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalQuantity === 0) {
            alert("Please add at least one item to the cart before checking out.");
            return;
        }

        const items = cartItems.filter(item => item.quantity > 0).map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        fetch("http://localhost:3000/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items }),
        })
        .then(res => {
            if (res.ok) return res.json()
            return res.json().then(json => Promise.reject(json))
        })
        .then(({ url }) => {
            window.location = url
        })
        .catch(e => {
            console.error('Checkout error:', e.error)
            alert('An error occurred during checkout. Please try again.')
        })
    });
});

// Update this function to enable/disable the checkout button based on cart contents
function updateCheckoutButtonState() {
    const checkoutButton = document.querySelector(".checkout-button");
    const cartItems = loadCart();
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    checkoutButton.disabled = totalQuantity === 0;
    checkoutButton.style.opacity = totalQuantity === 0 ? "0.5" : "1";
}

// Call this function whenever the cart is updated
function updateCart(cartItems) {
    // ... existing cart update logic ...

    updateCheckoutButtonState();
}

// Make sure to call updateCheckoutButtonState when the page loads
document.addEventListener('DOMContentLoaded', updateCheckoutButtonState);