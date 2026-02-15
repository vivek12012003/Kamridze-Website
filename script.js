// ============================================
//   KAMRIDZE INTERNATIONAL - ENHANCED
//   State Management & Initialization
// ============================================

let currentTheme = 'light';

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-loaded');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
    initHeaderScroll();
    initRevealAnimations();
    initStatsCounter();
});

// ============================================
//   THEME TOGGLE
// ============================================

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

// ============================================
//   HEADER SCROLL EFFECT
// ============================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}

// ============================================
//   MOBILE MENU
// ============================================

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const isOpen = menu.classList.toggle('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menu && menuBtn && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// ============================================
//   SMOOTH SCROLL
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ============================================
//   ACTIVE NAV LINK
// ============================================

function updateActiveNavLink() {
    const sections = ['hero', 'about', 'gallery', 'contact'];
    const scrollPosition = window.scrollY + 120;

    let activeSection = null;
    let lastSection = null;
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            lastSection = sectionId;
            const { offsetTop, offsetHeight } = section;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                activeSection = sectionId;
            }
        }
    });
    if (!activeSection && lastSection && scrollPosition > document.documentElement.scrollHeight - window.innerHeight - 100) {
        activeSection = lastSection;
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        const matchesSection = activeSection && link.getAttribute('onclick')?.includes(activeSection);
        link.classList.toggle('active', !!matchesSection);
    });
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Initial update
updateActiveNavLink();

// ============================================
//   REVEAL ON SCROLL ANIMATIONS
// ============================================

function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
//   ANIMATED STATS COUNTER
// ============================================

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(eased * target);
        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(updateCounter);
}

// ============================================
//   CONTACT FORM HANDLER
// ============================================

function handleSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const form = event.target;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
        </svg>
        Sending...
    `;
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };
    
    // Redirect to Google Form (same as Enquire Now button)
    // In a real implementation, you would send this data to your backend
    setTimeout(() => {
        window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfI9bNyS3SXZ24pIIBdmWokB4xat0kX1krXR785Jr71MoKVcg/viewform?usp=dialog';
    }, 500);
    
    // Reset button after a delay (in case redirect fails)
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 2000);
}

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);

// ============================================
//   KEYBOARD ACCESSIBILITY
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.getElementById('mobileMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (menu?.classList.contains('open')) {
            menu.classList.remove('open');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        closeLightbox();
    }
});

// ============================================
//   GALLERY MODAL - Folder View
// ============================================

let currentEventId = null;
let currentImageIndex = 0;
let currentImages = [];

function openLightbox(eventId) {
    currentEventId = eventId;

    // Get the list of *possible* images for this event
    const candidateImages = getImagesByEvent(eventId);
    if (!candidateImages || candidateImages.length === 0) {
        return;
    }

    // Preload and keep only images that actually exist.
    // This ensures:
    //   - if a folder is empty → nothing opens
    //   - if you add/remove files → UI updates automatically
    const loadedImages = [];
    let remaining = candidateImages.length;

    function finishLoading() {
        if (remaining > 0) return;

        currentImages = loadedImages;
        if (currentImages.length === 0) {
            // No real images found for this event
            return;
        }

        // Set album title
        const event = getEvents().find(e => e.id === eventId);
        if (event) {
            document.getElementById('albumTitle').textContent = event.name;
        }

        // Open modal and show grid
        const modal = document.getElementById('galleryModal');
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Render grid of photos
        renderPhotosGrid();
    }

    candidateImages.forEach(img => {
        const testImg = new Image();
        testImg.onload = function () {
            loadedImages.push({ url: img.url });
            remaining--;
            finishLoading();
        };
        testImg.onerror = function () {
            remaining--;
            finishLoading();
        };
        testImg.src = img.url;
    });
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const gridView = document.getElementById('gridViewContent');
    const enlargedView = document.getElementById('enlargedViewContent');
    
    modal.classList.remove('open');
    gridView.classList.remove('hidden');
    enlargedView.classList.remove('active');
    document.body.style.overflow = '';
}

function renderPhotosGrid() {
    const grid = document.getElementById('photosGrid');
    if (!grid) return;
    
    grid.innerHTML = currentImages.map((image, idx) => `
        <div class="photo-item" onclick="openEnlargedView(${idx})" role="button" tabindex="0" title="Click to view photo ${idx + 1} of ${currentImages.length}">
            <img src="${image.url}" alt="Photo ${idx + 1}" loading="lazy">
        </div>
    `).join('');
}

function openEnlargedView(idx) {
    currentImageIndex = idx;
    
    // Hide grid, show enlarged
    const gridView = document.getElementById('gridViewContent');
    const enlargedView = document.getElementById('enlargedViewContent');
    
    gridView.classList.add('hidden');
    enlargedView.classList.add('active');
    
    renderEnlargedPhoto();
}

function closeEnlargedView() {
    const gridView = document.getElementById('gridViewContent');
    const enlargedView = document.getElementById('enlargedViewContent');
    
    gridView.classList.remove('hidden');
    enlargedView.classList.remove('active');
}

function renderEnlargedPhoto() {
    if (currentImages.length === 0) return;
    
    const image = currentImages[currentImageIndex];
    document.getElementById('enlargedImg').src = image.url;
    document.getElementById('photoCounter').textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
}

function goToNextPhoto() {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    renderEnlargedPhoto();
}

function goToPrevPhoto() {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    renderEnlargedPhoto();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('galleryModal');
    const enlargedView = document.getElementById('enlargedViewContent');
    
    if (!modal.classList.contains('open')) return;
    
    if (enlargedView.classList.contains('active')) {
        switch(e.key) {
            case 'ArrowRight':
                goToNextPhoto();
                break;
            case 'ArrowLeft':
                goToPrevPhoto();
                break;
            case 'Escape':
                closeEnlargedView();
                break;
        }
    } else if (e.key === 'Escape') {
        closeGalleryModal();
    }
});

// Close modal when clicking outside
document.getElementById('galleryModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'galleryModal') {
        closeGalleryModal();
    }
});
