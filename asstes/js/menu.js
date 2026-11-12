
document.addEventListener("DOMContentLoaded", () => {
    // Mobile navigation
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Menu category filters
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");
    const emptyMessage = document.querySelector(".empty-message");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCategory = button.dataset.filter;
            let visibleCount = 0;

            filterButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");

            productCards.forEach(card => {
                const matches =
                    selectedCategory === "all" ||
                    card.dataset.category === selectedCategory;

                card.classList.toggle("is-hidden", !matches);

                if (matches) visibleCount++;
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount !== 0;
            }
        });
    });
});

    // Menu section scroll animation
    const menuSection = document.querySelector(".menu-section");
    const menuCards = document.querySelectorAll(".product-card");

    if (menuSection) {
        menuCards.forEach((card, index) => {
            card.style.setProperty(
                "--card-delay",
                `${Math.min(index % 4, 3) * 100}ms`
            );
        });

        const menuObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        menuSection.classList.add("is-visible");
                        menuObserver.unobserve(menuSection);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        menuObserver.observe(menuSection);
    }
