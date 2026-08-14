document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // CONTACT FORM
    // =========================

    const form = document.getElementById("contact-form");
    const status = document.getElementById("status");

    if (form && status) {

        form.addEventListener("submit", async function (event) {

            // STOP NORMAL FORM SUBMISSION
            event.preventDefault();
            event.stopPropagation();

            console.log("SUBMIT BUTTON CLICKED");

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                status.textContent = "Please fill out all fields.";
                return;
            }

            status.textContent = "Sending...";

            try {

                const response = await fetch(
                    "https://ean-portfolio3025-git-main-altralianias-projects.vercel.app/api/send-email",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            email: email,
                            message: message
                        })
                    }
                );

                console.log("Response status:", response.status);

                const text = await response.text();

                console.log("Server response:", text);

                let result;

                try {
                    result = JSON.parse(text);
                } catch (error) {

                    console.error(
                        "Server did not return JSON:",
                        text
                    );

                    status.textContent =
                        "The email server returned an unexpected response.";

                    return;
                }

                if (response.ok && result.success) {

                    status.textContent =
                        "Message sent successfully!";

                    form.reset();

                } else {

                    status.textContent =
                        "Something went wrong: " +
                        (result.error || "Unknown server error.");

                }

            } catch (error) {

                console.error("Request error:", error);

                status.textContent =
                    "Could not connect to the email server.";

            }

        });

    }


    // =========================
    // PAGE TRANSITION
    // =========================

    const overlay = document.getElementById("page-overlay");
    const fadeButtons = document.querySelectorAll(".fade-link");

    fadeButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const targetUrl = this.getAttribute("href");

            if (overlay) {
                overlay.classList.add("active");
            }

            setTimeout(function () {

                window.location.href = targetUrl;

            }, 500);

        });

    });


    // =========================
    // PAGE SHOW
    // =========================

    window.addEventListener("pageshow", function (event) {

        if (event.persisted && overlay) {
            overlay.classList.remove("active");
        }

    });

});