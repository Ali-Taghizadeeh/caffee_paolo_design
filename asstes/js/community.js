
/* =========================
   COMMUNITY PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {

    // Mobile Navigation
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // Community Filters
    const filterButtons = document.querySelectorAll(".filter-btn");
    const communityGrid = document.querySelector("#communityGrid");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");

            const selectedCategory = button.dataset.filter;

            communityGrid.querySelectorAll(".community-card").forEach(card => {
                const matches = selectedCategory === "all" ||
                    card.dataset.category === selectedCategory;

                card.classList.toggle("is-hidden", !matches);
            });
        });
    });

    // Like Buttons
    communityGrid.addEventListener("click", event => {
        const likeButton = event.target.closest(".like-btn");

        if (!likeButton) return;

        const icon = likeButton.querySelector("i");
        const count = likeButton.querySelector("span");
        const isLiked = likeButton.classList.toggle("liked");

        const currentCount = Number(count.textContent);

        count.textContent = isLiked
            ? currentCount + 1
            : currentCount - 1;

        icon.className = isLiked
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";
    });

    // Form Elements
    const communityForm = document.querySelector("#communityForm");
    const guestName = document.querySelector("#guestName");
    const guestPhoto = document.querySelector("#guestPhoto");
    const guestCategory = document.querySelector("#guestCategory");
    const guestMessage = document.querySelector("#guestMessage");
    const guestConsent = document.querySelector("#guestConsent");
    const fileName = document.querySelector("#fileName");
    const imagePreview = document.querySelector("#imagePreview");
    const charCount = document.querySelector("#charCount");
    const formFeedback = document.querySelector("#formFeedback");
    const ratingButtons = document.querySelectorAll("#ratingStars button");

    let selectedRating = 0;
    let selectedImageUrl = null;

    // Image Upload and Preview
    guestPhoto.addEventListener("change", () => {
        const file = guestPhoto.files[0];

        imagePreview.innerHTML = "";
        imagePreview.classList.remove("visible");

        if (selectedImageUrl) {
            URL.revokeObjectURL(selectedImageUrl);
            selectedImageUrl = null;
        }

        if (!file) {
            fileName.textContent = "No file selected";
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            showFeedback("Please choose a JPG, PNG or WEBP image.", true);
            guestPhoto.value = "";
            fileName.textContent = "No file selected";
            return;
        }

        if (file.size > maxSize) {
            showFeedback("Your image must be smaller than 5MB.", true);
            guestPhoto.value = "";
            fileName.textContent = "No file selected";
            return;
        }

        selectedImageUrl = URL.createObjectURL(file);

        fileName.textContent = file.name;

        const previewImage = document.createElement("img");
        previewImage.src = selectedImageUrl;
        previewImage.alt = "Selected photo preview";

        imagePreview.appendChild(previewImage);
        imagePreview.classList.add("visible");

        clearFeedback();
    });

    // Character Counter
    guestMessage.addEventListener("input", () => {
        charCount.textContent = guestMessage.value.length;
    });

    // Star Rating
    ratingButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedRating = Number(button.dataset.rating);

            ratingButtons.forEach(star => {
                const isSelected =
                    Number(star.dataset.rating) <= selectedRating;

                star.classList.toggle("selected", isSelected);

                star.querySelector("i").className = isSelected
                    ? "fa-solid fa-star"
                    : "fa-regular fa-star";
            });
        });
    });

    // Form Submission
    communityForm.addEventListener("submit", event => {
        event.preventDefault();

        clearFeedback();

        const name = guestName.value.trim();
        const message = guestMessage.value.trim();
        const category = guestCategory.value;
        const photo = guestPhoto.files[0];

        if (!name || !message || !category || !photo || !guestConsent.checked) {
            showFeedback("Please complete all required fields.", true);
            return;
        }

        if (!selectedImageUrl) {
            showFeedback("Please select a valid photo.", true);
            return;
        }

        const categoryLabels = {
            coffee: "COFFEE MOMENT",
            interior: "THE PLACE",
            dessert: "SWEET MOMENT",
            other: "GUEST MOMENT"
        };

        const post = {
            name,
            message,
            category,
            rating: selectedRating,
            image: selectedImageUrl,
            date: "Just now"
        };

        addCommunityPost(post, categoryLabels[category]);

        showFeedback(
            "Your post has been added to this preview. In the final website, posts will be sent for admin review."
        );

        communityForm.reset();

        charCount.textContent = "0";
        fileName.textContent = "No file selected";
        imagePreview.innerHTML = "";
        imagePreview.classList.remove("visible");

        ratingButtons.forEach(button => {
            button.classList.remove("selected");
            button.querySelector("i").className = "fa-regular fa-star";
        });

        selectedRating = 0;
        selectedImageUrl = null;

        document.querySelector("#community-feed").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Create New Community Card
    function addCommunityPost(post, categoryLabel) {
        const card = document.createElement("article");
        card.className = "community-card";
        card.dataset.category = post.category;

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "post-image";

        const image = document.createElement("img");
        image.src = post.image;
        image.alt = `Photo shared by ${post.name}`;

        const categoryBadge = document.createElement("span");
        categoryBadge.className = "post-category";
        categoryBadge.textContent = categoryLabel;

        imageWrapper.append(image, categoryBadge);

        const content = document.createElement("div");
        content.className = "post-content";

        const user = document.createElement("div");
        user.className = "post-user";

        const avatar = document.createElement("div");
        avatar.className = "user-avatar avatar-one";
        avatar.textContent = post.name.charAt(0).toUpperCase();

        const userInfo = document.createElement("div");

        const userName = document.createElement("strong");
        userName.textContent = post.name;

        const date = document.createElement("span");
        date.textContent = post.date;

        userInfo.append(userName, date);
        user.append(avatar, userInfo);

        const caption = document.createElement("p");
        caption.className = "post-caption";
        caption.textContent = post.message;

        const footer = document.createElement("div");
        footer.className = "post-footer";

        const location = document.createElement("span");
        location.innerHTML = '<i class="fa-solid fa-location-dot"></i> Paolo Cafe';

        const likeButton = document.createElement("button");
        likeButton.className = "like-btn";
        likeButton.setAttribute("aria-label", "Like this post");
        likeButton.innerHTML = '<i class="fa-regular fa-heart"></i> <span>0</span>';

        footer.append(location, likeButton);
        content.append(user, caption, footer);
        card.append(imageWrapper, content);

        communityGrid.prepend(card);

        // Show the new post even if another filter was active.
        filterButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.filter === "all");
        });

        communityGrid.querySelectorAll(".community-card").forEach(item => {
            item.classList.remove("is-hidden");
        });
    }

    // Feedback Messages
    function showFeedback(message, isError = false) {
        formFeedback.textContent = message;
        formFeedback.classList.add("visible");
        formFeedback.classList.toggle("error", isError);
    }

    function clearFeedback() {
        formFeedback.textContent = "";
        formFeedback.classList.remove("visible", "error");
    }

});
