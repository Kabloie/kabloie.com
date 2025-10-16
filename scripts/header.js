
/* SWITCH LOGO ON SCROLL DOWN */
window.addEventListener('scroll', () => {
    const logo = document.querySelector('.logo');
    if (window.scrollY > 100) {
        logo.classList.add('scrolled');
    } else {
        logo.classList.remove('scrolled');
    }
});



