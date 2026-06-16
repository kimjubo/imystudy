/* ----------------------------------------------------
   Incheon MyStudy Cram School Web Interactions
   Created: 2026
---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Drawer Navigation
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav a, .drawer-footer a');

    function openDrawer() {
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
    if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    // 2. Header Scroll Effect (Sticky Styling)
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.05)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            header.style.height = '70px';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            header.style.height = '80px';
        }
    });


    // 3. Dynamic Tabs Switcher (Programs Section)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(tabId) {
        // Deactivate all buttons & panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Activate matching button & pane
        const activeBtn = document.querySelector(`.tab-btn[data-tab-id="${tabId}"]`);
        const activePane = document.getElementById(`tab-${tabId}`);

        if (activeBtn) activeBtn.classList.add('active');
        if (activePane) activePane.classList.add('active');
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab-id');
            switchTab(tabId);
        });
    });


    // 4. Hero Floating Cards -> Tab link & Smooth Scroll
    const heroCardLinks = document.querySelectorAll('.card-arrow-link');

    heroCardLinks.forEach(cardLink => {
        cardLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = cardLink.getAttribute('data-tab');
            
            // Map card target names to actual Tab IDs
            let tabId = '';
            if (targetTab === 'summer') tabId = 'summer';
            else if (targetTab === 'basic') tabId = 'basic';
            else if (targetTab === 'subject') tabId = 'subject';
            else if (targetTab === 'retake') tabId = 'retake';

            if (tabId) {
                switchTab(tabId);
                
                // Smooth scroll to the programs section
                const targetSection = document.getElementById('programs');
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    // 5. Stat Counter Number Animation (Intersection Observer)
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-num');
    let animated = false;

    function startCounterAnimation() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1500; // ms
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;

            const timer = setInterval(() => {
                current += 1;
                stat.textContent = current;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                }
            }, stepTime);
        });
    }

    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    startCounterAnimation();
                    animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }


    // 6. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target); // Reveal only once
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }


    // 7. Counseling Inquiry Form Submission & Modal Dialog
    const consultationForm = document.getElementById('consultation-form');
    const successModal = document.getElementById('success-modal');
    const successModalClose = document.getElementById('success-modal-close');
    const modalOverlay = document.getElementById('modal-overlay');

    function openModal() {
        successModal.classList.add('active');
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        successModal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page refresh
            
            // Gather form data (could be wired to backend in production)
            const name = document.getElementById('student-name').value;
            const phone = document.getElementById('student-phone').value;
            const grade = document.getElementById('student-grade').value;
            const course = document.getElementById('interest-course').value;
            const msg = document.getElementById('message').value;

            console.log('Counseling Inquiry Details:', { name, phone, grade, course, msg });

            // Visual feedback & Reset
            openModal();
            consultationForm.reset();
        });
    }

    if (successModalClose) successModalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // 8. Admissions Accordion & Lazy Loading Images
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-body').style.maxHeight = '0px';
                otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                // Open clicked item
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');

                // Trigger Lazy Loading of images inside this item
                const lazyImgs = body.querySelectorAll('.lazy-admissions-img');
                lazyImgs.forEach(img => {
                    if (!img.getAttribute('src')) {
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.setAttribute('src', dataSrc);
                            img.onload = () => {
                                img.classList.add('loaded');
                                // Recalculate and update body max-height when image loads
                                if (item.classList.contains('active')) {
                                    body.style.maxHeight = body.scrollHeight + 'px';
                                }
                            };
                        }
                    } else if (img.complete) {
                        img.classList.add('loaded');
                    }
                });

                // Set initial max-height
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

});
