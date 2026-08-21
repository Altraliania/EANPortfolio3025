document.addEventListener("DOMContentLoaded", function () {

    console.log("SCRIPT.JS LOADED");

    const form =
        document.getElementById("contact-form");

    const status =
        document.getElementById("status");

    if (form && status) {

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();
                event.stopPropagation();

                const name =
                    document
                        .getElementById("name")
                        .value
                        .trim();

                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();

                const message =
                    document
                        .getElementById("message")
                        .value
                        .trim();

                if (
                    !name ||
                    !email ||
                    !message
                ) {

                    status.textContent =
                        "Please fill out all fields.";

                    return;
                }

                status.textContent =
                    "Sending...";

                try {

                    const response =
                        await fetch(
                            "https://ean-portfolio3025.vercel.app/api/send-email",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        name: name,
                                        email: email,
                                        message: message
                                    })
                            }
                        );

                    const text =
                        await response.text();

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

            }
        );

    }


    const overlay =
        document.getElementById(
            "page-overlay"
        );

    const fadeButtons =
        document.querySelectorAll(
            ".fade-link"
        );

    fadeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const targetUrl =
                        this.getAttribute(
                            "href"
                        );

                    if (overlay) {

                        overlay.classList.add(
                            "active"
                        );

                    }

                    setTimeout(
                        function () {

                            window.location.href =
                                targetUrl;

                        },
                        500
                    );

                }
            );

        }
    );


    window.addEventListener(
        "pageshow",
        function (event) {

            if (
                event.persisted &&
                overlay
            ) {

                overlay.classList.remove(
                    "active"
                );

            }

        }
    );


    updateClock();

    setInterval(
        updateClock,
        1000
    );


    sendVisitorHeartbeat();

    setInterval(
        sendVisitorHeartbeat,
        30000
    );

    sendVisitorLocation();

setInterval(
    sendVisitorLocation,
    60000
);
});


function updateClock() {

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            "en-US",
            {
                timeZone:
                    "America/New_York",

                hour:
                    "numeric",

                minute:
                    "2-digit",

                second:
                    "2-digit"
            }
        );

    const date =
        now.toLocaleDateString(
            "en-US",
            {
                timeZone:
                    "America/New_York",

                weekday:
                    "long",

                month:
                    "long",

                day:
                    "numeric",

                year:
                    "numeric"
            }
        );

    const clockTime =
        document.getElementById(
            "clockTime"
        );

    const clockDate =
        document.getElementById(
            "clockDate"
        );

    if (clockTime) {

        clockTime.textContent =
            time;

    }

    if (clockDate) {

        clockDate.textContent =
            date;

    }

}


async function sendVisitorHeartbeat() {

    try {

        const response =
            await fetch(
                "/api/visitor",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    cache:
                        "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Visitor API returned HTTP ${response.status}`
            );

        }

        const data =
            await response.json();

        if (
            data &&
            data.success
        ) {

            console.log(
                "Visitor heartbeat active."
            );

        } else {

            console.warn(
                "Visitor heartbeat was rejected."
            );

        }

    } catch (error) {

        console.error(
            "Visitor heartbeat failed:",
            error
        );

    }

}

async function sendVisitorLocation() {

    try {

        await fetch(
            "/api/visitor-locations",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    "Accept":
                        "application/json"
                },
                cache: "no-store"
            }
        );

    } catch (error) {

        console.error(
            "Visitor location tracking failed:",
            error
        );

    }

}