
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Enable JavaScript-dependent styles
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

        navToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("show");

            navToggle.classList.toggle("active", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", event => {
            const clickedInside =
                mainNav.contains(event.target) ||
                navToggle.contains(event.target);

            if (!clickedInside) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 800) {
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
        const cards = Array.from(
            communityTrack.querySelectorAll(".community-card")
        );

        let autoSlideInterval;
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const getScrollAmount = () => {
            const firstCard = cards[0];

            if (!firstCard) return 300;

            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseFloat(
                getComputedStyle(communityTrack).gap
            ) || 0;

            return cardWidth + gap;
        };

        const moveSlide = direction => {
            communityTrack.scrollBy({
                left: getScrollAmount() * direction,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        };

        communityNext.addEventListener("click", () => {
            moveSlide(1);
            restartAutoSlide();
        });

        communityPrev.addEventListener("click", () => {
            moveSlide(-1);
            restartAutoSlide();
        });

        const startAutoSlide = () => {
            if (prefersReducedMotion || cards.length < 2) return;

            stopAutoSlide();

            autoSlideInterval = setInterval(() => {
                const maxScroll =
                    communityTrack.scrollWidth -
                    communityTrack.clientWidth;

                if (communityTrack.scrollLeft >= maxScroll - 5) {
                    communityTrack.scrollTo({
                        left: 0,
                        behavior: "smooth"
                    });
                } else {
                    moveSlide(1);
                }
            }, 4500);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        const restartAutoSlide = () => {
            stopAutoSlide();
            startAutoSlide();
        };

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
            if (event.target.closest("a")) return;

            isDragging = true;
            startX = event.pageX;
            scrollStart = communityTrack.scrollLeft;

            communityTrack.classList.add("is-dragging");
            stopAutoSlide();
        });

        document.addEventListener("mousemove", event => {
            if (!isDragging) return;

            const distance = event.pageX - startX;

            communityTrack.scrollLeft = scrollStart - distance;
        });

        document.addEventListener("mouseup", () => {
            if (!isDragging) return;

            isDragging = false;
            communityTrack.classList.remove("is-dragging");
            startAutoSlide();
        });

        communityTrack.addEventListener("mouseleave", () => {
            if (!isDragging) return;

            isDragging = false;
            communityTrack.classList.remove("is-dragging");
            startAutoSlide();
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
