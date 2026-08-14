document.addEventListener("DOMContentLoaded", () => {

    // ===============================
// CONTACT FORM
// ===============================

const form = document.getElementById("contact-form");
const status = document.getElementById("status");

// Your Vercel backend
const API_URL =
    "https://ean-portfolio3025-git-main-altralianias-projects.vercel.app/api/send-email";

if (form && status) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Check that all fields are filled
        if (!name || !email || !message) {
            status.textContent = "Please fill out all fields.";
            return;
        }

        status.textContent = "Sending...";

        console.log("Sending contact form...");

        try {
            const response = await fetch(API_URL, {
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
            const text = await response.text();

            console.log("Server response:", text);

            let result;

            // Try to parse JSON
            try {
                result = JSON.parse(text);
            } catch (error) {
                console.error("Server did not return JSON:", text);

                status.textContent =
                    "Something went wrong. The email server returned an unexpected response.";

                return;
            }

            // Successful request
            if (response.ok && result.success) {
                status.textContent = "Message sent successfully!";

                form.reset();
            } else {
                status.textContent =
                    "Something went wrong: " +
                    (result.error || "Unknown server error.");
            }

        } catch (error) {
            console.error("Contact form error:", error);

            status.textContent =
                "Something went wrong. Please try again.";
        }
    });
}


// ===============================
// PAGE TRANSITION
// ===============================

const overlay = document.getElementById("page-overlay");
const fadeButtons = document.querySelectorAll(".fade-link");

fadeButtons.forEach((button) => {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        const targetUrl = this.getAttribute("href");

        if (overlay) {
            overlay.classList.add("active");
        }

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 500);

    });

});


// Remove overlay when returning to the page
window.addEventListener("pageshow", function (event) {

    if (event.persisted && overlay) {
        overlay.classList.remove("active");
    }

});