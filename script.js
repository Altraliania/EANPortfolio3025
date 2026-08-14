const form = document.getElementById("contact-form");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

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

        const result = await response.json();

        if (response.ok) {
            status.textContent = "Message sent successfully!";
            form.reset();
        } else {
            status.textContent = "Something went wrong: " + result.error;
        }

    } catch (error) {
        console.error(error);
        status.textContent = "Something went wrong.";
    }
});