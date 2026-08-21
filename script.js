document.addEventListener("DOMContentLoaded", function () {

    console.log("SCRIPT.JS LOADED");


    // ==================================================
    // CONTACT FORM
    // ==================================================

    const form = document.getElementById("contact-form");
    const status = document.getElementById("status");

    console.log("FORM:", form);
    console.log("STATUS:", status);


    if (form && status) {

        form.addEventListener("submit", async function (event) {

            // VERY IMPORTANT
            // Prevent the browser from refreshing the page
            event.preventDefault();
            event.stopPropagation();

            console.log("FORM SUBMISSION STOPPED");


            // Get form values
            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const message =
                document.getElementById("message").value.trim();


            // Check fields
            if (!name || !email || !message) {

                status.textContent =
                    "Please fill out all fields.";

                return;
            }


            // Show sending message
            status.textContent = "Sending...";


            console.log("Sending contact form...");


            try {

                // Vercel API
               const response = await fetch(
    "https://ean-portfolio3025.vercel.app/api/send-email",
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


                console.log(
                    "Response status:",
                    response.status
                );


                // Read response
                const text =
                    await response.text();


                console.log(
                    "Server response:",
                    text
                );


                // Convert response to JSON
                let result;

                try {

                    result =
                        JSON.parse(text);

                } catch (error) {

                    console.error(
                        "Server did not return JSON:",
                        text
                    );

                    status.textContent =
                        "The email server returned an unexpected response.";

                    return;
                }


                // Successful email
                if (
                    response.ok &&
                    result.success
                ) {

                    status.textContent =
                        "Message sent successfully!";

                    form.reset();

                } else {

                    status.textContent =
                        "Something went wrong: " +
                        (
                            result.error ||
                            "Unknown server error."
                        );

                }

            } catch (error) {

                console.error(
                    "Request error:",
                    error
                );

                status.textContent =
                    "Could not connect to the email server.";

            }

        });

    } else {

        console.error(
            "CONTACT FORM OR STATUS ELEMENT NOT FOUND"
        );

    }


    // ==================================================
    // PAGE TRANSITIONS
    // ==================================================

    const overlay =
        document.getElementById("page-overlay");

    const fadeButtons =
        document.querySelectorAll(".fade-link");


    fadeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const targetUrl =
                    this.getAttribute("href");


                if (overlay) {

                    overlay.classList.add("active");

                }


                setTimeout(function () {

                    window.location.href =
                        targetUrl;

                }, 500);

            }
        );

    });


    // ==================================================
    // PAGE SHOW
    // ==================================================

    window.addEventListener(
        "pageshow",
        function (event) {

            if (
                event.persisted &&
                overlay
            ) {

                overlay.classList.remove("active");

            }

        }
    );

});

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
    });

    const date = now.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    document.getElementById("clockTime").textContent = time;
    document.getElementById("clockDate").textContent = date;
}

updateClock();
setInterval(updateClock, 1000);