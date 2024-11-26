// script.js

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Toggle navigation menu when hamburger is clicked
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent the click from bubbling up to the document
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent background scrolling

        // Update aria-expanded attribute for accessibility
        const isActive = navLinks.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isActive.toString()); // Convert boolean to string

        if (isActive) {
            const firstNavLink = navLinks.querySelector('a');
            if (firstNavLink) {
                firstNavLink.focus(); // Set focus to the first link for accessibility
            }
        }
    });

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: false
        });
    }

    // Hide navigation menu when clicking outside of it
    document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('active')) {
            // Check if the click is outside the navLinks and hamburger
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
                hamburger.setAttribute('aria-expanded', 'false'); // Set to 'false' string
            }
        }
    });

    const closeBtn = document.querySelector('.close-hamburger');

    // Close the navigation menu when the close button is clicked
    closeBtn.addEventListener('click', function () {
        navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', 'false'); // Set to 'false' string
    });

    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });


    // Close the menu when the Esc key is pressed
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
            hamburger.setAttribute('aria-expanded', 'false'); // Set to 'false' string
            hamburger.focus(); // Return focus to the hamburger button
        }
    });


    // Close the menu when a navigation link is clicked
    navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
            hamburger.setAttribute('aria-expanded', 'false'); // Set to 'false' string
        }
    });

    // Smooth scrolling for navigation links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 60, // Adjust based on header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeInObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        fadeInObserver.observe(el);
    });
});
