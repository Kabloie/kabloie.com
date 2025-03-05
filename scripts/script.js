// Sticky navbar functionality
const section = document.querySelector('.section');
const sectionHeight = section.offsetHeight;
const navbar = document.querySelector('.navbar'); // Assuming you have a navbar element
const heroHeight = document.querySelector('.hero').offsetHeight; // Assuming heroHeight comes from a .hero element

window.addEventListener('scroll', () => {
    if (window.scrollY >= heroHeight) {
        navbar.classList.add('sticky');
        section.style.marginTop = '8vh';
    } else {
        navbar.classList.remove('sticky');
        section.style.marginTop = '0'; // Reset to default when not sticky
    }
});


// Smooth scrolling functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Calculate the position to scroll to, 8vh from the top
            const offset = 8 * window.innerHeight / 100; // 8vh in pixels
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - offset;
            
            // Smooth scroll to section
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});