var c = [];
var count = 0;
let tot = 0;
window.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("asunc");
        const res = await fetch('/check-session');
        const contentType = res.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text(); // debug the actual response
            console.error('Not JSON:', text);
            return;
        }
        const data = await res.json();

        const profile = document.querySelector('.profile');
        const loginlink = document.querySelector('.loginlink');

        if (data.loggedIn) {
            profile.style.display = 'block';
            profile.textContent = `Hello, ${data.name}`;
            loginlink.style.display = 'none';
        } else {
            profile.style.display = 'none';
            loginlink.style.display = 'block';
        }
    } catch (err) {
        console.error('Session check failed', err);
    }
});

const checkout=document.getElementById("checkout");
checkout.addEventListener('click',()=>{
    if(count>0){
    window.location.href="checkout.html";}
})
window.addEventListener("DOMContentLoaded", () => {
    const savecart=localStorage.getItem('cartitems');
    const cartcount=localStorage.getItem('cartcount')
    const carttotal=localStorage.getItem('carttotal')
    if(savecart&&cartcount&&carttotal){
        c=JSON.parse(savecart);
        console.log(c);
        count=parseInt(cartcount);
        cou.textContent = count > 99 ? "99+" : count;
        cou.style.cssText = count > 99 ? "font-size:10px" : "font-size:15px";
        carts();
    }
});
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
const addcart = (product, price, image) => {
    count = count + 1;
    let exist = c.find(item => item.product === product);
    if (exist) {
        exist.quantity += 1;
    }
    else {
        c.push({ product, price, image, quantity: 1 });
    }
    if (count > 99) {
        cou.textContent = `99+`;
        cou.style.cssText = "font-size:10px"
    }
    else {
        cou.textContent = `${count}`;
        cou.style.cssText = "font-size:15px"
    }

    carts();
    carticon.classList.add('bounce');
    setTimeout(() => {
        carticon.classList.remove('bounce');
    }, 1000);

    cp.classList.add('up');
    cp1.classList.add('up');
    cp2.classList.add('up');
    setTimeout(() => {
        cp.classList.remove('up');
        cp1.classList.remove('up');
        cp2.classList.remove('up');
    }, 1000);
  
}
function savecart() {
    localStorage.setItem('cartitems', JSON.stringify(c));
    console.log(JSON.stringify(c));
    localStorage.setItem('cartcount', count.toString());
    localStorage.setItem('carttotal', tot.toString());
}
let coun = 0;
const carts = () => {
    tot = 0;
    if (count > 0) {

        carti.innerHTML = c.map((item, index) => {
            tot += item.price * item.quantity;
            return `<div class='pcart'><h6>${item.product}</h6><img src='${item.image}' alt='product'><p>${item.price}</p>
        <div class="qty-controls">Quantity
                        <button onclick="decreaseQty(event,${index})">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQty(event,${index})">+</button>
                    </div><button class="remove-btn" data-index=${index}>remove</button></div>`;
        }).join('');
        total.innerHTML = "Total:$" + tot.toFixed(2);
    }
    else {
        carti.innerHTML = '<div style="display:flex;  flex-direction:column;"><h1 style="margin: 0px 0 10px 0px;">Nothing in the cart.</h1><p style=" margin: 0; font-size:200px;">🛒</p></div>';

        clearc.style.display = 'none';
        total.innerHTML = "";
    }
    savecart();
}
const increaseQty = (e, index) => {
    e.stopPropagation();
    c[index].quantity++;
    count++;
    if (count > 99) {
        cou.textContent = `99+`;
        cou.style.cssText = "font-size:10px"
    }
    else {
        cou.textContent = `${count}`;
        cou.style.cssText = "font-size:15px"
    }
    carts();
}
const decreaseQty = (e, index) => {
    e.stopPropagation();
    if (c[index].quantity > 1) {
        count--;
        c[index].quantity--;
    }
    else {
        c.splice(index, 1);
        count--;
    }
    if (count > 99) {
        cou.textContent = `99+`;
        cou.style.cssText = "font-size:10px"
    }
    else {
        cou.textContent = `${count}`;
        cou.style.cssText = "font-size:15px"
    }
    carts();
}
const cart = () => {
    if (count > 0) {
        checkout.style.display = 'block';
        clearc.style.display = 'block';
        cartp.style.display = 'block';
        cartp.classList.toggle("open");
        overlay.classList.toggle("over")
    }

    else {
        checkout.style.display='none';
        clearc.style.display = 'none';
        cartp.style.display = 'block';
        cartp.classList.toggle("open");
        overlay.classList.toggle("over");
        carti.innerHTML = '<div style="display:flex;  flex-direction:column;"><h1 style="margin: 0px 0 10px 0px;">Nothing in the cart.</h1><p style=" margin: 0; font-size:200px;">🛒</p></div>';


    }

}
const clearcart = () => {
    
    checkout.style.display='none';
       
    clearc.style.display = 'none';
    c = []; count = 0;tot=0;
    cou.textContent = `${count}`;
    total.innerHTML = "";
    carti.innerHTML = '<div style="display:flex;  flex-direction:column;"><h1 style="margin: 0px 0 10px 0px;">Nothing in the cart.</h1><p style=" margin: 0; font-size:200px;">🛒</p></div>';
    savecart();
}

