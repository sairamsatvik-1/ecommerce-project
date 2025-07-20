// Global cart variables
var c = [];
var count = 0;
let tot = 0;

/**
 * Main function to run when the page content is loaded.
 * It checks the user's session, fetches products, and initializes the cart.
 */
async function initializeShop() {
    // --- Session and Profile Management ---
    try {
        const res = await fetch('/check-session');
        const data = await res.json();
        const profile = document.querySelector('.profile');
        const loginlink = document.querySelector('.loginlink');

        if (data.loggedIn) {
            profile.style.display = 'block';
            profile.innerHTML = `<span class="profileimg">&#128100;</span><span>Hello, ${data.name}</span>`;
            loginlink.style.display = 'none';
        } else {
            profile.style.display = 'none';
            loginlink.style.display = 'block';
        }
    } catch (err) {
        console.error('Session check failed', err);
    }

    // --- Product Loading ---
    const sections = ['feature-1', 'feature-2', 'feature-3'];
    sections.forEach(section => {
        fetch(`/api/products?section=${section}&limit=10`)
            .then(res => res.json())
            .then(products => {
                displayProducts(products, section);
            });
    });

    // --- Cart Initialization ---
    try {
        const res = await fetch("/api/cart/showcart");
        if (res.ok) {
            const data = await res.json();
            c = Array.isArray(data) ? data : [];
        } else {
            c = [];
            console.error("Could not fetch cart, server responded with status:", res.status);
        }
        count = c.reduce((acc, item) => acc + item.quantity, 0);
        cou.textContent = count > 99 ? "99+" : count;
        cou.style.cssText = count > 99 ? "font-size:10px" : "font-size:15px";
        carts();
    } catch (err) {
        c = [];
        console.error("Failed to fetch cart", err);
        carts();
    }
}


// --- Event Listeners ---
window.addEventListener('DOMContentLoaded', initializeShop);

const profileBtn = document.querySelector('.profile');
const profileModel = document.querySelector('.profilemodel');

profileBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
        const pres = await fetch("/profile");
        if (!pres.ok) throw new Error('Failed to fetch profile');
        const pdata = await pres.json();
        if (pdata) {
            profileModel.innerHTML = `
                <h3>Profile</h3>
                <div class="profilediv">
                    <h4>username:</h4>
                    <input type="text" id="profileUsername" value="${pdata.name}" readonly>
                    <h4>Email Id:</h4>
                    <input type="text" id="profileEmail" value="${pdata.email}" readonly>
                </div> 
                <button class="logout">Logout</button>`;
            profileModel.style.display = profileModel.style.display === "flex" ? "none" : "flex";
        }
    } catch (error) {
        console.error("Could not display profile:", error);
    }
});

profileModel.addEventListener('click', async (e) => {
    if (e.target.classList.contains('logout')) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const lres = await fetch("/logout");
            if (lres.ok) {
                window.location.reload();
            } else {
                alert("Server error trying to logout. Please try again.");
            }
        } catch (err) {
            console.error("Logout failed:", err);
            alert("Logout request failed. Please check your connection.");
        }
    }
});

document.addEventListener("click", (e) => {
    if (!profileModel.contains(e.target) && !profileBtn.contains(e.target)) {
        profileModel.style.display = "none";
    }
    if (!cartp.contains(e.target) && !e.target.closest("#cart") && !e.target.classList.contains("model")) {
        overlay.classList.remove("over");
        cartp.classList.remove("open");
    }
});

document.querySelectorAll('.view-more-btn').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.dataset.section;
        window.location.href = `/products-page.html?section=${section}`;
    });
});

/**
 * Displays products in the correct section on the page.
 */
