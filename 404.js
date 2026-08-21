const music = document.getElementById("music");
const playPause = document.getElementById("playPause");

const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const volumeIcon = document.getElementById("volumeIcon");

const progressBar = document.getElementById("progressBar");

const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

const albumArt = document.getElementById("albumArt");


// =========================
// INITIAL VOLUME
// =========================

music.volume = 0.70;


// =========================
// FORMAT TIME
// =========================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}


// =========================
// PLAY / PAUSE
// =========================

function updatePlayerUI() {

    if (music.paused) {

        playPause.textContent = "▶";

        albumArt.classList.remove("playing");

    } else {

        playPause.textContent = "❚❚";

        albumArt.classList.add("playing");
    }
}


playPause.addEventListener("click", () => {

    if (music.paused) {

        music.play()
            .then(() => {
                updatePlayerUI();
            })
            .catch(() => {
                console.log("Browser blocked autoplay.");
            });

    } else {

        music.pause();

        updatePlayerUI();
    }
});


// =========================
// VOLUME
// =========================

volumeSlider.addEventListener("input", () => {

    const volume = Number(volumeSlider.value);

    music.volume = volume / 100;

    volumeValue.textContent = `${volume}%`;

    if (volume === 0) {

        volumeIcon.textContent = "🔇";

    } else if (volume < 50) {

        volumeIcon.textContent = "🔉";

    } else {

        volumeIcon.textContent = "🔊";
    }
});


// =========================
// PROGRESS BAR
// =========================

music.addEventListener("loadedmetadata", () => {

    progressBar.max = music.duration;

    durationDisplay.textContent =
        formatTime(music.duration);
});


music.addEventListener("timeupdate", () => {

    progressBar.value = music.currentTime;

    currentTimeDisplay.textContent =
        formatTime(music.currentTime);
});


progressBar.addEventListener("input", () => {

    music.currentTime = progressBar.value;
});


// =========================
// AUDIO EVENTS
// =========================

music.addEventListener("play", updatePlayerUI);

music.addEventListener("pause", updatePlayerUI);


// =========================
// TRY AUTOPLAY
// =========================

// Browsers may block autoplay with sound.
// If allowed, the song starts automatically.

window.addEventListener("load", () => {

    music.play()
        .then(() => {
            updatePlayerUI();
        })
        .catch(() => {

            // Autoplay was blocked.
            // The visitor can press play manually.

            updatePlayerUI();

        });

});