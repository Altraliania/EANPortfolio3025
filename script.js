const form = document.getElementById("contact-form");
const status = document.getElementById("status");

if (form && status) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            status.textContent = "Please fill out all fields.";
            return;
        }

        status.textContent = "Sending...";

        try {
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

            // Get the response as text first
            const text = await response.text();

            console.log("Server response:", text);

            let result;

            // Try to convert the response into JSON
            try {
                result = JSON.parse(text);
            } catch (error) {
                console.error("Invalid JSON response:", text);

                status.textContent =
                    "Something went wrong. The email server did not return a valid response.";

                return;
            }

            // Successful email
            if (response.ok && result.success) {
                status.textContent = "Message sent successfully!";
                form.reset();
            } else {
                status.textContent =
                    "Something went wrong: " +
                    (result.error || "Unknown server error.");
            }

        } catch (error) {
            console.error("Request error:", error);

            status.textContent =
                "Something went wrong. Please try again.";
        }
    });
}

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

window.addEventListener("pageshow", function (event) {
    if (event.persisted && overlay) {
        overlay.classList.remove("active");
    }
});