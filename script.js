// ============================================
//   KAMRIDZE INTERNATIONAL - ENHANCED
//   State Management & Initialization
// ============================================

let currentTheme = 'ligth';

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
        closeGalleryModal();
    }
});

// ============================================
//   GALLERY MODAL - Folder View
// ============================================
// Base path so gallery works when site is hosted in a subdirectory
// (e.g. example.com/Kamridze-Website/). Resolves relative image URLs correctly.
function getGalleryBasePath() {
    const path = window.location.pathname;
    const lastSlash = path.lastIndexOf('/');
    if (lastSlash <= 0) return '';
    return path.substring(0, lastSlash);
}

function resolveGalleryUrl(relativePath) {
    const base = getGalleryBasePath();
    if (!relativePath) return relativePath;
    return base ? base + '/' + relativePath : relativePath;
}

let currentEventId = null;
let currentImageIndex = 0;
let currentImages = [];

// Show gallery immediately; no preload wait. Limit slots for fast open.
var GALLERY_MAX_PHOTOS = 40;

function openLightbox(eventId) {
    currentEventId = eventId;
    var candidateImages = getImagesByEvent(eventId);
    if (!candidateImages || candidateImages.length === 0) return;

    // Resolve URLs and take first N so modal opens instantly
    var list = [];
    var max = Math.min(candidateImages.length, GALLERY_MAX_PHOTOS);
    for (var i = 0; i < max; i++) {
        list.push({ url: resolveGalleryUrl(candidateImages[i].url) });
    }
    currentImages = list;

    var event = getEvents().find(function(e) { return e.id === eventId; });
    if (event) {
        document.getElementById('albumTitle').textContent = event.name;
    }

    var modal = document.getElementById('galleryModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderPhotosGrid();
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
    var grid = document.getElementById('photosGrid');
    if (!grid) return;
    var list = currentImages;
    var html = '';
    for (var idx = 0; idx < list.length; idx++) {
        var url = list[idx].url.replace(/"/g, '&quot;');
        html += '<div class="photo-item" data-idx="' + idx + '" role="button" tabindex="0" title="View photo ' + (idx + 1) + ' of ' + list.length + '">';
        html += '<img src="' + url + '" alt="Photo ' + (idx + 1) + '" loading="lazy" onerror="this.parentElement.style.display=\'none\'">';
        html += '</div>';
    }
    grid.innerHTML = html;
    // One listener for all items: works on both mouse and touch, no delay
    grid.querySelectorAll('.photo-item').forEach(function(el) {
        el.addEventListener('click', function() {
            var idx = parseInt(el.getAttribute('data-idx'), 10);
            if (!isNaN(idx)) openEnlargedView(idx);
        });
    });
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

// Gallery grid: one delegated listener so tap/click works on mobile and desktop
(function() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.addEventListener('click', function(e) {
        var item = e.target.closest('.gallery-item');
        if (!item) return;
        var id = item.getAttribute('data-event-id');
        if (id && typeof openLightbox === 'function') openLightbox(id);
    });
})();
