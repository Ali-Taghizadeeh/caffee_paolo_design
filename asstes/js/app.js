
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Enable JavaScript-dependent styles
    document.documentElement.classList.add("js-enabled");

    // ----------------------------------------
    // 01. MOBILE NAVIGATION
    // ----------------------------------------

    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (navToggle && mainNav) {
        const closeMenu = () => {
            mainNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        };

        navToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");

            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Close menu after selecting a link
        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close menu with Escape key
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
            const clickedInside =
                mainNav.contains(event.target) ||
                navToggle.contains(event.target);

            if (!clickedInside) {
                closeMenu();
            }
        });
    }

    // ----------------------------------------
    // 02. MENU CATEGORY FILTERS
    // ----------------------------------------

    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");
    const emptyMessage = document.querySelector(".empty-message");

    if (filterButtons.length && productCards.length) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const selectedCategory = button.dataset.filter;
                let visibleCount = 0;

                // Update active filter button
                filterButtons.forEach((item) => {
                    const isActive = item === button;

                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-pressed", String(isActive));
                });

                // Filter products
                productCards.forEach((card) => {
                    const matches =
                        selectedCategory === "all" ||
                        card.dataset.category === selectedCategory;

                    card.hidden = !matches;

                    if (matches) {
                        visibleCount++;
                    }
                });

                // Update empty state
                if (emptyMessage) {
                    emptyMessage.hidden = visibleCount > 0;
                }
            });
        });
    }

    // ----------------------------------------
    // 03. MENU SCROLL ANIMATION
    // ----------------------------------------

    const menuSection = document.querySelector(".menu-section");

    if (!menuSection) return;

    const menuCards = menuSection.querySelectorAll(".product-card");

    // Set staggered animation delays
    menuCards.forEach((card, index) => {
        const delay = (index % 4) * 100;

        card.style.setProperty("--card-delay", `${delay}ms`);
    });

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        menuSection.classList.add("is-visible");
        return;
    }

    // Observe menu section
    const menuObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                menuSection.classList.add("is-visible");

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12
        }
    );

    menuObserver.observe(menuSection);
});
