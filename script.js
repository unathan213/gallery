/* ============================================
   LENS & LIGHT STUDIO
   ============================================ */

/* ---- Navbar ---- */
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

/* ---- Scroll Reveal ---- */
function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ---- Gallery Filters ---- */
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ---- Lightbox ---- */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    if (!lightbox) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none' && !item.classList.contains('video-item'));
    }

    function openLightbox(index) {
        getVisibleItems();
        currentIndex = index;
        const img = visibleItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigate(direction) {
        getVisibleItems();
        currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
        const img = visibleItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    }

    galleryItems.forEach((item, i) => {
        if (item.classList.contains('video-item')) return;
        item.addEventListener('click', () => {
            getVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            if (visibleIndex >= 0) openLightbox(visibleIndex);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigate(-1));
    lightboxNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
}

/* ---- Contact Form ---- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]');

        form.innerHTML = `
            <div class="form-success">
                <h3>Inquiry Sent!</h3>
                <p>Thank you${name && name.value ? ', ' + name.value : ''}! We've received your message and will get back to you within 24 hours.</p>
            </div>
        `;
    });
}

/* ---- Smooth Scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ---- Video Modal ---- */
function initVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoModalContent = document.getElementById('videoModalContent');
    const videoModalClose = document.getElementById('videoModalClose');

    if (!videoModal) return;

    const videoItems = document.querySelectorAll('.video-item');

    function openVideo(item) {
        const type = item.dataset.videoType;
        const src = item.dataset.videoSrc;

        if (type === 'youtube') {
            videoModalContent.innerHTML = `<iframe src="${src}?autoplay=1&rel=0" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
        } else {
            videoModalContent.innerHTML = `<video src="${src}" controls autoplay></video>`;
        }

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
        videoModal.classList.remove('active');
        videoModalContent.innerHTML = '';
        document.body.style.overflow = '';
    }

    videoItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            openVideo(item);
        });
    });

    videoModalClose.addEventListener('click', closeVideo);

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideo();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) closeVideo();
    });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initGalleryFilters();
    initLightbox();
    initVideoModal();
    initContactForm();
});
