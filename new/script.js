/* DARK MODE SWITCH*/
window.addEventListener("DOMContentLoaded", () => {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
        document.body.classList.add("dark-mode");
        const logos = document.querySelectorAll('img[alt="Kabloie Logo"]');
        logos.forEach(logo => {
            logo.src = "images/name-white.png";
        });
    }
});
function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark-mode");

    if (!isDark) {
        document.body.style.backgroundColor = "white";
        document.documentElement.style.backgroundColor = 'white';
    } else {
        document.body.style.backgroundColor = "";
        document.documentElement.style.backgroundColor = '#1e2021';
    }

    const mainLogo = document.querySelector('img[alt="Kabloie Logo"]');
    const secondLogo = document.querySelector('img[alt="Kabloie Second Logo"]');

    if (mainLogo) {
        mainLogo.src = isDark ? "images/name-white.png" : "images/name.png";
    }

    if (secondLogo) {
        secondLogo.src = isDark ? "images/logo-white.png" : "images/logo.png"; // Assuming there's a dark variant
    }

    // Optional: save preference
    localStorage.setItem("darkMode", isDark);
}


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


/* AUTOMATIC SMOOTH SCROLL WHEN CLICKING NAVBAR */
$(document).ready(function() {
    // Flag to track if smooth scrolling is active
    var isSmoothScrolling = false;

    // Select all navigation links
    $('nav.navbar a[href*="#"]').not('[href="#"]').click(function(event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Stop any ongoing scroll animations
        $('html, body').stop();

        // Set smooth scrolling flag
        isSmoothScrolling = true;

        // Update active link immediately on click
        $('nav.navbar a').removeClass('active');
        $(this).addClass('active');

        // Get the target section's ID from the href attribute
        var target = $(this).attr('href');

        // Check if the target is #latest
        if (target === '#latest') {
            // Scroll to the top of the page
            $('html, body').animate({
                scrollTop: 0
            }, 1500, 'swing', function() {
                // Reset smooth scrolling flag when animation completes
                isSmoothScrolling = false;
            });
        } else {
            // Calculate the offset for the fixed header
            var headerOffset = $('header').outerHeight() - 40 || 0;

            // Animate the scroll to the target section
            $('html, body').animate({
                scrollTop: $(target).offset().top - headerOffset
            }, 1500, 'swing', function() {
                // Reset smooth scrolling flag when animation completes
                isSmoothScrolling = false;
            });
        }
    });

    // Stop smooth scroll animation on user-initiated scroll
    $(window).on('wheel touchmove', function() {
        $('html, body').stop();
        isSmoothScrolling = false; // Allow highlight updates after manual scroll
    });

    // Highlight navbar <a> when its section is in view
    function highlightActiveNav() {
        // Skip highlighting if smooth scrolling is active
        if (isSmoothScrolling) return;

        var scrollPos = $(window).scrollTop();
        var headerOffset = $('header').outerHeight() - 40 || 0;
        var windowHeight = $(window).height();
        var activeLink = '';

        // Check each section
        $('nav.navbar a[href*="#"]').each(function() {
            const currLink = $(this).attr('href');
            const $section = $(currLink);

            // Skip if section doesn't exist
            if (!$section.length) return;

            const sectionTop = $section.offset().top - headerOffset;
            const sectionBottom = sectionTop + $section.outerHeight();

            // Consider section active if its top is near the top of the viewport
            // or if the scroll position is within the section
            if (scrollPos >= sectionTop - windowHeight / 4 && scrollPos < sectionBottom) {
                activeLink = currLink;
            }
        });

        // Special case for #latest (top of page)
        if (scrollPos < 50 && !activeLink) { // Tighter buffer for #latest
            activeLink = '#latest';
        }

        // Only update if an active link is found
        if (activeLink) {
            $('nav.navbar a').removeClass('active');
            $('nav.navbar a[href="' + activeLink + '"]').addClass('active');
        }
    }

    // Run on scroll and initially
    $(window).on('scroll', highlightActiveNav);
    highlightActiveNav();
});


/* FOOTER TIME UPDATE */
function updateLundTime() {
    const options = { 
        timeZone: 'Europe/Stockholm',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const now = new Date();
    document.getElementById('lund-time').textContent = now.toLocaleTimeString('en-US', options);
}

updateLundTime();
setInterval(updateLundTime, 60000);


/* SWITCH LOGO ON SCROLL DOWN */
window.addEventListener('scroll', () => {
    const logo = document.querySelector('.logo');
    if (window.scrollY > 100) {
        logo.classList.add('scrolled');
    } else {
        logo.classList.remove('scrolled');
    }
});
