const model=document.querySelector('.model');
const modeltop=document.querySelector('.model-top');
const modelinfo=document.querySelector('.model-info');
const modelhead=document.querySelector('.model-head');
const moverlay = document.querySelector(".moverlay");
const header = document.querySelector('header');
header.addEventListener('click', () => {
    document.querySelector('.model').classList.remove('open');
    moverlay.classList.remove("over");
});

const quickbuttons=document.querySelectorAll('.quick-view');
quickbuttons.forEach(function(button){
     button.addEventListener('click',function(){
        model.classList.add('open');
        moverlay.classList.toggle('over');
       
        modelinfo.innerHTML="";
      const  productcard=this.closest('.products-card');
      const producttitle=productcard.querySelector('h3').textContent;
      const productimage=productcard.querySelector('img').src;
      const productprice=productcard.querySelector('p').textContent;
      const h6 = productcard.querySelector('h6');
const productdes = h6 ? h6.textContent : 'nothing';
 modelhead.innerHTML=`<h3>${producttitle}</h3>`;
      modelinfo.innerHTML=`<img class="mimage" src=${productimage} alt="${producttitle}"><div class="mdes"><h4>DESCRIPTION:</h4>${productdes}</div><div class="mprice">${productprice}</div><button id="mbutton">add to cart</button>`;
console.log(model.innerHTML);   
const modelclose = document.querySelector('.modal-close');
       if(modelclose) modelclose.addEventListener('click', () => {
        moverlay.classList.remove("over")
            model.classList.remove('open');
        });
        document.getElementById('mbutton').addEventListener('click', () => {
            const price = parseFloat(productprice.replace(/[^0-9.]/g, ''));
            addcart(producttitle, price, productimage);
            moverlay.classList.remove("over")
            model.classList.remove('open');
        });
       
 });
 
})
 moverlay.addEventListener('click',()=>{
            moverlay.classList.toggle('over');
            model.classList.remove('open');
        });
      