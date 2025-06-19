const supabaseClient = supabase.createClient('https://rdvwlcsdctljcrppreku.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdndsY3NkY3RsamNycHByZWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTg2MDYsImV4cCI6MjA2NDk3NDYwNn0.Fh8L6wzaWzsbLDhparBq84uQ2rDM85SXCwqR7r8tdWA');

// Function to set a cookie
function setCookie(name, value, hours = 168) { // Expires in 7 days
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Function to get a cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function logUserActivity({ eventType, eventLabel, sessionId = null }) {
  let currentSessionId = getCookie('session_id');
  if (!currentSessionId) {
    currentSessionId = sessionId || crypto.randomUUID();
    setCookie('session_id', currentSessionId);
  }

  // First fetch the IP address from ipify
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(ipData => {
      const payload = {
        session_id: currentSessionId,
        event_type: eventType,
        event_label: eventLabel,
        device_type: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        accept_language: navigator.language,
        page_url: window.location.href,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        ip_address: ipData.ip // <-- here's the IP
      };

      // Insert into Supabase
      supabaseClient
        .from('user_activity')
        .insert([payload])
        .then(({ data, error }) => {
          if (error) {
            console.error('Insert error:', error);
          } else {
            console.log('Activity logged:', data);
          }
        });
    })
    .catch(err => {
      console.error('Failed to fetch IP address:', err);
    });
}

// Example usage
window.onload = () => {
  logUserActivity({
    eventType: 'page_view',
    eventLabel: 'landing-page'
  });
};


/* WAITLIST */
document.getElementById("waitlist-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const session_id = getCookie("session_id") || crypto.randomUUID();

  setCookie("session_id", session_id);

  const { data, error } = await supabaseClient
    .from("waitlist")
    .insert([{ name, email, message, session_id }]);

  if (error) {
    console.error("Insert failed:", error.message);
    alert("Something went wrong. Please try again later.");
  } else {
    const form = document.getElementById("waitlist-form");
    const privacy = document.getElementById("privacy-note");
    const successMessage = document.getElementById("success-message");

    form.style.display = "none";
    privacy.style.display = "none";
    successMessage.style.display = "block";
    successMessage.style.opacity = "1";
  }
});


