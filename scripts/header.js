
/* SWITCH LOGO ON SCROLL DOWN */
window.addEventListener('scroll', () => {
    const logo = document.querySelector('.logo');
    if (window.scrollY > 100) {
        logo.classList.add('scrolled');
    } else {
        logo.classList.remove('scrolled');
    }
});



/* TOGGLE NAV IN MOBILE */
function toggleNav() {
    const overlay = document.getElementById("navbar-mobile");
    const isActive = overlay.classList.contains("active");

    const hamburger = document.getElementById("hamburger");
    const close = document.getElementById("close");

    if (isActive) {
        overlay.classList.remove("active");
        document.body.style.overflow = "auto";

        hamburger.style.display = "block";
        close.style.display = "none";
    } else {
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";

        hamburger.style.display = "none";
        close.style.display = "block";
    }
}
// Close overlay when clicking outside content
document.getElementById("navbar-mobile").addEventListener("click", function(e) {
    if (e.target === this) {
        toggleNav();
    }
});

// Close overlay with Escape key
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        toggleNav();
    }
});