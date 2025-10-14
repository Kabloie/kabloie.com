

/* GENERAL SMOOTH SCROLL */
const lenis = new Lenis({
    lerp: 0.15,
    wheelMultiplier: 1.25,
    smooth: true,
    smoothTouch: false
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);



/* SLIDER MODAL PITCH DECK */
const openModalBtn = document.getElementById('openModal');
const closeModalBtns = document.querySelectorAll('.close-btn');
const modal = document.getElementById('modal');
const modalMobile = document.getElementById('modal-mobile');
const scrollContainer = modal.querySelector('.scroll-container');
const prevBtn = modal.querySelector('.prev-btn');
const nextBtn = modal.querySelector('.next-btn');

let currentSlide = 0;
const totalSlides = modal.querySelectorAll('.panel').length;

openModalBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1050) {
        modalMobile.classList.add('active');
    } else {
        modal.classList.add('active');
        currentSlide = 0;
    }
    document.body.classList.add('modal-open');
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.remove('active');
        modalMobile.classList.remove('active');
        document.body.classList.remove('modal-open');
    });
});

nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        scrollContainer.scrollTo({
            left: currentSlide * window.innerWidth,
            behavior: 'smooth'
        });
    }
});

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        scrollContainer.scrollTo({
            left: currentSlide * window.innerWidth,
            behavior: 'smooth'
        });
    }
});