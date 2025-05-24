 // Preloader Logic
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('hidden');
            }
        });

        // Dark Mode Toggle Logic
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const htmlElement = document.documentElement; // Target the html element for dark class

        // Check for saved theme preference
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            htmlElement.classList.add('dark');
            document.body.classList.add('dark'); // Apply dark class to body as well for custom styles
        } else {
            htmlElement.classList.remove('dark');
            document.body.classList.remove('dark');
        }

        darkModeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                document.body.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });


        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking a link
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        // Mobile menu toggle functionality
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
        });

        // Highlight active navigation link on scroll
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                // Adjust offset to make highlighting more accurate
                if (pageYOffset >= sectionTop - sectionHeight / 3) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.href.includes(current)) {
                    link.classList.add('active');
                }
            });
        });

        // Typing Animation for Hero Section
        const typingTextElement = document.getElementById('typing-text');
        const roles = ["Developer", "Designer", "Writer"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100; // milliseconds per character
        const deletingSpeed = 50; // milliseconds per character
        const pauseBeforeDelete = 1500; // milliseconds
        const pauseBeforeType = 500; // milliseconds

        function typeWriter() {
            if (!typingTextElement) return; // Ensure element exists

            const currentRole = roles[roleIndex];
            if (isDeleting) {
                // Deleting text
                typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Typing text
                typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = typingSpeed;
            if (isDeleting) {
                typeSpeed = deletingSpeed;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                // Done typing, pause before deleting
                typeSpeed = pauseBeforeDelete;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Done deleting, move to next role and pause before typing
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = pauseBeforeType;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // Intersection Observer for Skill Bar Animations
        const skillBars = document.querySelectorAll('.progress-bar-fill');
        const skillsSection = document.getElementById('skills');

        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the section is visible
        };

        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        // Reset width to 0% to re-trigger animation if scrolled away and back
                        bar.style.width = '0%';
                        // Force reflow to ensure animation restarts
                        void bar.offsetWidth;
                        const progressWidth = bar.style.getPropertyValue('--progress-width');
                        bar.style.animationName = 'fillProgressBar';
                        bar.style.animationDuration = '1.5s'; // Ensure duration is set
                        bar.style.width = progressWidth; // Set final width to trigger animation
                    });
                    // Removed unobserve to allow animation to replay if scrolled away and back
                    // observer.unobserve(entry.target);
                } else {
                    // Optionally reset bars when they leave the viewport
                    skillBars.forEach(bar => {
                        bar.style.animationName = 'none'; // Stop animation
                        bar.style.width = '0%'; // Reset to 0%
                    });
                }
            });
        }, observerOptions);

        // Observe the skills section
        if (skillsSection) {
            skillObserver.observe(skillsSection);
        }


        // Initialize the active class for the first section on load and start animations
        window.addEventListener('load', () => {
            const firstSectionLink = document.querySelector('a[href="#about"]');
            if (firstSectionLink) {
                firstSectionLink.classList.add('active');
            }

            // Trigger fade-in animations for elements within sections
            const animateElements = document.querySelectorAll('.animate-fade-in-up');
            animateElements.forEach(el => {
                // Check if the element has an animation-delay defined in CSS
                const computedDelay = getComputedStyle(el).animationDelay;
                if (computedDelay === '0s' || computedDelay === '') {
                    // If no explicit delay, set a small one to ensure animation runs
                    el.style.animationDelay = '0.05s';
                }
                el.style.opacity = 0; // Ensure it starts hidden
                el.style.animationFillMode = 'forwards'; // Keep final state
            });

            // Start typing animation after a short delay to allow hero section fade-in
            setTimeout(typeWriter, 1000); // Adjust delay as needed
        });


        // Initialize Swiper for projects section
        const projectsSwiper = new Swiper(".projects-swiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000, // 5 seconds
                disableOnInteraction: false, // Keep autoplaying after user interaction
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });

        // Initialize Swiper for articles section
        const articlesSwiper = new Swiper(".articles-swiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000, // 5 seconds
                disableOnInteraction: false, // Keep autoplaying after user interaction
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });

        // Modal Logic
        const projectModals = document.querySelectorAll('.modal');
        const viewDetailsButtons = document.querySelectorAll('.view-details-button');
        const modalCloseButtons = document.querySelectorAll('.modal-close-button');

        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const projectId = e.target.dataset.projectId;
                const modal = document.getElementById(`modal-${projectId}`);
                if (modal) {
                    modal.classList.add('show');
                    modal.setAttribute('aria-hidden', 'false');
                    modal.focus(); // Focus the modal for accessibility
                }
            });
        });

        modalCloseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        });

        // Close modal when clicking outside content
        projectModals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                projectModals.forEach(modal => {
                    if (modal.classList.contains('show')) {
                        modal.classList.remove('show');
                        modal.setAttribute('aria-hidden', 'true');
                    }
                }
            );
            }
        });

        // Back to Top Button Logic
        const backToTopButton = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Contact Form Submission with Email.js
        const contactForm = document.getElementById('contact-form');
        const contactFormMessage = document.getElementById('contact-form-message');
        const submitButton = document.getElementById('submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonSpinner = submitButton.querySelector('.button-spinner');

        // Initialize Email.js (Replace with your actual keys and IDs)
        emailjs.init({
            publicKey: 'YOUR_EMAILJS_PUBLIC_KEY', // Replace with your Public Key from Email.js
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Show spinner and disable button
            buttonText.textContent = 'Sending...';
            buttonSpinner.classList.remove('hidden');
            submitButton.disabled = true;
            submitButton.classList.add('opacity-75', 'cursor-not-allowed');

            contactFormMessage.classList.remove('success', 'error');
            contactFormMessage.classList.add('hidden'); // Hide previous messages

            try {
                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual Email.js Service ID and Template ID
                const response = await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm);

                if (response.status === 200) {
                    contactFormMessage.classList.add('success');
                    contactFormMessage.textContent = 'Message sent successfully! I will get back to you soon.';
                    contactForm.reset(); // Clear the form
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        contactFormMessage.classList.add('error');
                        contactFormMessage.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        contactFormMessage.classList.add('error');
                        contactFormMessage.textContent = 'Oops! There was an error sending your message.';
                    }
                }
            } catch (error) {
                console.error('Email.js submission error:', error);
                contactFormMessage.classList.add('error');
                contactFormMessage.textContent = 'Network error or Email.js configuration issue. Please try again later.';
            } finally {
                // Hide spinner and re-enable button
                buttonText.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Send Message'; // Reset icon and text
                buttonSpinner.classList.add('hidden');
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
                contactFormMessage.classList.remove('hidden'); // Show the message
            }
        });

        // Automatically update copyright year
        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Privacy Policy and Terms of Service Modal Logic
        const privacyTermsButtons = document.querySelectorAll('.privacy-terms-button');
        privacyTermsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modalId;
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('show');
                    modal.setAttribute('aria-hidden', 'false');
                    modal.focus();
                }
            });
        });