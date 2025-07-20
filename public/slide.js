var sindex=0;
const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
function show(index){
    slides.forEach((slide,i)=>{
        slide.classList.remove('active');
         dots[i].classList.remove('active');
        if(i===index){
            slide.classList.add('active');
            dots[i].classList.add('active');  
        }
    });

}const dots = document.querySelectorAll('.dot');
dots.forEach((dot, i) => dot.onclick = () => show(i));
function nextslide(){
    sindex=(sindex+1)%slides.length;
    show(sindex);

}
function prevslide(){
    sindex=(sindex-1>=0?sindex-1:slides.length-1)%slides.length;
    show(sindex);

}
next.addEventListener("click", nextslide);
prev.addEventListener("click", prevslide);

let interval = setInterval(nextslide, 5000);

document.querySelector('.slider').addEventListener('mouseover', () => {
    clearInterval(interval);
});
document.querySelector('.slider').addEventListener('mouseout', () => {
    interval = setInterval(nextslide, 5000);
});
show(sindex);
