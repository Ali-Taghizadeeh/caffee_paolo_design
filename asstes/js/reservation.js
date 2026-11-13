
/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
});

mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


/* =========================
   DATE VALIDATION
========================= */

const dateInput = document.getElementById("reservation-date");

const today = new Date();
const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localDate;


/* =========================
   RESERVATION FORM
========================= */

const reservationForm = document.getElementById("reservation-form");
const formMessage = document.getElementById("form-message");

reservationForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!reservationForm.checkValidity()) {
        reservationForm.reportValidity();
        return;
    }

    const formData = new FormData(reservationForm);

    const reservation = {
        name: formData.get("fullName"),
        phone: formData.get("phone"),
        date: formData.get("date"),
        time: formData.get("time"),
        guests: formData.get("guests"),
        occasion: formData.get("occasion"),
        message: formData.get("message")
    };

    console.log("Reservation request:", reservation);

    formMessage.textContent =
        "Your reservation request has been prepared successfully. " +
        "Please note that this demo does not submit or confirm a real booking.";

    formMessage.classList.add("is-visible");

    reservationForm.reset();

    dateInput.min = localDate;
});
