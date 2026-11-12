(() => {
    "use strict";

    const header = document.querySelector(".header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".nav");

    /* Mobile navigation */
    if (menuToggle && navigation) {
        const closeMenu = () => {
            navigation.classList.remove("show");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        };

        const openMenu = () => {
            navigation.classList.add("show");
            menuToggle.classList.add("active");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation");
        };

        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            isOpen ? closeMenu() : openMenu();
        });

        navigation.addEventListener("click", event => {
            if (event.target.closest("a")) closeMenu();
        });

        document.addEventListener("click", event => {
            if (!header?.contains(event.target)) closeMenu();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 800) closeMenu();
        }, { passive: true });
    }

    /* Keep anchor navigation clear of the fixed header.
       CSS scroll-behavior handles the smooth animation. */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");
            if (!href || href === "#") {
                event.preventDefault();
                return;
            }

            const target = document.getElementById(href.slice(1));
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", href);
        });
    });

    /* Gallery lightbox */
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (galleryItems.length) {
        const lightbox = document.createElement("div");
        lightbox.className = "gallery-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Gallery image preview");
        lightbox.innerHTML = `
            <button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button>
            <img src="" alt="">
        `;
        document.body.append(lightbox);

        const preview = lightbox.querySelector("img");
        const closeButton = lightbox.querySelector(".lightbox-close");
        let previousFocus = null;

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.classList.remove("lightbox-open");
            preview.removeAttribute("src");
            previousFocus?.focus();
        };

        galleryItems.forEach(item => {
            item.addEventListener("click", event => {
                const image = item.querySelector("img");
                if (!image) return;

                event.preventDefault();
                previousFocus = item;
                preview.src = image.currentSrc || image.src;
                preview.alt = image.alt || "Paolo Cafe gallery image";
                lightbox.classList.add("active");
                document.body.classList.add("lightbox-open");
                closeButton.focus();
            });
        });

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    /* Current year */
    const currentYear = document.querySelector("[data-current-year]");
    if (currentYear) currentYear.textContent = new Date().getFullYear();
})();
