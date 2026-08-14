const form = document.getElementById("contact-form");
const status = document.getElementById("status");

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (status) {
            status.textContent = "Sending...";
        }

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            });

            // Get the response as text first
            // This prevents "Unexpected token '<'" if the server
            // accidentally sends an HTML error page.
            const text = await response.text();

            let result;

            try {
                result = JSON.parse(text);
            } catch {
                console.error("Server returned:", text);

                if (status) {
                    status.textContent =
                        "Something went wrong. The email server did not return a valid response.";
                }

                return;
            }

            if (response.ok && result.success) {
                if (status) {
                    status.textContent = "Message sent successfully!";
                }

                form.reset();
            } else {
                if (status) {
                    status.textContent =
                        "Something went wrong: " +
                        (result.error || "Unable to send message.");
                }

                console.error("API error:", result);
            }

        } catch (error) {
            console.error("Request error:", error);

            if (status) {
                status.textContent =
                    "Something went wrong. Please try again.";
            }
        }
    });
}