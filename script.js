document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // CONTACT FORM
    // ==============================

    const form = document.getElementById("contact-form");
    const status = document.getElementById("status");

    if (form && status) {

        form.addEventListener("submit", async (event) => {

            // IMPORTANT:
            // Prevent the normal HTML form submission
            // so the page does NOT refresh.
            event.preventDefault();
            event.stopPropagation();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            if (!nameInput || !emailInput || !messageInput) {
                status.textContent = "Form fields could not be found.";
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Check that everything is filled out
            if (!name || !email || !message) {
                status.textContent = "Please fill out all fields.";
                return;
            }

            // Basic email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                status.textContent = "Please enter a valid email address.";
                return;
            }

            // Disable button while sending
            const submitButton = form.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            status.textContent = "Sending...";
            status.style.color = "";

            try {

                console.log("Sending contact form...");

                const response = await fetch("/api/send-email", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                });

                console.log("Response status:", response.status);

                // Get response as text first
                const responseText = await response.text();

                console.log("Server response:", responseText);

                let result = null;

                // Try to parse JSON
                if (responseText) {
                    try {
                        result = JSON.parse(responseText);
                    } catch (jsonError) {

                        console.error(
                            "Server did not return JSON:",
                            responseText
                        );

                        status.textContent =
                            "The email server returned an unexpected response.";

                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.textContent = "Send Message";
                        }

                        return;
                    }
                }

                // ==============================
                // SUCCESS
                // ==============================

                if (response.ok && result && result.success) {

                    status.textContent =
                        "Message sent successfully!";

                    status.style.color = "green";

                    form.reset();

                }

                // ==============================
                // SERVER ERROR
                // ==============================

                else {

                    const errorMessage =
                        result && result.error
                            ? result.error
                            : `Server returned status ${response.status}.`;

                    console.error(
                        "Email server error:",
                        errorMessage
                    );

                    status.textContent =
                        "Something went wrong: " + errorMessage;

                    status.style.color = "red";
                }

            }

            // ==============================
            // NETWORK ERROR
            // ==============================

            catch (error) {

                console.error(
                    "Contact form request failed:",
                    error
                );

                status.textContent =
                    "Could not connect to the email server. Please try again.";

                status.style.color = "red";
            }

            // Re-enable button
            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent = "Send Message";
            }

        });

    }


    // ==============================
    // PAGE TRANSITIONS
    // ==============================

    const overlay = document.getElementById("page-overlay");
    const fadeButtons = document.querySelectorAll(".fade-link");

    fadeButtons.forEach((button) => {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const targetUrl = this.getAttribute("href");

            if (!targetUrl) {
                return;
            }

            if (overlay) {
                overlay.classList.add("active");
            }

            setTimeout(() => {

                window.location.href = targetUrl;

            }, 500);

        });

    });


    // Remove overlay when returning to page
    window.addEventListener("pageshow", (event) => {

        if (event.persisted && overlay) {

            overlay.classList.remove("active");

        }

    });

});