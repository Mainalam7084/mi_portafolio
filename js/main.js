document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // 1. NAVEGACIÓN Y SCROLL
    // =================================================================

    // Scroll a la sección de portfolio desde el botón del hero
    const viewWorkBtn = document.getElementById('view-work-btn');
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', () => {
            document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Revelar secciones al hacer scroll
    const sections = document.querySelectorAll('.section, .about-container');
    const sectionObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Opcional: descomentar para que la animación sea de una sola vez
                    // sectionObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    sections.forEach(section => sectionObserver.observe(section));


    // =================================================================
    // 2. MODAL DE PROYECTOS (PORTFOLIO)
    // =================================================================

    const portfolioModal = document.getElementById('modal');
    if (portfolioModal) {
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalCloseBtn = portfolioModal.querySelector('.modal-close');
        let previouslyFocusedElement = null;

        document.querySelectorAll('.portfolio-card').forEach(card => {
            card.addEventListener('click', () => {
                if (modalImage) modalImage.style.backgroundImage = `url('${card.dataset.img}')`;
                if (modalTitle) modalTitle.textContent = card.dataset.title;
                if (modalDesc) modalDesc.textContent = card.dataset.desc;

                previouslyFocusedElement = document.activeElement;
                portfolioModal.classList.add('active');
                modalCloseBtn?.focus();
            });
        });

        const closeModalPortfolio = () => {
            portfolioModal.classList.remove('active');
            previouslyFocusedElement?.focus();
        };

        modalCloseBtn?.addEventListener('click', closeModalPortfolio);
        portfolioModal.addEventListener('click', e => {
            if (e.target === portfolioModal) closeModalPortfolio();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
                closeModalPortfolio();
            }
        });
    }


    // =================================================================
    // 3. FORMULARIO DE CONTACTO (EMAILJS)
    // =================================================================

    const contactForm = document.getElementById('contact-form');
    const submitContactBtn = document.getElementById('submit-contact-btn');
    if (contactForm && submitContactBtn) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const originalButtonText = submitContactBtn.textContent;
            submitContactBtn.disabled = true;
            submitContactBtn.textContent = 'Enviando...';

            emailjs.sendForm('service_addmbm2', 'template_lgy393k', this)
                .then(() => {
                    alert('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.');
                    contactForm.reset();
                }, (err) => {
                    alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.\nError: ' + JSON.stringify(err));
                })
                .finally(() => {
                    submitContactBtn.disabled = false;
                    submitContactBtn.textContent = originalButtonText;
                });
        });
    }


    // =================================================================
    // 4. DESCARGA DE CV
    // =================================================================

    const cvDownloadBtn = document.getElementById('cv-download-btn');
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const fileUrl = cvDownloadBtn.href;
            const fileName = cvDownloadBtn.getAttribute('download') || fileUrl.split('/').pop();
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error(`Error al obtener el archivo: ${response.statusText}`);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = blobUrl;
                tempLink.download = fileName;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('Error al intentar descargar el CV:', error);
                alert('Hubo un problema al intentar descargar el CV. Por favor, intentalo de nuevo o haz clic derecho sobre el botón y selecciona "Guardar enlace como..."');
            }
        });
    }


    // =================================================================
    // 5. EFECTOS VISUALES (LLUVIA, BARRA NEÓN, ESTELA)
    // =================================================================

    // --- Lluvia de Puntos (Efecto Hacker) ---
    const rainContainer = document.getElementById('hacker-rain-container');
    if (rainContainer) {
        const createNeonDot = () => {
            const dot = document.createElement('div');
            dot.classList.add('neon-dot');
            dot.style.left = `${Math.random() * 100}vw`;
            const duration = Math.random() * 4 + 2;
            dot.style.animationDuration = `${duration}s`;
            dot.style.animationDelay = `${Math.random() * 7}s`;
            rainContainer.appendChild(dot);
            setTimeout(() => dot.remove(), (duration + parseFloat(dot.style.animationDelay)) * 1000 + 100);
        };
        for (let i = 0; i < 100; i++) setTimeout(createNeonDot, i * 10);
        setInterval(createNeonDot, 150);
    }

    // --- Barra de Texto Neón en Secciones ---
    const neonTextBars = document.querySelectorAll('.section-neon-text-bar');
    if (neonTextBars.length > 0) {
        const singleTextInstance = ` © Main Alam  © ${new Date().getFullYear()}  © Portfolio `;
        neonTextBars.forEach(bar => {
            const wrapper = document.createElement('div');
            wrapper.className = 'neon-text-wrapper';
            // Crear 4 copias para un bucle fluido
            for (let i = 0; i < 4; i++) {
                const contentSpan = document.createElement('span');
                contentSpan.className = 'neon-text-content';
                contentSpan.textContent = singleTextInstance;
                wrapper.appendChild(contentSpan);
            }
            bar.innerHTML = '';
            bar.appendChild(wrapper);
        });
    }

    // --- Estela de Ratón Continua Neón ---
    const svgTrailContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgTrailContainer.id = 'neon-trail-svg';
    Object.assign(svgTrailContainer.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: '9998'
    });
    document.body.appendChild(svgTrailContainer);
    let prevMousePos = { x: 0, y: 0 }, currMousePos = { x: 0, y: 0 };
    let hasMouseMovedInitially = false;

    document.addEventListener('mousemove', (e) => {
        currMousePos = { x: e.clientX, y: e.clientY };
        if (!hasMouseMovedInitially) {
            prevMousePos = { ...currMousePos };
            hasMouseMovedInitially = true;
        }
    });

    function renderContinuousTrail() {
        if (hasMouseMovedInitially) {
            const dx = currMousePos.x - prevMousePos.x;
            const dy = currMousePos.y - prevMousePos.y;
            if (dx * dx + dy * dy > 4) { // MIN_MOVE_DISTANCE squared
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('class', 'neon-svg-line');
                line.setAttribute('x1', String(prevMousePos.x));
                line.setAttribute('y1', String(prevMousePos.y));
                line.setAttribute('x2', String(currMousePos.x));
                line.setAttribute('y2', String(currMousePos.y));
                svgTrailContainer.appendChild(line);
                requestAnimationFrame(() => { line.style.opacity = '0'; });
                setTimeout(() => line.remove(), 500); // SEGMENT_LIFESPAN
                prevMousePos = { ...currMousePos };
            }
        }
        requestAnimationFrame(renderContinuousTrail);
    }
    requestAnimationFrame(renderContinuousTrail);


    // =================================================================
    // 6. CARRUSEL DEL BLOG Y LIGHTBOX (IMAGEN Y VÍDEO)
    // =================================================================

    const carousels = document.querySelectorAll('.travel-carousel-wrapper');
    if (carousels.length > 0) {
        const lightboxModal = document.getElementById('travel-lightbox-modal');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxVideo = document.getElementById('lightbox-video');
        const lightboxCloseBtn = lightboxModal?.querySelector('.travel-lightbox-close');

        if (!lightboxModal || !lightboxImage || !lightboxVideo || !lightboxCloseBtn) return;

        let activeCarouselStopAutoPlay = null;

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
            lightboxVideo.pause();
            lightboxVideo.src = "";
            lightboxImage.classList.remove('visible');
            lightboxVideo.classList.remove('visible');
            activeCarouselStopAutoPlay?.start();
            activeCarouselStopAutoPlay = null;
        };

        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => { if (e.target === lightboxModal) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightboxModal.classList.contains('active')) closeLightbox(); });

        carousels.forEach((carouselWrapper, carouselIndex) => {
            const track = carouselWrapper.querySelector('.travel-carousel-slide-track');
            const slides = track ? Array.from(track.children) : [];
            const nextButton = carouselWrapper.querySelector('.travel-carousel-next');
            const prevButton = carouselWrapper.querySelector('.travel-carousel-prev');

            if (!track || !nextButton || !prevButton || slides.length === 0) return;

            let currentIndex = 0;
            let autoPlayInterval;
            const AUTO_PLAY_DELAY = 5000 + (carouselIndex * 500);

            const moveToSlide = (targetIndex) => {
                const slideWidth = track.parentElement.getBoundingClientRect().width;
                if (slideWidth === 0) return;
                if (targetIndex < 0) targetIndex = slides.length - 1;
                else if (targetIndex >= slides.length) targetIndex = 0;
                track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
                currentIndex = targetIndex;
            };

            const startAutoPlay = () => {
                if (slides.length <= 1) return;
                clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), AUTO_PLAY_DELAY);
            };
            const stopAutoPlay = () => clearInterval(autoPlayInterval);
            const resetAutoPlay = () => { stopAutoPlay(); startAutoPlay(); };

            nextButton.addEventListener('click', () => { moveToSlide(currentIndex + 1); resetAutoPlay(); });
            prevButton.addEventListener('click', () => { moveToSlide(currentIndex - 1); resetAutoPlay(); });
            track.parentElement.addEventListener('mouseenter', stopAutoPlay);
            track.parentElement.addEventListener('mouseleave', startAutoPlay);

            slides.forEach(slide => {
                slide.addEventListener('click', () => {
                    const type = slide.dataset.type;
                    const src = slide.dataset.fullSrc;

                    if (type === 'video' && src) {
                        lightboxVideo.src = src;
                        lightboxVideo.classList.add('visible');
                        lightboxImage.classList.remove('visible');
                        lightboxVideo.play();
                    } else {
                        const img = slide.querySelector('img');
                        lightboxImage.src = img?.dataset.fullSrc || img?.src;
                        lightboxImage.alt = img?.alt;
                        lightboxImage.classList.add('visible');
                        lightboxVideo.classList.remove('visible');
                    }

                    lightboxModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    stopAutoPlay();
                    activeCarouselStopAutoPlay = { start: startAutoPlay, stop: stopAutoPlay };
                });
            });

            window.addEventListener('resize', () => moveToSlide(currentIndex));
            moveToSlide(currentIndex);
            startAutoPlay();
        });
    }
});