function displayProducts(products, sectionname) {
    let section;
    if (sectionname === 'feature-1') {
        section = document.querySelector('.featured-products1');
    } else if (sectionname === 'feature-2') {
        section = document.querySelector('.featured-products2');
    } else if (sectionname === 'feature-3') {
        section = document.querySelector('.featured-products3');
    }

    if (!section) return;

    const productGrid = section.querySelector('.products-grid');

    products.forEach(async (product) => {
        const productDiv = document.createElement('div');
        const categoryClass = product.category.replace(/ /g, '-').toLowerCase();
        const subcategoryClass = product.subcategory.replace(/ /g, '-').toLowerCase();
        productDiv.classList.add('products-card', categoryClass, subcategoryClass);

        const escapedProductName = product.name.replace(/"/g, '&quot;');
        productDiv.innerHTML = `<h3 class="product-name">${product.name}</h3>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h6 style="display:none">${product.description}</h6>
            <p class="product-price">$${product.price}</p>
            <span class="rating-stars"></span>
            <div class='buttons'>
                <button class="add-to-cart-btn" data-name="${escapedProductName}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                <button class="quick-view">Quick view</button>
            </div>`;
        productGrid.appendChild(productDiv);

        const addToCartButton = productDiv.querySelector('.add-to-cart-btn');
        addToCartButton.addEventListener('click', () => {
            const name = addToCartButton.dataset.name;
            const price = parseFloat(addToCartButton.dataset.price);
            const image = addToCartButton.dataset.image;
            addcart(name, price, image);
        });

        const starDiv = productDiv.querySelector('.rating-stars');
        try {
            const res = await fetch(`/api/reviews/${product._id}`, { credentials: 'include' });
            const data = await res.json();
            const avg = Math.round(data.average);
            starDiv.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const span = document.createElement('span');
                span.innerHTML = ' &#9733';
                span.style.cssText = i <= avg ? "color:gold;text-shadow:0 0 5px black;" : "color:gray;";
                starDiv.appendChild(span);
            }
            const ratingCount = document.createElement('span');
            ratingCount.innerText = ` (${data.count} rating${data.count !== 1 ? 's' : ''})`;
            ratingCount.style.fontSize = '18px';
            ratingCount.style.color = 'black';
            starDiv.appendChild(ratingCount);
        } catch (err) {
            starDiv.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const span = document.createElement('span');
                span.innerHTML = '☆';
                starDiv.appendChild(span);
            }
            const span = document.createElement('span');
            span.innerHTML = ' No ratings yet';
            span.style.cssText = "font-size:18px;color:black;";
            starDiv.appendChild(span);
        }
    });
}

// --- Cart Panel Logic ---
const checkout = document.getElementById("checkout");
const total = document.getElementById("cart-total");
const cou = document.getElementById("cart-count");
const carti = document.getElementById("cart-items");
const cartp = document.getElementById("cart-pannel");
const clearc = document.getElementById("clearcart");
const overlay = document.getElementById("overlay");
const cp = document.getElementById("cp");
const cp1 = document.getElementById("cp1");
const cp2 = document.getElementById("cp2");
const carticon = document.querySelector(".cart-icon");

checkout.addEventListener('click', () => {
    if (count > 0) {
        window.location.href = "checkout.html";
    }
});

const addcart = async (productName, price, image) => {
    try {
        const cres = await fetch("/api/cart/addtocart", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ productId: productName, image, price, quantity: 1 })
        });
        if (cres.ok) {
            const updatedCart = await cres.json();
            c = updatedCart;
            count = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
            cou.textContent = count > 99 ? "99+" : count;
            cou.style.cssText = count > 99 ? "font-size:10px" : "font-size:15px";
            carts();
            carticon.classList.add('bounce');
            setTimeout(() => carticon.classList.remove('bounce'), 1000);
            cp.classList.add('up');
            cp1.classList.add('up');
            cp2.classList.add('up');
            setTimeout(() => {
                cp.classList.remove('up');
                cp1.classList.remove('up');
                cp2.classList.remove('up');
            }, 1000);
        } else {
            window.location.href = "account.html";
        }
    } catch (err) {
        console.error("Error adding to cart:", err);
    }
};

