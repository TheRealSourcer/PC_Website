import React from "react"
import { Link } from "react-router-dom"

export default function Success() {
    return (
        <main>
            <h2>Your Purchase was successful!</h2>
            <p>We added your item to your purchase history, you can track your order there as well</p>
            <Link to="/purchase history">purchase history</Link>
        </main>
    )
}