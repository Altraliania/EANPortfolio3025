// =========================
// ELEMENTS
// =========================

const music = document.getElementById("music");
const playPause = document.getElementById("playPause");

const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const volumeIcon = document.getElementById("volumeIcon");

const progressBar = document.getElementById("progressBar");

const currentTimeDisplay =
    document.getElementById("currentTime");

const durationDisplay =
    document.getElementById("duration");

const albumArt =
    document.getElementById("albumArt");

const issueBadge =
    document.getElementById("issueBadge");

const issueTitle =
    document.getElementById("issueTitle");

const issueStatus =
    document.getElementById("issueStatus");

const issueName =
    document.getElementById("issueName");

const issueDescription =
    document.getElementById("issueDescription");

const issueSuggestion =
    document.getElementById("issueSuggestion");

const mainTitle =
    document.getElementById("mainTitle");

const mainSubtitle =
    document.getElementById("mainSubtitle");

const pageTitle =
    document.getElementById("pageTitle");

const terminalResult =
    document.getElementById("terminalResult");

const terminalIssue =
    document.getElementById("terminalIssue");

const terminalStatus =
    document.getElementById("terminalStatus");

const terminalSuggestion =
    document.getElementById("terminalSuggestion");

const terminalDiagnosis =
    document.getElementById("terminalDiagnosis");


// =========================
// ERROR TYPES
// =========================

const issues = {

    incorrect: {

        title: "Incorrect Link",

        description:
            "The requested page could not be found.",

        suggestion:
            "Check the URL and try again.",

        status: "NOT FOUND",

        badgeClass: "warning",

        pageTitle: "404 | Incorrect Link",

        heading: "Page Not Found",

        subtitle:
            "The link you followed doesn't appear to point to a valid page."
    },


    server: {

        title: "Server Issue",

        description:
            "The server may be temporarily unavailable.",

        suggestion:
            "Try refreshing the page in a moment.",

        status: "SERVER ERROR",

        badgeClass: "warning",

        pageTitle: "404 | Server Issue",

        heading: "The Server Had a Problem",

        subtitle:
            "The requested page could not be reached correctly from the server."
    },


    updating: {

        title: "Page Being Updated",

        description:
            "This page may currently be under maintenance.",

        suggestion:
            "Come back shortly and try again.",

        status: "UPDATING",

        badgeClass: "warning",

        pageTitle:
            "404 | Page Being Updated",

        heading:
            "This Page Is Being Updated",

        subtitle:
            "The page may be temporarily unavailable while changes are being made."
    },


    offline: {

        title: "Wi-Fi / Internet Issue",

        description:
            "Your browser appears to be offline.",

        suggestion:
            "Reconnect to the internet and refresh.",

        status: "OFFLINE",

        badgeClass: "offline",

        pageTitle:
            "404 | Internet Issue",

        heading:
            "You're Offline",

        subtitle:
            "Your browser currently reports that there is no internet connection."
    },


    unavailable: {

        title: "Page Temporarily Unavailable",

        description:
            "The requested page may be temporarily unavailable.",

        suggestion:
            "Try again later or return to the homepage.",

        status: "UNAVAILABLE",

        badgeClass: "warning",

        pageTitle:
            "404 | Temporarily Unavailable",

        heading:
            "Page Temporarily Unavailable",

        subtitle:
            "Something prevented this page from being displayed right now."
    }

};


// =========================
// GET FORCED ISSUE
// =========================

function getForcedIssue() {

    const params =
        new URLSearchParams(window.location.search);

    const issue =
        params.get("issue");

    if (!issue) {
        return null;
    }

    const normalized =
        issue.toLowerCase().trim();

    return issues[normalized] || null;
}


// =========================
// DETECT ISSUE
// =========================

function detectIssue() {

    const forcedIssue =
        getForcedIssue();

    if (forcedIssue) {
        return forcedIssue;
    }


    if (!navigator.onLine) {
        return issues.offline;
    }


    const path =
        window.location.pathname.toLowerCase();


    if (
        path.includes("maintenance") ||
        path.includes("updating")
    ) {
        return issues.updating;
    }


    return issues.incorrect;
}


// =========================
// APPLY ISSUE
// =========================