const carts = () => {
    tot = 0;
    if (count > 0) {
        checkout.style.display = 'block';
        clearc.style.display = 'block';
        carti.innerHTML = c.map((item, index) => {
            tot += item.price * item.quantity;
            return `<div class='pcart'><h6>${item.productId}</h6><img src='${item.image}' alt='product'><p>${item.price}</p>
                <div class="qty-controls">Quantity
                    <button onclick="decreaseQty(event,${index})">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQty(event,${index})">+</button>
                </div><button class="remove-btn" data-index=${index}>remove</button></div>`;
        }).join('');
        total.innerHTML = "Total:$" + tot.toFixed(2);
    } else {
        carti.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center;"><h1 style="margin: 0 0 10px 0;">Nothing in the cart.</h1><p style=" margin: 0; font-size:200px;">🛒</p></div>';
        checkout.style.display = 'none';
        clearc.style.display = 'none';
        total.innerHTML = "";
    }
};

const updatecart = async (index) => {
    try {
        const res = await fetch("/api/cart/updatecart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: c[index].productId,
                quantity: c[index].quantity
            })
        });
        if (!res.ok) {
            console.error("Failed to update quantity on server.");
        }
    } catch (err) {
        console.log("Error updating cart:", err);
    }
};

const increaseQty = (e, index) => {
    e.stopPropagation();
    c[index].quantity++;
    count++;
    cou.textContent = count > 99 ? "99+" : `${count}`;
    cou.style.cssText = count > 99 ? "font-size:10px" : "font-size:15px";
    updatecart(index);
    carts();
};

const decreaseQty = (e, index) => {
    e.stopPropagation();
    if (c[index].quantity > 1) {
        c[index].quantity--;
        count--;
        cou.textContent = count > 99 ? "99+" : `${count}`;
        cou.style.cssText = count > 99 ? "font-size:10px" : "font-size:15px";
        updatecart(index);
        carts();
    } else {
        remove(index);
    }
};

const cart = () => {
    cartp.classList.toggle("open");
    overlay.classList.toggle("over");
};

const clearcart = async () => {
    try {
        const res = await fetch("/api/cart/clear");
        if (res.ok) {
            c = [];
            count = 0;
            tot = 0;
            cou.textContent = `${count}`;
            carts();
        } else {
            alert("Could not clear cart. Try again.");
        }
    } catch (err) {
        console.error("Error clearing cart", err);
    }
};

const remove = async (index) => {
    try {
        const res = await fetch("/api/cart/removefromcart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: c[index].productId })
        });
        if (res.ok) {
            count -= c[index].quantity;
            c.splice(index, 1);
            cou.textContent = count > 99 ? "99+" : `${count}`;
            carts();
        } else {
            alert("Failed to remove item");
        }
    } catch (err) {
        console.error("Remove failed", err);
    }
};

carti.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const index = parseInt(e.target.getAttribute("data-index"));
        remove(index);
        e.stopPropagation();
    }
});

// --- Filtering and Sorting ---
const nothing = document.getElementById("nothing");
const searchbar = document.getElementById("search-bar");
const fillcb = document.querySelectorAll(".fil-cb");
const sortSelects = document.querySelectorAll(".sort-options");

sortSelects.forEach(select => {
    select.addEventListener("change", () => {
        const section = select.closest("section");
        const value = select.value;
        sortf(value, section);
    });
});

