const products = {
    Smoother: {
        id: "1",
        name: "Smoother",
        description: "Unleash Your Gaming Potential Without Breaking the Bank! <br>Introducing our latest budget-friendly gaming PC, designed for gamers who demand performance without the hefty price tag. This low-end gaming powerhouse is perfect for diving into the world of gaming, whether you're exploring vast open worlds, competing in intense multiplayer battles, or embarking on epic quests.",
        price: 649.99,
        features: ["4K Resolution", "Smart Features", "HDR"],
        imageUrl1: "../Media/smoother/smoother1.jpg",
        imageUrl2: "../Media/smoother/smoother2.jpg",
        imageUrl3: "../Media/smoother/smoother3.jpg",
        imageUrl4: "../Media/smoother/smoother4.jpg"
    },
    Beast: {
        id: "2",
        name: "Beast",
        description: "Elevate Your Gaming Experience with Our Next-Level Gaming PC! <br>Step up your game with our new gaming PC, crafted for gamers who seek a perfect balance of performance, quality, and affordability. Whether you're aiming for high scores, exploring new worlds, or streaming your gameplay, this gaming rig is built to deliver an exceptional experience - Take the next step in your gaming journey and secure your system now!",
        price: 999.99,
        features: ["100% Cotton", "Machine Washable", "Various Colors"],
        imageUrl1: "../Media/beast/beast1.jpg",
        imageUrl2: "../Media/beast/beast2.png",
        imageUrl3: "../Media/beast/beast3.png",
        imageUrl4: "../Media/beast/beast4.png"
    },
    Terminator: {
        id: "3",
        name: "Terminator",
        description: "Enhance Your Gaming Experience with Our Advanced Gaming PC! <br>Take your gaming to new heights with our advanced gaming PC, designed for enthusiasts who seek impressive performance and cutting-edge technology. Whether you're conquering the latest AAA titles, streaming your gameplay, or creating content, this rig delivers the power and precision needed to excel.",
        price: 1299.99,
        features: ["Genuine Leather", "3-Seater", "Reclining Function"],
        imageUrl1: "../Media/terminator/terminator1.jpg",
        imageUrl2: "../Media/terminator/terminator2.jpg",
        imageUrl3: "../Media/terminator/terminator3.png",
        imageUrl4: "../Media/terminator/terminator4.png"
    },
    Spaceship: {
        id: "4",
        name: "Spaceship",
        description: "Command the Game with Our Ultimate Gaming PC! <br>Introducing the pinnacle of gaming technology: our Ultimate Gaming PC. Designed for the most demanding gamers and tech enthusiasts, this machine combines unrivaled power, cutting-edge features, and exceptional build quality. Whether you're playing the latest AAA titles, streaming in 4K, or creating high-end content, this rig delivers an unparalleled experience.",
        price: 1999.99,
        features: ["Genuine Leather", "3-Seater", "Reclining Function"],
        imageUrl1: "../Media/spaceship/spaceship1.jpg",
        imageUrl2: "../Media/spaceship/spaceship2.png",
        imageUrl3: "../Media/spaceship/spaceship3.png",
        imageUrl4: "../Media/spaceship/spaceship4.png"
    }
};

function updateProductDisplay(category) {
    var product = products[category];
    document.querySelector(".product-image1").src = product.imageUrl1;
    document.querySelector(".product-image2").src = product.imageUrl2;
    document.querySelector(".product-image3").src = product.imageUrl3;
    document.querySelector(".product-image4").src = product.imageUrl4;
    document.getElementById("product-image").alt = `${product.name} Image`;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").innerHTML = product.description;
    document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
    document.querySelector(".cart-button").setAttribute("data-id", product.id);

    const featuresElement = document.getElementById("product-features");
    featuresElement.innerHTML = "<h3>Features:</h3><ul>";
    product.features.forEach(feature => {
        featuresElement.innerHTML += `<li>${feature}</li>`;
    });
    featuresElement.innerHTML += "</ul>";
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    if (product && products[product]) {
        updateProductDisplay(product);
    } else {
        // Handle case where no valid product is specified
        console.error('No valid product specified');
        // You might want to redirect to a 404 page or show a default product
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector(".products");
    const cartTotal = document.getElementById('cart-total');
    const cart = document.querySelector(".cart");
    const cartIcon = document.querySelector(".fa-cart-shopping");

    let isCartVisible = false;

    function toggleCart() {
        if (!isCartVisible) {
            cart.style.display = 'flex';
            cart.style.right = '14px';
        } else {
            cart.style.right = '-600px';
        }
        isCartVisible = !isCartVisible;
    }

    cartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        toggleCart();
    });

    function updateCart(category) {
        const product = products[category];
        if (!product) return;

        const existingProduct = cartItemsContainer.querySelector(`.product-on-cart[data-name="${product.name}"]`);
        
        if (existingProduct) {
            // Product already in cart, update quantity
            const quantityInput = existingProduct.querySelector('input[type="number"]');
            quantityInput.value = parseInt(quantityInput.value) + 1;
        } else {
            // Product not in cart, add new product
            const productHTML = `
                <div class="product-on-cart" data-name="${product.name}">
                    <img class="cart-item-image" src="${product.imageUrl1}">
                    <div>
                        <h2>${product.name}</h2>
                        <p>Price: $${product.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-from-cart" data-id="${product.id}" data-name="${product.name}">-</button>
                    <input type="number" id="quantity" min="0" value="1">
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">+</button>
                </div>`;
            cartItemsContainer.insertAdjacentHTML('beforeend', productHTML);
            attachEventListeners();
        }

        updateSubtotal();
    }

    function updateSubtotal() {
        let total = 0;
        const quantityInputs = cartItemsContainer.querySelectorAll('input[type="number"]');
        quantityInputs.forEach(input => {
            const productDiv = input.closest('.product-on-cart');
            const price = parseFloat(productDiv.querySelector('.add-to-cart').getAttribute('data-price'));
            const quantity = parseInt(input.value);
            total += price * quantity;
        });
        cartTotal.textContent = total.toFixed(2);
    }

    function attachEventListeners() {
        const addButtons = cartItemsContainer.querySelectorAll('.add-to-cart');
        const removeButtons = cartItemsContainer.querySelectorAll('.remove-from-cart');
        const quantityInputs = cartItemsContainer.querySelectorAll('input[type="number"]');

        addButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                input.value = parseInt(input.value) + 1;
                updateSubtotal();
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.nextElementSibling;
                input.value = Math.max(1, parseInt(input.value) - 1);
                updateSubtotal();
            });
        });

        quantityInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.value = Math.max(1, parseInt(input.value) || 1);
                updateSubtotal();
            });
        });
    }
    // Initial setup
    updateSubtotal();
    attachEventListeners();
});


addEventListener("DOMContentLoaded", (event) => {
    // Add this inside the DOMContentLoaded event listener
    const addToCartButton = document.querySelector(".cart-button");
    if (addToCartButton) {
        addToCartButton.addEventListener("click", (event) => {
            event.preventDefault();
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('product');
            if (category && products[category]) {
                addToCart(products[category]);
            }
        });
    }
});
