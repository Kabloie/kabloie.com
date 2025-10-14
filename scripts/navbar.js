

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
