
const cartitem=document.querySelector('.cartitems');
const totalv=document.querySelector('.total');

var c=[];
let total=0;
window.addEventListener("DOMContentLoaded",()=>{
    rendercart();
})

async function rendercart(){
    try {
        const res = await fetch("/api/cart/checkout");
        const data = await res.json();
        c = data || [];
        total=0;
        let count=0;

        cartitem.innerHTML="";
       
        if(c.length<=0){
            window.location.replace('myproject.html');
        }
        c.forEach((item,index)=>{
            let totp=parseFloat(`${item.quantity}`)*parseFloat(`${item.price}`)
            total+=totp;
            count+=parseInt(item.quantity);
            cartitem.innerHTML+=`<div class='cart' data-index="${index}"><div class="name">${item.productId}</div><img src="${item.image}"><p>Price:$${item.price.toFixed(2)}<p><div class="quapri"><span>Qty</span><span>Totprice</span></div><div class="quapriv"><span>${item.quantity}</span><span>$${totp}</span></div><button class="rem-btn">Remove</button></div>`
        })
        total=total.toFixed(2);
        totalv.innerHTML=`Total cost:$${total}`;
       
        
      
    }
    catch(err){
console.log(err);
    }
  
}
document.addEventListener('click',async (e)=>{
    if(e.target.classList.contains('rem-btn')){
        if (confirm('Are you sure you want to remove this item?')) {
            let pcart=e.target.closest('.cart');
       let index=pcart.getAttribute('data-index');
      try {const res = await fetch("/api/cart/removefromcart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId: c[index].productId })
    });
    if(res.ok){
   
   
rendercart();
}}
catch(err){
    console.log(err);
}

}}});
const username=document.getElementById("username");
const mobileno=document.getElementById("mobileno");
const address=document.getElementById("address");
const email=document.getElementById("email");
document.addEventListener('submit',(e)=>{
   e.preventDefault();
   if(address.parentNode.querySelector('span')){
    address.parentNode.querySelector('span').remove();
   }
   if(username.parentNode.querySelector('span')){
    username.parentNode.querySelector('span').remove();
   }
   if(username.value.length<6||!/^[A-Za-z]+$/.test(username.value)){
    const tag=document.createElement('span');
    tag.style.cssText='color:red;font-size:10px;';
    tag.textContent = "name atleast 6 charecters required and only alphabets";
    username.parentNode.appendChild(tag);
    return;
   }
   if(address.value===""||address.value.trim(',').length<20){
    const tag=document.createElement('span');
    tag.style.cssText='color:red';
    tag.textContent = "Address is required and minimun length 10";
    address.parentNode.appendChild(tag);
    return;
   }
   if(confirm(`${username.value} is you confirm to placeorder with total amount ${total}`)){
    localStorage.setItem('name',username.value);
    localStorage.setItem('mobileno',mobileno.value) 
    localStorage.setItem('address',address.value);
    localStorage.setItem('email',email.value);
    username.value="";
    mobileno.value="";
    address.value="";
    email.value="";
    if(c.length>0){
   startpayment();
rendercart();
   }}
});

function startpayment() {
    console.log(localStorage.getItem('carttotal'));
    var options = {
        "key": "rzp_test_9WA6N1VTbMoyqI", 
        "amount": (total*100).toFixed(2), 
        "currency": "INR",
        "name": "My Shop",
        "description": "Thank you for your order",
        
        "handler": function (response){
            localStorage.setItem('paymentid', response.razorpay_payment_id);

            fetch('/api/cart/clear')
      .then(() => {
      
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        window.location.replace('orderconfirm.html');
      })
      .catch(err => {
        console.error("Failed to clear cart:", err);
        window.location.replace('orderconfirm.html');
      });
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    console.log(options["key"]);
    console.log(options["amount"])
    var rzp = new Razorpay(options);
    rzp.open();
}

