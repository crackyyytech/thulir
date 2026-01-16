// Gallery Lightbox Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    const images = Array.from(galleryItems);
    
    // Open lightbox on click
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentIndex = index;
            openLightbox(index);
        });
    });
    
    // Open lightbox
    function openLightbox(index) {
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        // For now, using placeholder - replace with actual image src when images are added
        const imageSrc = images[index].querySelector('img')?.src || '';
        if (imageSrc) {
            lightboxImg.src = imageSrc;
            lightboxImg.alt = images[index].querySelector('img')?.alt || 'Gallery image';
        } else {
            // Placeholder text for now
            lightboxImg.style.display = 'none';
            lightbox.querySelector('.lightbox-content').innerHTML = `
                <div style="color: white; text-align: center; padding: 2rem;">
                    <p style="font-size: 1.5rem; margin-bottom: 1rem;">${images[index].textContent || 'Image'}</p>
                    <p style="opacity: 0.8;">Image will be displayed here</p>
                </div>
            `;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Navigation
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox(currentIndex);
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox(currentIndex);
    }
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            }
        }
    });
});
