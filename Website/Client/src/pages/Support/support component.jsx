export default function Support() {
    return (
        <main>
        <div className="container">
            <h1>Order Tracking</h1>
            <form id="orderForm">
                <input type="text" id="orderNumber" placeholder="Enter order number" required />
                <button type="submit">Track Order</button>
            </form>
            <div id="result"></div>
        </div>
    </main>
    
    )
}