function applyIssue(issue) {

    pageTitle.textContent =
        issue.pageTitle;

    document.title =
        issue.pageTitle;

    issueTitle.textContent =
        issue.title;

    issueName.textContent =
        issue.title;

    issueDescription.textContent =
        issue.description;

    issueSuggestion.textContent =
        issue.suggestion;

    issueStatus.textContent =
        issue.status;

    mainTitle.textContent =
        issue.heading;

    mainSubtitle.textContent =
        issue.subtitle;


    terminalIssue.textContent =
        `Issue: ${issue.title}`;

    terminalStatus.textContent =
        `Status: ${issue.description}`;

    terminalSuggestion.textContent =
        `Suggestion: ${issue.suggestion}`;

    terminalDiagnosis.textContent =
        `Diagnosis complete → ${issue.title}`;


    terminalResult.textContent =
        `Error: ${issue.title.toLowerCase()}.`;


    issueBadge.classList.remove(
        "offline",
        "warning",
        "ok"
    );

    issueBadge.classList.add(
        issue.badgeClass
    );
}


// =========================
// DIAGNOSTICS
// =========================

function runDiagnostics() {

    const issue =
        detectIssue();

    applyIssue(issue);

    console.log(
        `[404 Diagnostics] ${issue.title}`
    );

    console.log(
        `[404 Diagnostics] ${issue.description}`
    );

    console.log(
        `[404 Diagnostics] ${issue.suggestion}`
    );
}


// =========================
// INTERNET STATUS
// =========================

window.addEventListener(
    "offline",
    () => {

        applyIssue(
            issues.offline
        );

    }
);


window.addEventListener(
    "online",
    () => {

        runDiagnostics();

    }
);


// =========================
// FORMAT TIME
// =========================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}


// =========================
// PLAYER UI
// =========================

function updatePlayerUI() {

    if (music.paused) {

        playPause.textContent =
            "▶";

        albumArt.classList.remove(
            "playing"
        );

    } else {

        playPause.textContent =
            "❚❚";

        albumArt.classList.add(
            "playing"
        );
    }
}


// =========================
// PLAY / PAUSE
// =========================

playPause.addEventListener(
    "click",
    () => {

        if (music.paused) {

            music.play()
                .then(() => {

                    updatePlayerUI();

                })
                .catch(() => {

                    console.log(
                        "Browser blocked autoplay."
                    );

                });

        } else {

            music.pause();

            updatePlayerUI();
        }

    }
);


// =========================
// INITIAL VOLUME
// =========================

music.volume = 0.70;


// =========================
// VOLUME
// =========================

volumeSlider.addEventListener(
    "input",
    () => {

        const volume =
            Number(volumeSlider.value);

        music.volume =
            volume / 100;

        volumeValue.textContent =
            `${volume}%`;


        if (volume === 0) {

            volumeIcon.textContent =
                "🔇";

        } else if (volume < 50) {

            volumeIcon.textContent =
                "🔉";

        } else {

            volumeIcon.textContent =
                "🔊";
        }

    }
);


// =========================
// MUSIC METADATA
// =========================

music.addEventListener(
    "loadedmetadata",
    () => {

        progressBar.max =
            music.duration;

        durationDisplay.textContent =
            formatTime(
                music.duration
            );

    }
);


// =========================
// MUSIC PROGRESS
// =========================

music.addEventListener(
    "timeupdate",
    () => {

        progressBar.value =
            music.currentTime;

        currentTimeDisplay.textContent =
            formatTime(
                music.currentTime
            );

    }
);


// =========================
// MANUAL SEEK
// =========================

progressBar.addEventListener(
    "input",
    () => {

        music.currentTime =
            progressBar.value;

    }
);


// =========================
// AUDIO EVENTS
// =========================

music.addEventListener(
    "play",
    updatePlayerUI
);

music.addEventListener(
    "pause",
    updatePlayerUI
);


// =========================
// AUTOPLAY
// =========================

window.addEventListener(
    "load",
    () => {

        music.play()

            .then(() => {

                updatePlayerUI();

            })

            .catch(() => {

                updatePlayerUI();

            });

    }
);


// =========================
// START DIAGNOSTICS
// =========================

runDiagnostics();

// =========================
// END OF SCRIPT
// =========================