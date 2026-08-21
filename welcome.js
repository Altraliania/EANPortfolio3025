document.addEventListener("DOMContentLoaded", function () {

    const welcomeScreen = document.getElementById("welcomeScreen");
    const welcomeText = document.getElementById("welcomeText");
    const bootMessages = document.getElementById("bootMessages");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const skipButton = document.getElementById("skipWelcome");

    if (!welcomeScreen) {
        return;
    }

    function closeWelcome() {
        welcomeScreen.classList.add("hide");

        sessionStorage.setItem(
            "portfolioWelcomeSeen",
            "true"
        );
    }

    // Skip button
    skipButton.addEventListener("click", function () {
        closeWelcome();
    });

    // Check if already shown this session
    if (sessionStorage.getItem("portfolioWelcomeSeen") === "true") {
        welcomeScreen.classList.add("hide");
        return;
    }

    // Type WELCOME
    const title = "WELCOME.";
    let titleIndex = 0;

    function typeTitle() {

        if (titleIndex < title.length) {

            welcomeText.textContent += title.charAt(titleIndex);

            titleIndex++;

            setTimeout(typeTitle, 100);

        } else {

            setTimeout(startBootSequence, 500);
        }
    }

    // Boot messages
    function startBootSequence() {

        const messages = [
            "Initializing portfolio...",
            "Loading projects...",
            "Loading experience...",
            "Loading MUN profile...",
            "Loading skills...",
            "Connecting to GitHub...",
            "System ready."
        ];

        let index = 0;

        function nextMessage() {

            if (index >= messages.length) {

                setTimeout(closeWelcome, 800);

                return;
            }

            const message = document.createElement("div");

            message.className = "boot-message";

            if (index === messages.length - 1) {

                message.innerHTML =
                    `<span class="boot-success">✓</span> ${messages[index]}`;

            } else {

                message.innerHTML =
                    `<span class="boot-prefix">›</span> ${messages[index]}`;
            }

            bootMessages.appendChild(message);

            index++;

            const percentage = Math.round(
                (index / messages.length) * 100
            );

            progressBar.style.width = percentage + "%";
            progressText.textContent = percentage + "%";

            setTimeout(nextMessage, 450);
        }

        nextMessage();
    }

    // Start
    typeTitle();

});