function sortf(input, section) {
    const productcards = Array.from(section.querySelectorAll('.products-card'));
    var grid = section.querySelector('.products-grid');
    if (!grid) return;

    if (input === "price-low") {
        productcards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').textContent.replace(/[^0-9.]/g, '') || '0');
            const priceB = parseFloat(b.querySelector('p').textContent.replace(/[^0-9.]/g, '') || '0');
            return priceA - priceB;
        });
    } else if (input === "price-high") {
        productcards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').textContent.replace(/[^0-9.]/g, '') || '0');
            const priceB = parseFloat(b.querySelector('p').textContent.replace(/[^0-9.]/g, '') || '0');
            return priceB - priceA;
        });
    } else if (input === "name-asc") {
        productcards.sort((a, b) => {
            const nameA = a.querySelector('h3').textContent.trim().toLowerCase();
            const nameB = b.querySelector('h3').textContent.trim().toLowerCase();
            return nameA.localeCompare(nameB);
        });
    } else if (input === "name-desc") {
        productcards.sort((a, b) => {
            const nameA = a.querySelector('h3').textContent.trim().toLowerCase();
            const nameB = b.querySelector('h3').textContent.trim().toLowerCase();
            return nameB.localeCompare(nameA);
        });
    }

    grid.innerHTML = "";
    productcards.forEach(card => grid.appendChild(card));
}

const searchfilt = () => {
    const searcht = searchbar.value.toLowerCase();
    const sections = document.querySelectorAll("section[class^='featured-products']");
    const activeFiltersContainer = document.getElementById("active-filters");
    activeFiltersContainer.innerHTML = '';
    activeFiltersContainer.style.display = 'none';
    const active = [];

    // UPDATED LOGIC: This function now correctly handles your new filter HTML.
    fillcb.forEach((item) => {
        if (item.checked) {
            // IMPORTANT: This code reads the text from the <label> next to the checkbox.
            // For the filter to work, this text (e.g., "Foot wear") must match the
            // 'category' in your product data (e.g., product.category = "Foot wear").
            // The code handles spaces and capitalization automatically.
            const labelText = item.parentElement.textContent.trim();
            const filterClass = labelText.replace(/ /g, '-').toLowerCase();
            active.push(filterClass);

            const tag = document.createElement("span");
            tag.textContent = labelText;
            tag.className = "filter-tag";
            activeFiltersContainer.style.display = 'flex';
            activeFiltersContainer.appendChild(tag);
        }
    });

    let totalVisibleProducts = 0;
    sections.forEach(section => {
        let visibleInSection = 0;
        const productcards = section.querySelectorAll(".products-card");
        productcards.forEach(card => {
            const productname = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const matchesSearch = productname.includes(searcht);
            // This checks if the product card has the class generated from the label text.
            const matchesFilter = active.length === 0 || active.some(f => card.classList.contains(f));

            if (matchesSearch && matchesFilter) {
                card.style.display = 'block';
                visibleInSection++;
            } else {
                card.style.display = 'none';
            }
        });
        section.style.display = visibleInSection > 0 ? 'block' : 'none';
        totalVisibleProducts += visibleInSection;
    });
    nothing.style.display = (totalVisibleProducts === 0) ? 'block' : 'none';
};

searchbar.addEventListener("input", searchfilt);
fillcb.forEach(cb => cb.addEventListener("change", searchfilt));
// --- CHATBOT JAVASCRIPT ---
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotContainer = document.querySelector(".chatbot-container");
const chatbotCloseBtn = document.querySelector(".chatbot-close-btn");
const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send-btn");
const chatbox = document.querySelector(".chatbox");

// Toggle chatbot visibility
chatbotToggler.addEventListener("click", () => chatbotContainer.classList.toggle("show"));
chatbotCloseBtn.addEventListener("click", () => chatbotContainer.classList.remove("show"));

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    // Use a list item for proper structure in the chatbox if it's a <ul> or <ol>
    // If chatbox is a div, this is fine.
    let chatContent = `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const handleChat = async () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear input and display user message
    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Display "Thinking..." message
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    try {
        // IMPORTANT: This URL must match the address of your running Python server.
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userMessage })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }

        const data = await response.json();
        incomingChatLi.querySelector("p").textContent = data.answer;

    } catch (error) {
        console.error("Error fetching chatbot response:", error);
        incomingChatLi.querySelector("p").textContent = "Oops! Something went wrong. Please try again.";
        incomingChatLi.querySelector("p").style.color = "red";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}

chatSendBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});