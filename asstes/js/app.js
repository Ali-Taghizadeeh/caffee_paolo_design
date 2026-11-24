
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    document.documentElement.classList.add("js-enabled");

    // ----------------------------------------
    // 01. MOBILE NAVIGATION
    // ----------------------------------------

    const navToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("nav");

    if (navToggle && mainNav) {
        const closeMenu = () => {
            mainNav.classList.remove("show");
            navToggle.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Open navigation");
        };

        const toggleMenu = () => {
            const isOpen = !mainNav.classList.contains("show");

            mainNav.classList.toggle("show", isOpen);
            navToggle.classList.toggle("active", isOpen);

            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        };

        navToggle.addEventListener("click", toggleMenu);

        mainNav.addEventListener("click", event => {
            if (event.target.closest("a")) {
                closeMenu();
            }
        });

        document.addEventListener("click", event => {
            if (
                mainNav.classList.contains("show") &&
                !mainNav.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        const desktopMedia = window.matchMedia("(min-width: 801px)");

        desktopMedia.addEventListener("change", event => {
            if (event.matches) {
                closeMenu();
            }
        });
    }

    // ----------------------------------------
    // 02. COMMUNITY SLIDESHOW
    // ----------------------------------------

    const communityTrack = document.getElementById("communityTrack");
    const communityPrev = document.getElementById("communityPrev");
    const communityNext = document.getElementById("communityNext");

    if (communityTrack && communityPrev && communityNext) {
        const cards = communityTrack.querySelectorAll(".community-card");

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const autoSlideDelay = 4500;

        let autoSlideTimer = null;
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;

        const getScrollAmount = () => {
            const firstCard = cards[0];

            if (!firstCard) return 300;

            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(communityTrack).gap) || 0;

            return cardWidth + gap;
        };

        const moveSlide = direction => {
            communityTrack.scrollBy({
                left: getScrollAmount() * direction,
                behavior: prefersReducedMotion.matches ? "auto" : "smooth"
            });
        };

        const stopAutoSlide = () => {
            if (autoSlideTimer !== null) {
                clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        };

        const startAutoSlide = () => {
            stopAutoSlide();

            if (
                prefersReducedMotion.matches ||
                cards.length < 2 ||
                document.hidden
            ) {
                return;
            }

            autoSlideTimer = setInterval(() => {
                const maxScroll =
                    communityTrack.scrollWidth - communityTrack.clientWidth;

                if (maxScroll <= 0) return;

                if (communityTrack.scrollLeft >= maxScroll - 5) {
                    communityTrack.scrollTo({
                        left: 0,
                        behavior: "smooth"
                    });
                } else {
                    moveSlide(1);
                }
            }, autoSlideDelay);
        };

        const restartAutoSlide = () => {
            startAutoSlide();
        };

        communityNext.addEventListener("click", () => {
            moveSlide(1);
            restartAutoSlide();
        });

        communityPrev.addEventListener("click", () => {
            moveSlide(-1);
            restartAutoSlide();
        });

        communityTrack.addEventListener("mouseenter", stopAutoSlide);
        communityTrack.addEventListener("mouseleave", startAutoSlide);

        communityTrack.addEventListener("focusin", stopAutoSlide);
        communityTrack.addEventListener("focusout", startAutoSlide);

        communityTrack.addEventListener("touchstart", stopAutoSlide, {
            passive: true
        });

        communityTrack.addEventListener("touchend", startAutoSlide, {
            passive: true
        });

        // Mouse drag support

        communityTrack.addEventListener("mousedown", event => {
            if (event.button !== 0 || event.target.closest("a")) return;

            isDragging = true;
            startX = event.pageX;
            scrollStart = communityTrack.scrollLeft;

            communityTrack.classList.add("is-dragging");
            stopAutoSlide();
        });

        document.addEventListener("mousemove", event => {
            if (!isDragging) return;

            communityTrack.scrollLeft =
                scrollStart - (event.pageX - startX);
        });

        const stopDragging = () => {
            if (!isDragging) return;

            isDragging = false;
            communityTrack.classList.remove("is-dragging");
            startAutoSlide();
        };

        document.addEventListener("mouseup", stopDragging);
        window.addEventListener("blur", stopDragging);

        communityTrack.addEventListener("mouseleave", stopDragging);

        // Pause when the page is hidden

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
        });

        // Respect changes to motion preferences

        prefersReducedMotion.addEventListener("change", event => {
            if (event.matches) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
        });

        startAutoSlide();
    }

    // ----------------------------------------
    // 03. CURRENT YEAR
    // ----------------------------------------

    const yearElement = document.querySelector("[data-current-year]");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
