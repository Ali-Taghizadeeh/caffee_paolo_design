
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==============================
    // 01. DOM ELEMENTS
    // ==============================

    const tabs = document.querySelectorAll(".auth-tab");
    const forms = document.querySelectorAll(".auth-form");
    const tabContainer = document.querySelector(".auth-tabs");

    const title = document.getElementById("form-title");
    const description = document.getElementById("form-description");
    const switchText = document.getElementById("switch-text");
    const message = document.getElementById("form-message");

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    const signupPassword = document.getElementById("signup-password");
    const signupConfirm = document.getElementById("signup-confirm");
    const termsCheckbox = document.getElementById("terms");

    const passwordRules = document.querySelectorAll("[data-rule]");

    // ==============================
    // 02. FORM CONFIGURATION
    // ==============================

    const formConfig = {
        login: {
            title: "Welcome Back",
            description: "Sign in to continue your coffee experience.",
            button: "Sign in",
            switch: `Don't have an account?`
        },

        signup: {
            title: "Create Account",
            description: "Join Paolo and enjoy every moment.",
            button: "Create Account",
            switch: "Already have an account?"
        }
    };

    let currentMode = "login";

    // ==============================
    // 03. SWITCH AUTH MODE
    // ==============================

    function switchMode(mode) {
        if (mode === currentMode) return;

        currentMode = mode;

        const isSignup = mode === "signup";
        const config = formConfig[mode];

        title.textContent = config.title;
        description.textContent = config.description;

        tabContainer.classList.toggle("signup-active", isSignup);

        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === mode;

            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });

        forms.forEach(form => {
            form.classList.toggle(
                "hidden",
                form.id !== `${mode}-form`
            );
        });

        const switchLabel = isSignup ? "Sign in" : "Sign up";

        switchText.innerHTML = `
            ${config.switch}
            <button type="button" data-switch="${isSignup ? "login" : "signup"}">
                ${switchLabel}
            </button>
        `;

        clearMessage();
        clearFormErrors();

        signupPassword.value = "";
        signupConfirm.value = "";

        updatePasswordRules("");
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            switchMode(tab.dataset.tab);
        });
    });

    document.addEventListener("click", event => {
        const switchButton = event.target.closest("[data-switch]");

        if (!switchButton) return;

        switchMode(switchButton.dataset.switch);
    });

    // ==============================
    // 04. VALIDATION HELPERS
    // ==============================

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(email);
    }

    function getField(input) {
        return input.closest(".form-group");
    }

    function showFieldError(input, errorText) {
        const group = getField(input);
        const wrapper = group.querySelector(".input-wrapper");
        const error = group.querySelector(".field-error");

        wrapper.classList.add("has-error");
        wrapper.classList.remove("has-success");

        error.textContent = errorText;
        error.classList.add("visible");

        input.setAttribute("aria-invalid", "true");
    }

    function showFieldSuccess(input) {
        const group = getField(input);
        const wrapper = group.querySelector(".input-wrapper");
        const error = group.querySelector(".field-error");

        wrapper.classList.remove("has-error");
        wrapper.classList.add("has-success");

        error.textContent = "";
        error.classList.remove("visible");

        input.setAttribute("aria-invalid", "false");
    }

    function clearFieldError(input) {
        const group = getField(input);
        const wrapper = group.querySelector(".input-wrapper");
        const error = group.querySelector(".field-error");

        wrapper.classList.remove("has-error", "has-success");

        error.textContent = "";
        error.classList.remove("visible");

        input.removeAttribute("aria-invalid");
    }

    function clearFormErrors() {
        document.querySelectorAll(".auth-form input").forEach(input => {
            if (input.type !== "checkbox") {
                clearFieldError(input);
            }
        });

        document.querySelector(".terms-error").classList.remove("visible");
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `form-message visible ${type}`;
    }

    function clearMessage() {
        message.textContent = "";
        message.className = "form-message";
    }

    // ==============================
    // 05. PASSWORD REQUIREMENTS
    // ==============================

    function getPasswordRules(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
    }

    function updatePasswordRules(password) {
        const rules = getPasswordRules(password);

        passwordRules.forEach(rule => {
            const ruleName = rule.dataset.rule;
            const isValid = rules[ruleName];

            rule.classList.toggle("valid", isValid);
        });
    }

    function isStrongPassword(password) {
        const rules = getPasswordRules(password);

        return Object.values(rules).every(Boolean);
    }

    signupPassword.addEventListener("input", () => {
        updatePasswordRules(signupPassword.value);

        if (signupPassword.value) {
            if (isStrongPassword(signupPassword.value)) {
                showFieldSuccess(signupPassword);
            } else {
                clearFieldError(signupPassword);
            }
        } else {
            clearFieldError(signupPassword);
        }

        if (signupConfirm.value) {
            validateConfirmPassword();
        }
    });

    // ==============================
    // 06. PASSWORD VISIBILITY
    // ==============================

    document.querySelectorAll(".password-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const input = button.parentElement.querySelector("input");
            const icon = button.querySelector("i");

            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";

            icon.classList.toggle("fa-eye", !isPassword);
            icon.classList.toggle("fa-eye-slash", isPassword);

            button.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    });

    // ==============================
    // 07. LOGIN VALIDATION
    // ==============================

    function validateLogin() {
        const email = document.getElementById("login-email");
        const password = document.getElementById("login-password");

        let isValid = true;

        clearFieldError(email);
        clearFieldError(password);

        if (!email.value.trim()) {
            showFieldError(email, "Email address is required.");
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showFieldError(email, "Please enter a valid email address.");
            isValid = false;
        } else {
            showFieldSuccess(email);
        }

        if (!password.value) {
            showFieldError(password, "Password is required.");
            isValid = false;
        } else {
            showFieldSuccess(password);
        }

        return isValid;
    }

    // ==============================
    // 08. SIGNUP VALIDATION
    // ==============================

    function validateName() {
        const name = document.getElementById("signup-name");
        const value = name.value.trim();

        clearFieldError(name);

        if (!value) {
            showFieldError(name, "Full name is required.");
            return false;
        }

        if (value.length < 2) {
            showFieldError(name, "Name must contain at least 2 characters.");
            return false;
        }

        showFieldSuccess(name);
        return true;
    }

    function validateEmail(input) {
        const email = input.value.trim();

        clearFieldError(input);

        if (!email) {
            showFieldError(input, "Email address is required.");
            return false;
        }

        if (!isValidEmail(email)) {
            showFieldError(input, "Please enter a valid email address.");
            return false;
        }

        showFieldSuccess(input);
        return true;
    }

    function validateSignupPassword() {
        const password = signupPassword.value;

        clearFieldError(signupPassword);

        if (!password) {
            showFieldError(signupPassword, "Password is required.");
            return false;
        }

        if (!isStrongPassword(password)) {
            showFieldError(signupPassword, "Your password does not meet all requirements.");
            return false;
        }

        showFieldSuccess(signupPassword);
        return true;
    }

    function validateConfirmPassword() {
        const password = signupPassword.value;
        const confirm = signupConfirm.value;

        clearFieldError(signupConfirm);

        if (!confirm) {
            showFieldError(signupConfirm, "Please confirm your password.");
            return false;
        }

        if (password !== confirm) {
            showFieldError(signupConfirm, "Passwords do not match.");
            return false;
        }

        showFieldSuccess(signupConfirm);
        return true;
    }

    function validateSignup() {
        const nameValid = validateName();

        const emailValid = validateEmail(
            document.getElementById("signup-email")
        );

        const passwordValid = validateSignupPassword();
        const confirmValid = validateConfirmPassword();

        const termsError = document.querySelector(".terms-error");

        if (!termsCheckbox.checked) {
            termsError.textContent = "You must accept the terms to continue.";
            termsError.classList.add("visible");
        } else {
            termsError.textContent = "";
            termsError.classList.remove("visible");
        }

        return (
            nameValid &&
            emailValid &&
            passwordValid &&
            confirmValid &&
            termsCheckbox.checked
        );
    }

    // ==============================
    // 09. LIVE FIELD VALIDATION
    // ==============================

    document.querySelectorAll(".auth-form input").forEach(input => {
        if (input.type === "checkbox" || input.type === "password") return;

        input.addEventListener("blur", () => {
            if (!input.value.trim()) return;

            if (input.id === "signup-name") {
                validateName();
            } else if (
                input.id === "login-email" ||
                input.id === "signup-email"
            ) {
                validateEmail(input);
            }
        });

        input.addEventListener("input", () => {
            clearFieldError(input);
            clearMessage();
        });
    });

    signupConfirm.addEventListener("input", () => {
        if (signupConfirm.value) {
            validateConfirmPassword();
        } else {
            clearFieldError(signupConfirm);
        }
    });

    termsCheckbox.addEventListener("change", () => {
        const termsError = document.querySelector(".terms-error");

        termsError.classList.remove("visible");
        termsError.textContent = "";
    });

    // ==============================
    // 10. SUBMIT ANIMATION
    // ==============================

    function setButtonLoading(button, isLoading) {
        button.disabled = isLoading;
        button.classList.toggle("loading", isLoading);

        const text = button.querySelector(".btn-text");

        if (isLoading) {
            text.textContent = "Please wait...";
        } else {
            text.textContent = currentMode === "login"
                ? "Sign In"
                : "Create Account";
        }
    }

    function simulateRequest() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }

    // ==============================
    // 11. LOGIN SUBMISSION
    // ==============================

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        clearMessage();

        if (!validateLogin()) {
            showMessage(
                "Please correct the highlighted fields.",
                "error"
            );
            return;
        }

        const button = loginForm.querySelector(".submit-btn");

        setButtonLoading(button, true);

        try {
            // Replace with your authentication API.
            await simulateRequest();

            showMessage(
                "Form validated successfully. Connect your authentication service to complete login.",
                "success"
            );

        } catch (error) {
            showMessage(
                "Something went wrong. Please try again.",
                "error"
            );
        } finally {
            setButtonLoading(button, false);
        }
    });

    // ==============================
    // 12. SIGNUP SUBMISSION
    // ==============================

    signupForm.addEventListener("submit", async event => {
        event.preventDefault();

        clearMessage();

        if (!validateSignup()) {
            showMessage(
                "Please check your information and try again.",
                "error"
            );
            return;
        }

        const button = signupForm.querySelector(".submit-btn");

        setButtonLoading(button, true);

        try {
            // Replace with your registration API.
            await simulateRequest();

            showMessage(
                "Your information is valid. Connect your registration service to create an account.",
                "success"
            );

        } catch (error) {
            showMessage(
                "Registration failed. Please try again.",
                "error"
            );
        } finally {
            setButtonLoading(button, false);
        }
    });

    // ==============================
    // 13. FORGOT PASSWORD
    // ==============================

    document.getElementById("forgot-password").addEventListener("click", event => {
        event.preventDefault();

        showMessage(
            "Password recovery will be available once the authentication service is connected.",
            "error"
        );
    });

    // ==============================
    // 14. GOOGLE LOGIN
    // ==============================

    document.getElementById("google-login").addEventListener("click", () => {
        showMessage(
            "Google authentication is not connected yet.",
            "error"
        );
    });

});