/* DARK MODE SWITCH*/
window.addEventListener("DOMContentLoaded", () => {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
        document.body.classList.add("dark-mode");

        const logo1 = document.querySelectorAll('img[alt="Kabloie Logo"]');
        logo1.forEach(logo => {
            logo.src = "images/name-white.png";
        });

        const logo2 = document.querySelectorAll('img[alt="Kabloie Second Logo"]');
        logo2.forEach(logo => {
            logo.src = "images/logo-white.png";
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

    const logos = document.querySelectorAll('img[alt="Kabloie Logo"]');
    logos.forEach(logo => {
        logo.src = isDark ? "images/name-white.png" : "images/name.png";
    });

    const secondLogo = document.querySelector('img[alt="Kabloie Second Logo"]');
    if (secondLogo) {
        secondLogo.src = isDark ? "images/logo-white.png" : "images/logo.png";
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
   
   // Function to handle smooth scrolling
   function handleSmoothScroll(target, isMobile = false) {
       // Stop any ongoing scroll animations
       $('html, body').stop();
       // Set smooth scrolling flag
       isSmoothScrolling = true;
       
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
           var headerOffset = isMobile ? 100 : ($('header').outerHeight() - 40 || 0);
           // Animate the scroll to the target section
           $('html, body').animate({
               scrollTop: $(target).offset().top - headerOffset
           }, 1500, 'swing', function() {
               // Reset smooth scrolling flag when animation completes
               isSmoothScrolling = false;
           });
       }
   }
   
   // Select all navigation links (desktop)
   $('nav.navbar a[href*="#"]').not('[href="#"]').click(function(event) {
       event.preventDefault(); // Prevent default anchor behavior
       // Update active link immediately on click
       $('nav.navbar a').removeClass('active');
       $(this).addClass('active');
       // Get the target section's ID from the href attribute
       var target = $(this).attr('href');
       handleSmoothScroll(target, false);
   });
   
   // Select all mobile navigation links
   $('#myNav .overlay-menu a').click(function(event) {
       event.preventDefault(); // Prevent default anchor behavior
       
       // Get the target based on the link text
       var linkText = $(this).text().toLowerCase();
       var target = '';
       
       switch(linkText) {
           case 'latest':
               target = '#latest';
               break;
           case 'company':
               target = '#company';
               break;
           case 'team':
               target = '#team';
               break;
           case 'join waitlist':
               target = '#waitlist';
               break;
           case 'contact us':
               target = '#contact';
               break;
       }
       
       if (target) {
           handleSmoothScroll(target, true);
       }
       
       // Close the mobile nav
       closeNav();
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







function toggleNav() {
    const overlay = document.getElementById("myNav");
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
document.getElementById("myNav").addEventListener("click", function(e) {
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





let currentSlide = 0;
let slides = [];
const totalSlides = 16; // Based on the images shown in your folder

// Image paths based on your folder structure
const imageFiles = [
    'Kabloie Pitch Deck FINAL_page-0001.jpg',
    'Kabloie Pitch Deck FINAL_page-0002.jpg',
    'Kabloie Pitch Deck FINAL_page-0003.jpg',
    'Kabloie Pitch Deck FINAL_page-0004.jpg',
    'Kabloie Pitch Deck FINAL_page-0005.jpg',
    'Kabloie Pitch Deck FINAL_page-0006.jpg',
    'Kabloie Pitch Deck FINAL_page-0007.jpg',
    'Kabloie Pitch Deck FINAL_page-0008.jpg',
    'Kabloie Pitch Deck FINAL_page-0009.jpg',
    'Kabloie Pitch Deck FINAL_page-0010.jpg',
    'Kabloie Pitch Deck FINAL_page-0011.jpg',
    'Kabloie Pitch Deck FINAL_page-0012.jpg',
    'Kabloie Pitch Deck FINAL_page-0013.jpg',
    'Kabloie Pitch Deck FINAL_page-0014.jpg',
    'Kabloie Pitch Deck FINAL_page-0015.jpg',
    'Kabloie Pitch Deck FINAL_page-0016.jpg'
];

function openModal() {
    // DON'T reset currentSlide - preserve the last position
    // Only reset slides array since we're rebuilding the DOM
    slides = [];
    
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadSlides();
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear slides from container
    const container = document.getElementById('slideshowContainer');
    container.innerHTML = ''; // Remove all slides
    
    // DON'T reset currentSlide - preserve position for next time
    // Only clear the slides array since DOM elements are gone
    slides = [];
}

function loadSlides() {
    const container = document.getElementById('slideshowContainer');
    const loading = document.getElementById('loading');
    
    // Check if required elements exist
    if (!container) {
        console.error('slideshowContainer not found');
        return;
    }
    
    // Clear loading message (if it exists)
    if (loading) {
        loading.style.display = 'none';
    }
    
    // Clear existing slides (in case any remain)
    container.innerHTML = '';
    slides = []; // Reset slides array
    
    // Create slides
    imageFiles.forEach((filename, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        // Make the slide active if it matches our current position
        if (index === currentSlide) slideDiv.classList.add('active');
        
        const img = document.createElement('img');
        img.src = `images/pitchdeck/${filename}`;
        img.alt = `Slide ${index + 1}`;
        
        // Add loading event to ensure image is ready
        img.onload = function() {
            console.log(`Image ${index + 1} loaded successfully`);
        };
        
        img.onerror = function() {
            console.error(`Failed to load image: ${filename}`);
            // Fallback if image doesn't load
            this.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f0f0f0"/><text x="400" y="300" text-anchor="middle" fill="%23666" font-family="Arial" font-size="24">Slide ${index + 1}</text></svg>`;
        };
        
        // Force image reload by adding timestamp (cache busting)
        img.src = `images/pitchdeck/${filename}?t=${Date.now()}`;
        
        slideDiv.appendChild(img);
        container.appendChild(slideDiv);
        slides.push(slideDiv);
    });
    
    // Update counter to reflect the reset state
    updateSlideCounter();
}

function changeSlide(direction) {
    // Remove active class from current slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.remove('active');
    }
    
    currentSlide += direction;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    // Add active class to new current slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    
    updateSlideCounter();
}

function updateSlideCounter() {
    const counterElement = document.getElementById('slideCounter');
    if (counterElement) {
        counterElement.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (document.getElementById('modalOverlay').classList.contains('active')) {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === 'Escape') closeModal();
    }
});

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});