document.addEventListener("click", (e) => {
    if (!cartp.contains(e.target) && !e.target.closest("#cart")&&!e.target.classList.contains("model")) {
        overlay.classList.remove("over");
        cartp.classList.remove("open");
    
    }
});

const remove = (index) => {
    count -= c[index].quantity;
    c.splice(index, 1);

    cou.textContent = `${count}`;

    if (count === 0) {
        total.innerHTML = "";
        clearc.style.display = 'none';
        carti.innerHTML = '<div style="display:flex;  flex-direction:column;"><h1 style="margin: 0px 0 10px 0px;">Nothing in the cart.</h1><p style=" margin: 0; font-size:200px;">🛒</p></div>';
        savecart();
    } else {
savecart();
        carts();
    }
}
carti.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {

        const index = parseInt(e.target.getAttribute("data-index"));
        remove(index);
        e.stopPropagation();
    }
});
const nothing = document.getElementById("nothing");
const searchbar = document.getElementById("search-bar");
const productcards = document.querySelectorAll(".products-card");


const fillcb = document.querySelectorAll(".fil-cb");

function sortf(input, section) {

    const productcards = Array.from(section.querySelectorAll('.products-card'));
    console.log("Product cards found:", productcards.length);
    var grid = section.querySelector('.products-grid');
   
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
            const nameA = a.querySelector('h3', 'h5').textContent.trim().toLowerCase();
            const nameB = b.querySelector('h3', 'h5').textContent.trim().toLowerCase();
            return nameA.localeCompare(nameB);
        });
    } else if (input === "name-desc") {
        productcards.sort((a, b) => {
            const nameA = a.querySelector('h3', 'h5').textContent.trim().toLowerCase();
            const nameB = b.querySelector('h3', 'h5').textContent.trim().toLowerCase();
            return nameB.localeCompare(nameA);
        });
    }

    grid = section.querySelector('.products-grid');
    grid.innerHTML = " ";
    productcards.forEach(card => grid.appendChild(card));

}

const searchfilt = () => {
    const searcht = searchbar.value.toLowerCase();
    const sections = document.querySelectorAll("section[class^='featured-products']");
    const activeFiltersContainer = document.getElementById("active-filters");
    activeFiltersContainer.innerHTML = '';
    activeFiltersContainer.style.display = 'none';
    const active = [];
    fillcb.forEach((item) => {
        if (item.checked) {

            active.push(item.value);
            const tag = document.createElement("span");
            tag.textContent = item.value;
            tag.className = "filter-tag";
            activeFiltersContainer.style.display = 'flex';
            activeFiltersContainer.appendChild(tag);
        }
    });
    
        let pc = 0;
        sections.forEach(section => {
            
            let visible = 0;
            const productcards = section.querySelectorAll(".products-card");
            productcards.forEach(card => {
                const productname = card.querySelector("h3");
                const productn = productname?.textContent.toLowerCase() || "";
                const msearch = productn.includes(searcht);
                const mfilter = active.length === 0 || active.some(f => card.classList.contains(f));
    
                if (msearch && mfilter) {
                    card.style.display = 'block';
                    pc++;
                   visible++;
                } else {
                    card.style.display = 'none';
                }
            }); 
            section.style.display = visible ? 'block' : 'none';
            pc += visible;
        });
        nothing.style.display = (pc === 0) ? 'block' : 'none';
    
}
searchbar.addEventListener("input", searchfilt);
fillcb.forEach(cb => cb.addEventListener("change", searchfilt));




