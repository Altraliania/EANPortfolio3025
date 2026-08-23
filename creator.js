(function () {
    "use strict";

    const STORAGE_KEY = "portfolioProjects";
    const TIMELINE_TABLE = "timeline";
    const EASTER_EGG_PASSWORD = "Altrarunner";

    let passwordScreen = null;
    let gameScreen = null;

    let visitorStatsTimer = null;
    let visitorLocationTimer = null;
    let siteStatusTimer = null;

    let visitorMap = null;
    let visitorMarkers = [];

    let timelineData = [];

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener(
                "DOMContentLoaded",
                callback
            );
        } else {
            callback();
        }
    }

    function get(id) {
        return document.getElementById(id);
    }

    function escape(value) {
        const element =
            document.createElement("div");

        element.textContent =
            value ?? "";

        return element.innerHTML;
    }

    function getSupabase() {
        if (
            window.supabaseClient &&
            window.supabaseClient.auth
        ) {
            return window.supabaseClient;
        }

        return null;
    }

    function createStyle() {
        if (get("creatorInjectedStyles")) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "creatorInjectedStyles";

        style.textContent = `
            #creatorModeButton {
                position: fixed !important;
                right: 20px !important;
                bottom: 20px !important;
                left: auto !important;
                top: auto !important;
                z-index: 2147483647 !important;
                cursor: pointer !important;
            }

            #creatorPasswordScreen {
                position: fixed !important;
                inset: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 2147483647 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 20px !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                transition:
                    opacity .35s ease,
                    visibility .35s ease !important;
            }

            #creatorPasswordScreen.creator-password-visible {
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
            }

            #creatorPasswordScreen.creator-password-closing {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }

            .creator-password-backdrop {
                position: absolute !important;
                inset: 0 !important;
                background: rgba(0,0,0,.82) !important;
                backdrop-filter: blur(14px) !important;
                -webkit-backdrop-filter: blur(14px) !important;
            }

            .creator-password-card {
                position: relative !important;
                z-index: 2 !important;
                width: min(460px, 94vw) !important;
                padding: 38px !important;
                border-radius: 22px !important;
                background: var(--card-bg, #ffffff) !important;
                color: var(--text-color, #222222) !important;
                border: 1px solid var(--border-color, #e2e8f0) !important;
                box-shadow: 0 35px 100px rgba(0,0,0,.5) !important;
                transform: translateY(30px) scale(.96) !important;
                opacity: 0 !important;
                transition:
                    transform .45s cubic-bezier(.2,.8,.2,1),
                    opacity .35s ease !important;
            }

            #creatorPasswordScreen.creator-password-visible .creator-password-card {
                transform: translateY(0) scale(1) !important;
                opacity: 1 !important;
            }

            .creator-password-icon {
                width: 58px !important;
                height: 58px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 16px !important;
                background: rgba(0,123,255,.1) !important;
                font-size: 28px !important;
                margin-bottom: 18px !important;
            }

            .creator-password-badge {
                display: inline-block !important;
                padding: 5px 9px !important;
                border-radius: 6px !important;
                background: #007bff !important;
                color: #ffffff !important;
                font-size: 9px !important;
                font-weight: 800 !important;
                letter-spacing: 1.5px !important;
                margin-bottom: 12px !important;
            }

            .creator-password-card h1 {
                margin: 0 0 10px 0 !important;
                font-size: 30px !important;
                color: var(--heading-color, #222222) !important;
            }

            .creator-password-subtitle {
                margin: 0 0 28px 0 !important;
                color: var(--card-text, #666666) !important;
                line-height: 1.6 !important;
                font-size: 14px !important;
            }

            .creator-password-field {
                margin-bottom: 14px !important;
            }

            .creator-password-field label {
                display: block !important;
                margin-bottom: 8px !important;
                font-size: 13px !important;
                font-weight: 700 !important;
                color: var(--heading-color, #222222) !important;
            }

            #creatorEmailInput,
            #creatorPasswordInput {
                width: 100% !important;
                height: 50px !important;
                padding: 0 15px !important;
                border: 1px solid var(--border-color, #e2e8f0) !important;
                border-radius: 10px !important;
                background: var(--bg-color, #f8f9fa) !important;
                color: var(--text-color, #222222) !important;
                outline: none !important;
                font-family: inherit !important;
                font-size: 15px !important;
                box-sizing: border-box !important;
            }

            #creatorPasswordInput {
                padding-right: 52px !important;
            }

            #creatorEmailInput:focus,
            #creatorPasswordInput:focus {
                border-color: #007bff !important;
                box-shadow: 0 0 0 3px rgba(0,123,255,.12) !important;
            }

            .creator-password-input-wrapper {
                position: relative !important;
                width: 100% !important;
            }

            #creatorPasswordToggle {
                position: absolute !important;
                right: 7px !important;
                top: 7px !important;
                width: 36px !important;
                height: 36px !important;
                border: none !important;
                background: transparent !important;
                border-radius: 7px !important;
                cursor: pointer !important;
                font-size: 16px !important;
            }

            #creatorPasswordToggle:hover {
                background: rgba(127,127,127,.12) !important;
            }

            .creator-password-error {
                min-height: 21px !important;
                color: #dc3545 !important;
                font-size: 12px !important;
                margin: 5px 0 10px 0 !important;
            }

            .creator-password-actions {
                display: flex !important;
                gap: 10px !important;
                margin-top: 15px !important;
            }

            .creator-password-actions button {
                flex: 1 !important;
                min-height: 45px !important;
                border-radius: 9px !important;
                cursor: pointer !important;
                font-family: inherit !important;
                font-weight: 700 !important;
                font-size: 13px !important;
            }

            .creator-password-cancel {
                border: 1px solid var(--border-color, #e2e8f0) !important;
                background: transparent !important;
                color: var(--text-color, #222222) !important;
            }

            .creator-password-submit {
                border: none !important;
                background: #007bff !important;
                color: white !important;
            }

            .creator-password-submit:disabled {
                opacity: .6 !important;
                cursor: wait !important;
            }

            .creator-password-footer {
                text-align: center !important;
                margin-top: 24px !important;
                padding-top: 18px !important;
                border-top: 1px solid var(--border-color, #e2e8f0) !important;
                color: #888 !important;
                font-size: 10px !important;
            }

            .creator-password-shake {
                animation: creatorPasswordShake .45s ease !important;
            }

            @keyframes creatorPasswordShake {
                0%,100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-6px); }
                80% { transform: translateX(6px); }
            }

            #easterEggGame {
                position: fixed !important;
                inset: 0 !important;
                z-index: 2147483647 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 20px !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                transition:
                    opacity .35s ease,
                    visibility .35s ease !important;
            }

            #easterEggGame.easter-game-visible {
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
            }

            .easter-game-backdrop {
                position: absolute !important;
                inset: 0 !important;
                background: rgba(0,0,0,.88) !important;
                backdrop-filter: blur(12px) !important;
            }

            .easter-game-card {
                position: relative !important;
                z-index: 2 !important;
                width: min(590px, 96vw) !important;
                padding: 30px !important;
                border-radius: 20px !important;
                background: #171717 !important;
                color: white !important;
                border: 1px solid #333 !important;
                box-shadow: 0 40px 120px rgba(0,0,0,.65) !important;
            }

            .easter-game-close {
                position: absolute !important;
                top: 15px !important;
                right: 15px !important;
                width: 34px !important;
                height: 34px !important;
                border: 1px solid #444 !important;
                border-radius: 8px !important;
                background: #222 !important;
                color: white !important;
                cursor: pointer !important;
            }

            .easter-game-badge {
                display: inline-block !important;
                padding: 5px 9px !important;
                border-radius: 6px !important;
                background: #007bff !important;
                font-size: 9px !important;
                font-weight: 800 !important;
                letter-spacing: 1px !important;
                margin-bottom: 12px !important;
            }

            .easter-game-card h1 {
                margin: 0 0 8px 0 !important;
                color: white !important;
            }

            .easter-game-card p {
                color: #aaa !important;
            }

            .easter-game-stats {
                display: flex !important;
                justify-content: space-between !important;
                margin-bottom: 12px !important;
                color: #aaa !important;
            }

            .easter-game-stats strong {
                color: white !important;
            }

            #easterCanvas {
                display: block !important;
                width: 100% !important;
                max-width: 500px !important;
                height: auto !important;
                margin: 0 auto !important;
                border-radius: 10px !important;
                border: 1px solid #333 !important;
                background: #0b0b0b !important;
            }

            .easter-start-button {
                width: 100% !important;
                margin-top: 15px !important;
                min-height: 45px !important;
                border: none !important;
                border-radius: 9px !important;
                background: #007bff !important;
                color: white !important;
                font-weight: 700 !important;
                cursor: pointer !important;
            }

            .easter-game-help {
                text-align: center !important;
                margin-top: 12px !important;
                color: #777 !important;
                font-size: 11px !important;
            }
        `;

        document.head.appendChild(style);
    }

    function getOrCreateCreatorButton() {
        let button =
            get("creatorModeButton");

        if (button) {
            return button;
        }

        button =
            document.createElement("button");

        button.id =
            "creatorModeButton";

        button.type =
            "button";

        button.textContent =
            "⚙️ Creator Mode";

        document.body.appendChild(
            button
        );

        return button;
    }

    function createPasswordScreen() {
        if (get("creatorPasswordScreen")) {
            return;
        }

        passwordScreen =
            document.createElement("div");

        passwordScreen.id =
            "creatorPasswordScreen";

        passwordScreen.innerHTML = `
            <div class="creator-password-backdrop"></div>

            <div class="creator-password-card">

                <div class="creator-password-icon">
                    🔐
                </div>

                <div class="creator-password-badge">
                    CREATOR ACCESS
                </div>

                <h1>
                    Welcome Back
                </h1>

                <p class="creator-password-subtitle">
                    Sign in to access your portfolio dashboard.
                </p>

                <div class="creator-password-field">

                    <label for="creatorEmailInput">
                        Email
                    </label>

                    <input
                        id="creatorEmailInput"
                        type="email"
                        placeholder="your@email.com"
                        autocomplete="username"
                    >

                </div>

                <div class="creator-password-field">

                    <label for="creatorPasswordInput">
                        Password
                    </label>

                    <div class="creator-password-input-wrapper">

                        <input
                            id="creatorPasswordInput"
                            type="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                        >

                        <button
                            id="creatorPasswordToggle"
                            type="button"
                        >
                            👁
                        </button>

                    </div>

                </div>

                <div
                    id="creatorPasswordError"
                    class="creator-password-error"
                ></div>

                <div class="creator-password-actions">

                    <button
                        id="creatorPasswordCancel"
                        type="button"
                        class="creator-password-cancel"
                    >
                        Cancel
                    </button>

                    <button
                        id="creatorPasswordSubmit"
                        type="button"
                        class="creator-password-submit"
                    >
                        Unlock
                    </button>

                </div>

                <div class="creator-password-footer">
                    Emanuel Negussie • Portfolio
                </div>

            </div>
        `;

        document.body.appendChild(
            passwordScreen
        );

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                passwordScreen.classList.add(
                    "creator-password-visible"
                );
            });
        });

        const emailInput =
            get("creatorEmailInput");

        const passwordInput =
            get("creatorPasswordInput");

        const submit =
            get("creatorPasswordSubmit");

        const cancel =
            get("creatorPasswordCancel");

        const toggle =
            get("creatorPasswordToggle");

        setTimeout(() => {
            emailInput.focus();
        }, 300);

        async function login() {
            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            const error =
                get("creatorPasswordError");

            if (!email || !password) {
                error.textContent =
                    "Enter your email and password.";

                shake(passwordInput);

                return;
            }

            if (
                password ===
                EASTER_EGG_PASSWORD
            ) {
                closePasswordScreen(
                    launchGame
                );

                return;
            }

            const client =
                getSupabase();

            if (!client) {
                error.textContent =
                    "Authentication system is unavailable.";

                console.error(
                    "Supabase client is missing."
                );

                return;
            }

            submit.disabled =
                true;

            error.textContent =
                "Signing in...";

            try {
                const {
                    data,
                    error: loginError
                } =
                    await client.auth.signInWithPassword({
                        email,
                        password
                    });

                if (loginError) {
                    console.error(
                        "Creator login failed:",
                        loginError
                    );

                    error.textContent =
                        loginError.message ||
                        "Incorrect email or password.";

                    passwordInput.value =
                        "";

                    shake(passwordInput);

                    return;
                }

                if (
                    !data ||
                    !data.session
                ) {
                    error.textContent =
                        "Login could not be completed.";

                    return;
                }

                closePasswordScreen(
                    openDashboard
                );

            } catch (errorObject) {
                console.error(
                    "Authentication error:",
                    errorObject
                );

                error.textContent =
                    "Could not connect to authentication.";

            } finally {
                submit.disabled =
                    false;
            }
        }

        submit.addEventListener(
            "click",
            login
        );

        emailInput.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    login();
                }

                if (event.key === "Escape") {
                    closePasswordScreen();
                }
            }
        );

        passwordInput.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    login();
                }

                if (event.key === "Escape") {
                    closePasswordScreen();
                }
            }
        );

        cancel.addEventListener(
            "click",
            closePasswordScreen
        );

        toggle.addEventListener(
            "click",
            () => {
                if (
                    passwordInput.type ===
                    "password"
                ) {
                    passwordInput.type =
                        "text";

                    toggle.textContent =
                        "🙈";
                } else {
                    passwordInput.type =
                        "password";

                    toggle.textContent =
                        "👁";
                }

                passwordInput.focus();
            }
        );
    }

    function shake(element) {
        if (!element) {
            return;
        }

        element.classList.remove(
            "creator-password-shake"
        );

        void element.offsetWidth;

        element.classList.add(
            "creator-password-shake"
        );

        setTimeout(() => {
            element.classList.remove(
                "creator-password-shake"
            );
        }, 500);
    }

    function closePasswordScreen(callback) {
        const screen =
            get("creatorPasswordScreen");

        if (!screen) {
            if (callback) {
                callback();
            }

            return;
        }

        screen.classList.add(
            "creator-password-closing"
        );

        setTimeout(() => {
            screen.remove();

            if (callback) {
                callback();
            }
        }, 350);
    }

    async function openDashboard() {
        const overlay =
            get("creatorOverlay");

        if (!overlay) {
            alert(
                "Creator dashboard could not be found."
            );

            return;
        }

        overlay.classList.add(
            "visible"
        );

        document.body.style.overflow =
            "hidden";

        updateDashboard();

        await Promise.allSettled([
            updateVisitorStats(),
            updateVisitorMap(),
            updateSiteStatus(),
            renderCreatorTimeline()
        ]);

        startVisitorStatsPolling();
        startVisitorLocationPolling();
        startSiteStatusPolling();

        setTimeout(() => {
            if (visitorMap) {
                visitorMap.invalidateSize();
            }
        }, 200);
    }

    function closeDashboard() {
        stopVisitorStatsPolling();
        stopVisitorLocationPolling();
        stopSiteStatusPolling();

        const overlay =
            get("creatorOverlay");

        if (!overlay) {
            return;
        }

        overlay.classList.remove(
            "visible"
        );

        document.body.style.overflow =
            "";
    }

    async function updateSiteStatus() {
        const website =
            get("siteStatusWebsite");

        if (!website) {
            return;
        }

        const api =
            get("siteStatusAPI");

        const database =
            get("siteStatusDatabase");

        const analytics =
            get("siteStatusAnalytics");

        const lastChecked =
            get("siteStatusLastChecked");

        setStatus(
            website,
            "Checking...",
            "status-checking"
        );

        setStatus(
            api,
            "Checking...",
            "status-checking"
        );

        setStatus(
            database,
            "Checking...",
            "status-checking"
        );

        setStatus(
            analytics,
            "Checking...",
            "status-checking"
        );

        try {
            const response =
                await fetch(
                    "/api/site-status",
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            if (!data.success) {
                throw new Error(
                    data.error ||
                    "Status unavailable"
                );
            }

            setStatus(
                website,
                data.website ||
                "Unknown",
                data.website === "Online"
                    ? "status-good"
                    : "status-bad"
            );

            setStatus(
                api,
                data.visitorApi ||
                "Unknown",
                data.visitorApi === "Operational"
                    ? "status-good"
                    : "status-bad"
            );

            setStatus(
                database,
                data.database ||
                "Unknown",
                data.database === "Connected"
                    ? "status-good"
                    : "status-bad"
            );

            setStatus(
                analytics,
                data.analytics ||
                "Unknown",
                data.analytics === "Tracking"
                    ? "status-good"
                    : "status-bad"
            );

            if (lastChecked) {
                lastChecked.textContent =
                    "Last checked " +
                    new Date().toLocaleTimeString(
                        "en-US",
                        {
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit"
                        }
                    );
            }

        } catch (error) {
            console.error(
                "Site status check failed:",
                error
            );

            setStatus(
                website,
                "Offline",
                "status-bad"
            );

            setStatus(
                api,
                "Unavailable",
                "status-bad"
            );

            setStatus(
                database,
                "Unavailable",
                "status-bad"
            );

            setStatus(
                analytics,
                "Unavailable",
                "status-bad"
            );

            if (lastChecked) {
                lastChecked.textContent =
                    "Status check failed";
            }
        }
    }

    function setStatus(
        element,
        text,
        className
    ) {
        if (!element) {
            return;
        }

        element.textContent =
            text;

        element.classList.remove(
            "status-good",
            "status-bad",
            "status-checking"
        );

        element.classList.add(
            className
        );
    }

    function startSiteStatusPolling() {
        stopSiteStatusPolling();

        siteStatusTimer =
            setInterval(
                updateSiteStatus,
                30000
            );
    }

    function stopSiteStatusPolling() {
        if (siteStatusTimer) {
            clearInterval(
                siteStatusTimer
            );

            siteStatusTimer =
                null;
        }
    }

    async function updateVisitorStats() {
        const onlineElement =
            get("onlineVisitorCount");

        const totalElement =
            get("totalVisitorCount");

        if (
            !onlineElement &&
            !totalElement
        ) {
            return;
        }

        try {
            const response =
                await fetch(
                    "/api/visitor-stats",
                    {
                        method: "GET",
                        cache: "no-store"
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
                !data ||
                data.success !== true
            ) {
                throw new Error(
                    data?.error ||
                    "Visitor statistics unavailable"
                );
            }

            const online =
                Number(
                    data.onlineVisitors
                );

            const total =
                Number(
                    data.totalVisitors
                );

            if (onlineElement) {
                onlineElement.textContent =
                    Number.isFinite(
                        online
                    )
                        ? online
                        : "0";
            }

            if (totalElement) {
                totalElement.textContent =
                    Number.isFinite(
                        total
                    )
                        ? total
                        : "0";
            }

            const lastUpdated =
                get(
                    "visitorLastUpdated"
                );

            if (lastUpdated) {
                lastUpdated.textContent =
                    "Updated " +
                    new Date().toLocaleTimeString(
                        "en-US",
                        {
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit"
                        }
                    );
            }

        } catch (error) {
            console.error(
                "Could not load visitor statistics:",
                error
            );

            if (onlineElement) {
                onlineElement.textContent =
                    "—";
            }

            if (totalElement) {
                totalElement.textContent =
                    "—";
            }
        }
    }

    function startVisitorStatsPolling() {
        stopVisitorStatsPolling();

        visitorStatsTimer =
            setInterval(
                updateVisitorStats,
                15000
            );
    }

    function stopVisitorStatsPolling() {
        if (visitorStatsTimer) {
            clearInterval(
                visitorStatsTimer
            );

            visitorStatsTimer =
                null;
        }
    }

    async function updateVisitorMap() {
        const mapElement =
            get("visitorMap");

        const mapCount =
            get("visitorMapCount");

        if (!mapElement) {
            return;
        }

        if (
            typeof L ===
            "undefined"
        ) {
            console.error(
                "Leaflet is not loaded."
            );

            return;
        }

        if (!visitorMap) {
            visitorMap =
                L.map(
                    "visitorMap",
                    {
                        worldCopyJump: true,
                        minZoom: 2,
                        maxZoom: 6
                    }
                );

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        "&copy; OpenStreetMap contributors"
                }
            ).addTo(
                visitorMap
            );

            visitorMap.setView(
                [20, 0],
                2
            );
        }

        try {
            const response =
                await fetch(
                    "/api/visitor-locations",
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Location API returned HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            if (
                !data ||
                data.success !== true
            ) {
                throw new Error(
                    data?.error ||
                    "Location data unavailable"
                );
            }

            visitorMarkers.forEach(
                marker => {
                    visitorMap.removeLayer(
                        marker
                    );
                }
            );

            visitorMarkers =
                [];

            const locations =
                Array.isArray(
                    data.locations
                )
                    ? data.locations
                    : [];

            locations.forEach(
                location => {
                    const latitude =
                        Number(
                            location.latitude
                        );

                    const longitude =
                        Number(
                            location.longitude
                        );

                    if (
                        !Number.isFinite(
                            latitude
                        ) ||
                        !Number.isFinite(
                            longitude
                        )
                    ) {
                        return;
                    }

                    const marker =
                        L.circleMarker(
                            [
                                latitude,
                                longitude
                            ],
                            {
                                radius: 7,
                                fillColor:
                                    "#007bff",
                                color:
                                    "#ffffff",
                                weight: 2,
                                opacity: 1,
                                fillOpacity:
                                    0.85
                            }
                        );

                    const parts = [
                        location.city,
                        location.region,
                        location.country
                    ].filter(Boolean);

                    const label =
                        parts.length
                            ? parts.join(", ")
                            : "Approximate location";

                    marker.bindPopup(
                        `
                            <strong>
                                Visitor
                            </strong>
                            <br>
                            ${escape(label)}
                        `
                    );

                    marker.addTo(
                        visitorMap
                    );

                    visitorMarkers.push(
                        marker
                    );
                }
            );

            if (mapCount) {
                mapCount.textContent =
                    locations.length === 1
                        ? "1 location"
                        : `${locations.length} locations`;
            }

            setTimeout(() => {
                if (visitorMap) {
                    visitorMap.invalidateSize();
                }
            }, 100);

        } catch (error) {
            console.error(
                "Could not load visitor map:",
                error
            );

            if (mapCount) {
                mapCount.textContent =
                    "Unavailable";
            }
        }
    }

    function startVisitorLocationPolling() {
        stopVisitorLocationPolling();

        visitorLocationTimer =
            setInterval(
                updateVisitorMap,
                15000
            );
    }

    function stopVisitorLocationPolling() {
        if (visitorLocationTimer) {
            clearInterval(
                visitorLocationTimer
            );

            visitorLocationTimer =
                null;
        }
    }

    function getProjects() {
        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {
            const defaults = [
                {
                    id:
                        "website-development",
                    name:
                        "Website Development",
                    description:
                        "Instead of using a web service, I actually made this website with JavaScript with the help of AI. Since joining the AllStarCode* Program, I have learned to code with JavaScript.",
                    tech:
                        "HTML, CSS, JavaScript",
                    github: "",
                    live: "",
                    active: true
                },
                {
                    id:
                        "cookbook",
                    name:
                        "Cookbook",
                    description:
                        "Since my oldest sister came back from the State of Alaska and made her own cookbook, I have learned how to cook and make my own recipes from inspiration from YouTubers and my own sister.",
                    tech:
                        "Cooking, Recipe Development",
                    github: "",
                    live: "",
                    active: true
                }
            ];

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    defaults
                )
            );

            return defaults;
        }

        try {
            const parsed =
                JSON.parse(saved);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch {
            return [];
        }
    }

    function saveProjects(projects) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                projects
            )
        );
    }

    function updateDashboard() {
        const projects =
            getProjects();

        const active =
            projects.filter(
                project =>
                    project.active ===
                    true
            );

        const count =
            get("projectCount");

        const activeCount =
            get("activeProjectCount");

        if (count) {
            count.textContent =
                projects.length;
        }

        if (activeCount) {
            activeCount.textContent =
                active.length;
        }

        renderProjects();
    }

    function renderProjects() {
        const container =
            get("creatorProjects");

        if (!container) {
            return;
        }

        const projects =
            getProjects();

        container.innerHTML =
            "";

        if (!projects.length) {
            container.innerHTML = `
                <div class="empty-projects">
                    <span>📁</span>
                    <h3>No Projects</h3>
                    <p>
                        Add your first project.
                    </p>
                </div>
            `;

            return;
        }

        projects.forEach(
            project => {
                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "creator-project-card";

                card.innerHTML = `
                    <div class="creator-project-info">

                        <div class="creator-project-title">

                            <h3>
                                ${escape(project.name)}
                            </h3>

                            ${
                                project.active
                                    ? `<span class="active-badge">ACTIVE</span>`
                                    : `<span class="active-badge" style="background:#777">INACTIVE</span>`
                            }

                        </div>

                        <p>
                            ${escape(project.description)}
                        </p>

                        ${
                            project.tech
                                ? `<small>🛠️ ${escape(project.tech)}</small>`
                                : ""
                        }

                    </div>

                    <div class="creator-project-actions">

                        <button
                            type="button"
                            data-edit="${escape(project.id)}"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            type="button"
                            data-toggle="${escape(project.id)}"
                        >
                            ${
                                project.active
                                    ? "⏸ Disable"
                                    : "▶ Activate"
                            }
                        </button>

                        <button
                            type="button"
                            data-delete="${escape(project.id)}"
                        >
                            🗑️ Delete
                        </button>

                    </div>
                `;

                container.appendChild(
                    card
                );
            }
        );

        container
            .querySelectorAll(
                "[data-edit]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            editProject(
                                button.dataset.edit
                            );
                        }
                    );
                }
            );

        container
            .querySelectorAll(
                "[data-toggle]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            toggleProject(
                                button.dataset.toggle
                            );
                        }
                    );
                }
            );

        container
            .querySelectorAll(
                "[data-delete]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            deleteProject(
                                button.dataset.delete
                            );
                        }
                    );
                }
            );
    }

    function editProject(id) {
        const project =
            getProjects().find(
                item =>
                    item.id ===
                    id
            );

        if (!project) {
            return;
        }

        const editor =
            get("projectEditor");

        if (!editor) {
            return;
        }

        get("editorTitle").textContent =
            "Edit Project";

        get("projectId").value =
            project.id;

        get("projectName").value =
            project.name || "";

        get("projectDescription").value =
            project.description || "";

        get("projectTech").value =
            project.tech || "";

        get("projectGithub").value =
            project.github || "";

        get("projectLive").value =
            project.live || "";

        get("projectActive").checked =
            project.active === true;

        editor.classList.add(
            "visible"
        );

        setTimeout(() => {
            get("projectName").focus();
        }, 100);
    }

    function addProject() {
        const editor =
            get("projectEditor");

        const form =
            get("projectForm");

        if (!editor || !form) {
            return;
        }

        form.reset();

        get("projectId").value =
            "";

        get("editorTitle").textContent =
            "Add Project";

        editor.classList.add(
            "visible"
        );

        setTimeout(() => {
            get("projectName").focus();
        }, 100);
    }

    function closeEditor() {
        const editor =
            get("projectEditor");

        if (!editor) {
            return;
        }

        editor.classList.remove(
            "visible"
        );

        const form =
            get("projectForm");

        if (form) {
            form.reset();
        }

        get("projectId").value =
            "";
    }

    function saveProject(event) {
        event.preventDefault();

        const name =
            get("projectName")
                .value
                .trim();

        const description =
            get("projectDescription")
                .value
                .trim();

        const tech =
            get("projectTech")
                .value
                .trim();

        const github =
            get("projectGithub")
                .value
                .trim();

        const live =
            get("projectLive")
                .value
                .trim();

        const active =
            get("projectActive")
                .checked;

        if (!name || !description) {
            alert(
                "Please fill in the project name and description."
            );

            return;
        }

        const projects =
            getProjects();

        const existingId =
            get("projectId")
                .value;

        if (existingId) {
            const index =
                projects.findIndex(
                    project =>
                        project.id ===
                        existingId
                );

            if (index !== -1) {
                projects[index] = {
                    ...projects[index],
                    name,
                    description,
                    tech,
                    github,
                    live,
                    active
                };
            }
        } else {
            let id =
                name
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]+/g,
                        "-"
                    );

            const originalId =
                id;

            let number =
                1;

            while (
                projects.some(
                    project =>
                        project.id ===
                        id
                )
            ) {
                id =
                    originalId +
                    "-" +
                    number;

                number++;
            }

            projects.push({
                id,
                name,
                description,
                tech,
                github,
                live,
                active
            });
        }

        saveProjects(
            projects
        );

        closeEditor();
        updateDashboard();
    }

    function deleteProject(id) {
        const projects =
            getProjects();

        const project =
            projects.find(
                item =>
                    item.id ===
                    id
            );

        if (!project) {
            return;
        }

        if (
            !window.confirm(
                `Remove "${project.name}"?`
            )
        ) {
            return;
        }

        saveProjects(
            projects.filter(
                item =>
                    item.id !==
                    id
            )
        );

        updateDashboard();
    }

    function toggleProject(id) {
        const projects =
            getProjects();

        const project =
            projects.find(
                item =>
                    item.id ===
                    id
            );

        if (!project) {
            return;
        }

        project.active =
            !project.active;

        saveProjects(
            projects
        );

        updateDashboard();
    }

    async function loadTimeline() {
        const client =
            getSupabase();

        if (!client) {
            timelineData =
                [];

            return [];
        }

        try {
            const {
                data,
                error
            } =
                await client
                    .from(
                        TIMELINE_TABLE
                    )
                    .select("*")
                    .order(
                        "position",
                        {
                            ascending:
                                true
                        }
                    );

            if (error) {
                throw error;
            }

            timelineData =
                Array.isArray(data)
                    ? data
                    : [];

            return timelineData;

        } catch (error) {
            console.error(
                "Could not load timeline:",
                error
            );

            timelineData =
                [];

            return [];
        }
    }

    async function renderCreatorTimeline() {
        const container =
            get("creatorTimeline");

        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="empty-projects">
                <span>🗓️</span>
                <h3>Loading Timeline</h3>
                <p>
                    Loading shared timeline data...
                </p>
            </div>
        `;

        const timeline =
            await loadTimeline();

        container.innerHTML =
            "";

        if (!timeline.length) {
            container.innerHTML = `
                <div class="empty-projects">
                    <span>🗓️</span>
                    <h3>No Milestones</h3>
                    <p>
                        Add your first timeline milestone.
                    </p>
                </div>
            `;

            return;
        }

        timeline.forEach(
            (
                item,
                index
            ) => {
                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "creator-timeline-card";

                card.innerHTML = `
                    <div class="creator-timeline-info">

                        <div class="creator-timeline-top">

                            <span class="creator-timeline-year">
                                ${escape(item.year)}
                            </span>

                            ${
                                item.active
                                    ? `<span class="active-badge">PUBLISHED</span>`
                                    : `<span class="timeline-hidden-badge">HIDDEN</span>`
                            }

                            <span class="timeline-position-badge">
                                ${
                                    item.side ===
                                    "right"
                                        ? "RIGHT"
                                        : "LEFT"
                                }
                            </span>

                        </div>

                        <h3>
                            ${escape(item.title)}
                        </h3>

                        <p>
                            ${escape(item.description)}
                        </p>

                        <div class="creator-timeline-meta">
                            Position
                            ${index + 1}
                            of
                            ${timeline.length}
                        </div>

                    </div>

                    <div class="creator-timeline-actions">

                        <button
                            type="button"
                            data-up="${item.id}"
                        >
                            ↑
                        </button>

                        <button
                            type="button"
                            data-down="${item.id}"
                        >
                            ↓
                        </button>

                        <button
                            type="button"
                            data-edit-timeline="${item.id}"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            data-toggle-timeline="${item.id}"
                        >
                            ${
                                item.active
                                    ? "Hide"
                                    : "Publish"
                            }
                        </button>

                        <button
                            type="button"
                            data-delete-timeline="${item.id}"
                        >
                            🗑️
                        </button>

                    </div>
                `;

                container.appendChild(
                    card
                );
            }
        );

        container
            .querySelectorAll(
                "[data-up]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            moveTimelineItem(
                                Number(
                                    button.dataset.up
                                ),
                                -1
                            );
                        }
                    );
                }
            );

        container
            .querySelectorAll(
                "[data-down]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            moveTimelineItem(
                                Number(
                                    button.dataset.down
                                ),
                                1
                            );
                        }
                    );
                }
            );

        container
            .querySelectorAll(
                "[data-edit-timeline]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            openEditTimeline(
                                Number(
                                    button.dataset.editTimeline
                                )
                            );
                        }
                    );
                }
            );

        container
            .querySelectorAll(
                "[data-toggle-timeline]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            toggleTimelineItem(
                                Number(
                                    button.dataset.toggleTimeline
                                )
                            );
                        }
                    );
                }
            );

        container
            .querySelectorAll(
                "[data-delete-timeline]"
            )
            .forEach(
                button => {
                    button.addEventListener(
                        "click",
                        () => {
                            deleteTimeline(
                                Number(
                                    button.dataset.deleteTimeline
                                )
                            );
                        }
                    );
                }
            );
    }

    function openAddTimeline() {
        const editor =
            get("timelineEditor");

        const form =
            get("timelineForm");

        if (!editor || !form) {
            return;
        }

        form.reset();

        get("timelineId").value =
            "";

        get("timelineEditorTitle").textContent =
            "Add Milestone";

        get("timelineSide").value =
            "left";

        get("timelineActive").value =
            "true";

        editor.classList.add(
            "visible"
        );

        setTimeout(() => {
            get("timelineYear").focus();
        }, 100);
    }

    function openEditTimeline(id) {
        const item =
            timelineData.find(
                milestone =>
                    Number(
                        milestone.id
                    ) ===
                    Number(id)
            );

        if (!item) {
            return;
        }

        const editor =
            get("timelineEditor");

        if (!editor) {
            return;
        }

        get("timelineEditorTitle").textContent =
            "Edit Milestone";

        get("timelineId").value =
            item.id;

        get("timelineYear").value =
            item.year || "";

        get("timelineTitle").value =
            item.title || "";

        get("timelineDescription").value =
            item.description || "";

        get("timelineDetails").value =
            item.details || "";

        get("timelineSide").value =
            item.side || "left";

        get("timelineActive").value =
            item.active
                ? "true"
                : "false";

        editor.classList.add(
            "visible"
        );

        setTimeout(() => {
            get("timelineYear").focus();
        }, 100);
    }

    function closeTimelineEditor() {
        const editor =
            get("timelineEditor");

        if (!editor) {
            return;
        }

        editor.classList.remove(
            "visible"
        );

        const form =
            get("timelineForm");

        if (form) {
            form.reset();
        }

        get("timelineId").value =
            "";
    }

    async function saveTimelineItem(event) {
        event.preventDefault();

        const client =
            getSupabase();

        if (!client) {
            alert(
                "Supabase is not available."
            );

            return;
        }

        const year =
            get("timelineYear")
                .value
                .trim();

        const title =
            get("timelineTitle")
                .value
                .trim();

        const description =
            get("timelineDescription")
                .value
                .trim();

        const details =
            get("timelineDetails")
                .value
                .trim();

        const side =
            get("timelineSide")
                .value;

        const active =
            get("timelineActive")
                .value ===
            "true";

        const existingId =
            get("timelineId")
                .value;

        if (
            !year ||
            !title ||
            !description ||
            !details
        ) {
            alert(
                "Please fill in all timeline fields."
            );

            return;
        }

        const submitButton =
            get("timelineForm")
                .querySelector(
                    'button[type="submit"]'
                );

        if (submitButton) {
            submitButton.disabled =
                true;

            submitButton.textContent =
                "Saving...";
        }

        try {
            if (existingId) {

                const {
                    error
                } =
                    await client
                        .from(
                            TIMELINE_TABLE
                        )
                        .update({
                            year,
                            title,
                            description,
                            details,
                            side,
                            active,
                            updated_at:
                                new Date().toISOString()
                        })
                        .eq(
                            "id",
                            Number(
                                existingId
                            )
                        );

                if (error) {
                    throw error;
                }

            } else {

                const currentTimeline =
                    await loadTimeline();

                const highestPosition =
                    currentTimeline.reduce(
                        (
                            highest,
                            item
                        ) => {
                            return Math.max(
                                highest,
                                Number(
                                    item.position
                                ) || 0
                            );
                        },
                        0
                    );

                const {
                    error
                } =
                    await client
                        .from(
                            TIMELINE_TABLE
                        )
                        .insert({
                            year,
                            title,
                            description,
                            details,
                            side,
                            active,
                            position:
                                highestPosition +
                                1
                        });

                if (error) {
                    throw error;
                }
            }

            closeTimelineEditor();

            await renderCreatorTimeline();

        } catch (error) {
            console.error(
                "Could not save timeline item:",
                error
            );

            alert(
                error.message ||
                "Could not save timeline milestone."
            );

        } finally {
            if (submitButton) {
                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Save Milestone";
            }
        }
    }

    async function deleteTimeline(id) {
        const client =
            getSupabase();

        if (!client) {
            return;
        }

        const item =
            timelineData.find(
                milestone =>
                    Number(
                        milestone.id
                    ) ===
                    Number(id)
            );

        if (!item) {
            return;
        }

        if (
            !window.confirm(
                `Delete "${item.title}" from the timeline?`
            )
        ) {
            return;
        }

        try {
            const {
                error
            } =
                await client
                    .from(
                        TIMELINE_TABLE
                    )
                    .delete()
                    .eq(
                        "id",
                        Number(id)
                    );

            if (error) {
                throw error;
            }

            await loadTimeline();

            await normalizeTimelinePositions();

            await renderCreatorTimeline();

        } catch (error) {
            console.error(
                "Could not delete timeline item:",
                error
            );

            alert(
                error.message ||
                "Could not delete timeline milestone."
            );
        }
    }

    async function toggleTimelineItem(id) {
        const client =
            getSupabase();

        if (!client) {
            return;
        }

        const item =
            timelineData.find(
                milestone =>
                    Number(
                        milestone.id
                    ) ===
                    Number(id)
            );

        if (!item) {
            return;
        }

        try {
            const {
                error
            } =
                await client
                    .from(
                        TIMELINE_TABLE
                    )
                    .update({
                        active:
                            !item.active,
                        updated_at:
                            new Date().toISOString()
                    })
                    .eq(
                        "id",
                        Number(id)
                    );

            if (error) {
                throw error;
            }

            await renderCreatorTimeline();

        } catch (error) {
            console.error(
                "Could not update timeline status:",
                error
            );

            alert(
                error.message ||
                "Could not update timeline milestone."
            );
        }
    }

    async function moveTimelineItem(
        id,
        direction
    ) {
        const client =
            getSupabase();

        if (!client) {
            return;
        }

        const timeline =
            [...timelineData].sort(
                (a, b) =>
                    Number(a.position) -
                    Number(b.position)
            );

        const index =
            timeline.findIndex(
                item =>
                    Number(
                        item.id
                    ) ===
                    Number(id)
            );

        if (index === -1) {
            return;
        }

        const target =
            index +
            direction;

        if (
            target < 0 ||
            target >= timeline.length
        ) {
            return;
        }

        const current =
            timeline[index];

        const swap =
            timeline[target];

        const currentPosition =
            Number(
                current.position
            );

        const swapPosition =
            Number(
                swap.position
            );

        try {
            const temporaryPosition =
                -Math.abs(
                    currentPosition
                ) - 1000000;

            let result =
                await client
                    .from(
                        TIMELINE_TABLE
                    )
                    .update({
                        position:
                            temporaryPosition
                    })
                    .eq(
                        "id",
                        Number(
                            current.id
                        )
                    );

            if (result.error) {
                throw result.error;
            }

            result =
                await client
                    .from(
                        TIMELINE_TABLE
                    )
                    .update({
                        position:
                            currentPosition,
                        updated_at:
                            new Date().toISOString()
                    })
                    .eq(
                        "id",
                        Number(
                            swap.id
                        )
                    );

            if (result.error) {
                throw result.error;
            }

            result =
                await client
                    .from(
                        TIMELINE_TABLE
                    )
                    .update({
                        position:
                            swapPosition,
                        updated_at:
                            new Date().toISOString()
                    })
                    .eq(
                        "id",
                        Number(
                            current.id
                        )
                    );

            if (result.error) {
                throw result.error;
            }

            await renderCreatorTimeline();

        } catch (error) {
            console.error(
                "Could not reorder timeline:",
                error
            );

            alert(
                error.message ||
                "Could not reorder timeline."
            );

            await renderCreatorTimeline();
        }
    }

    async function normalizeTimelinePositions() {
        const client =
            getSupabase();

        if (!client) {
            return;
        }

        const timeline =
            [...timelineData].sort(
                (a, b) =>
                    Number(a.position) -
                    Number(b.position)
            );

        for (
            let index = 0;
            index < timeline.length;
            index++
        ) {
            const {
                error
            } =
                await client
                    .from(
                        TIMELINE_TABLE
                    )
                    .update({
                        position:
                            index + 1,
                        updated_at:
                            new Date().toISOString()
                    })
                    .eq(
                        "id",
                        Number(
                            timeline[index].id
                        )
                    );

            if (error) {
                console.error(
                    "Timeline position update failed:",
                    error
                );
            }
        }

        await loadTimeline();
    }

    function launchGame() {
        if (get("easterEggGame")) {
            return;
        }

        gameScreen =
            document.createElement(
                "div"
            );

        gameScreen.id =
            "easterEggGame";

        gameScreen.innerHTML = `
            <div class="easter-game-backdrop"></div>

            <div class="easter-game-card">

                <button
                    type="button"
                    class="easter-game-close"
                    id="closeEasterGame"
                >
                    ✕
                </button>

                <div class="easter-game-badge">
                    SECRET EASTER EGG
                </div>

                <h1>
                    ⚡ Code Runner
                </h1>

                <p>
                    Dodge the falling blocks.
                    How long can you survive?
                </p>

                <div class="easter-game-stats">

                    <span>
                        Score:
                        <strong id="easterScore">
                            0
                        </strong>
                    </span>

                    <span>
                        Best:
                        <strong id="easterBest">
                            0
                        </strong>
                    </span>

                </div>

                <canvas
                    id="easterCanvas"
                    width="500"
                    height="350"
                ></canvas>

                <button
                    type="button"
                    id="startEasterGame"
                    class="easter-start-button"
                >
                    Start Game
                </button>

                <div class="easter-game-help">
                    Use ← → or A / D
                </div>

            </div>
        `;

        document.body.appendChild(
            gameScreen
        );

        requestAnimationFrame(() => {
            gameScreen.classList.add(
                "easter-game-visible"
            );
        });

        const canvas =
            get("easterCanvas");

        const ctx =
            canvas.getContext(
                "2d"
            );

        const start =
            get("startEasterGame");

        const close =
            get("closeEasterGame");

        const scoreDisplay =
            get("easterScore");

        const bestDisplay =
            get("easterBest");

        let player = null;
        let blocks = [];
        let score = 0;
        let running = false;
        let frame = null;
        let keys = {};

        let best =
            Number(
                localStorage.getItem(
                    "easterBestScore"
                )
            ) || 0;

        bestDisplay.textContent =
            best;

        function drawBackground() {
            ctx.fillStyle =
                "#0b0b0b";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.strokeStyle =
                "rgba(255,255,255,.05)";

            for (
                let x = 0;
                x < canvas.width;
                x += 25
            ) {
                ctx.beginPath();
                ctx.moveTo(
                    x,
                    0
                );
                ctx.lineTo(
                    x,
                    canvas.height
                );
                ctx.stroke();
            }

            for (
                let y = 0;
                y < canvas.height;
                y += 25
            ) {
                ctx.beginPath();
                ctx.moveTo(
                    0,
                    y
                );
                ctx.lineTo(
                    canvas.width,
                    y
                );
                ctx.stroke();
            }
        }

        function startGame() {
            player = {
                x: 230,
                y: 295,
                width: 40,
                height: 40,
                speed: 6
            };

            blocks = [];
            score = 0;
            running = true;

            scoreDisplay.textContent =
                "0";

            start.textContent =
                "Restart Game";

            cancelAnimationFrame(
                frame
            );

            loop();
        }

        function spawn() {
            const size =
                20 +
                Math.random() *
                30;

            blocks.push({
                x:
                    Math.random() *
                    (
                        canvas.width -
                        size
                    ),
                y:
                    -size,
                width:
                    size,
                height:
                    size,
                speed:
                    2 +
                    Math.random() *
                    2.5
            });
        }

        function hit(a, b) {
            return (
                a.x <
                    b.x +
                    b.width &&
                a.x +
                    a.width >
                    b.x &&
                a.y <
                    b.y +
                    b.height &&
                a.y +
                    a.height >
                    b.y
            );
        }

        function updateGame() {
            if (
                keys.ArrowLeft ||
                keys.a
            ) {
                player.x -=
                    player.speed;
            }

            if (
                keys.ArrowRight ||
                keys.d
            ) {
                player.x +=
                    player.speed;
            }

            if (player.x < 0) {
                player.x = 0;
            }

            if (
                player.x +
                    player.width >
                canvas.width
            ) {
                player.x =
                    canvas.width -
                    player.width;
            }

            if (
                Math.random() <
                0.025
            ) {
                spawn();
            }

            blocks.forEach(
                block => {
                    block.y +=
                        block.speed;
                }
            );

            blocks =
                blocks.filter(
                    block =>
                        block.y <
                        canvas.height +
                        60
                );

            for (
                const block of blocks
            ) {
                if (
                    hit(
                        player,
                        block
                    )
                ) {
                    gameOver();
                    return;
                }
            }

            score++;

            scoreDisplay.textContent =
                Math.floor(
                    score /
                    10
                );
        }

        function drawGame() {
            drawBackground();

            if (!player) {
                return;
            }

            ctx.fillStyle =
                "#007bff";

            ctx.fillRect(
                player.x,
                player.y,
                player.width,
                player.height
            );

            blocks.forEach(
                block => {
                    ctx.fillStyle =
                        "#ff4d4d";

                    ctx.fillRect(
                        block.x,
                        block.y,
                        block.width,
                        block.height
                    );
                }
            );

            if (!running) {
                ctx.fillStyle =
                    "rgba(0,0,0,.72)";

                ctx.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                ctx.textAlign =
                    "center";

                ctx.fillStyle =
                    "white";

                ctx.font =
                    "bold 30px Arial";

                ctx.fillText(
                    "GAME OVER",
                    canvas.width / 2,
                    165
                );

                ctx.font =
                    "16px Arial";

                ctx.fillText(
                    `Score: ${Math.floor(
                        score / 10
                    )}`,
                    canvas.width / 2,
                    200
                );
            }
        }

        function loop() {
            if (!running) {
                drawGame();
                return;
            }

            updateGame();
            drawGame();

            frame =
                requestAnimationFrame(
                    loop
                );
        }

        function gameOver() {
            running =
                false;

            cancelAnimationFrame(
                frame
            );

            const finalScore =
                Math.floor(
                    score / 10
                );

            if (
                finalScore >
                best
            ) {
                best =
                    finalScore;

                localStorage.setItem(
                    "easterBestScore",
                    String(best)
                );

                bestDisplay.textContent =
                    best;
            }

            drawGame();
        }

        start.addEventListener(
            "click",
            startGame
        );

        close.addEventListener(
            "click",
            () => {
                running =
                    false;

                cancelAnimationFrame(
                    frame
                );

                gameScreen.classList.remove(
                    "easter-game-visible"
                );

                setTimeout(() => {
                    gameScreen.remove();
                    gameScreen = null;
                }, 350);
            }
        );

        document.addEventListener(
            "keydown",
            event => {
                if (!gameScreen) {
                    return;
                }

                keys[event.key] =
                    true;

                if (
                    event.key ===
                    "Escape"
                ) {
                    close.click();
                }
            }
        );

        document.addEventListener(
            "keyup",
            event => {
                keys[event.key] =
                    false;
            }
        );

        drawBackground();

        ctx.fillStyle =
            "white";

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 24px Arial";

        ctx.fillText(
            "READY?",
            canvas.width / 2,
            canvas.height / 2
        );
    }

    function setup() {
        createStyle();

        const creatorButton =
            getOrCreateCreatorButton();

        creatorButton.replaceWith(
            creatorButton.cloneNode(true)
        );

        const freshCreatorButton =
            get("creatorModeButton");

        freshCreatorButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();
                createPasswordScreen();
            }
        );

        const closeCreator =
            get("closeCreator");

        if (closeCreator) {
            closeCreator.addEventListener(
                "click",
                closeDashboard
            );
        }

        const exitCreator =
            get("exitCreator");

        if (exitCreator) {
            exitCreator.addEventListener(
                "click",
                closeDashboard
            );
        }

        const addProjectButton =
            get("addProjectButton");

        if (addProjectButton) {
            addProjectButton.addEventListener(
                "click",
                addProject
            );
        }

        const closeEditor =
            get("closeEditor");

        if (closeEditor) {
            closeEditor.addEventListener(
                "click",
                closeEditorWindow
            );
        }

        const cancelEditor =
            get("cancelEditor");

        if (cancelEditor) {
            cancelEditor.addEventListener(
                "click",
                closeEditorWindow
            );
        }

        const projectForm =
            get("projectForm");

        if (projectForm) {
            projectForm.addEventListener(
                "submit",
                saveProject
            );
        }

        const addTimelineButton =
            get("addTimelineButton");

        if (addTimelineButton) {
            addTimelineButton.addEventListener(
                "click",
                openAddTimeline
            );
        }

        const closeTimelineButton =
            get("closeTimelineEditor");

        if (closeTimelineButton) {
            closeTimelineButton.addEventListener(
                "click",
                closeTimelineEditor
            );
        }

        const cancelTimeline =
            get("cancelTimelineEditor");

        if (cancelTimeline) {
            cancelTimeline.addEventListener(
                "click",
                closeTimelineEditor
            );
        }

        const timelineForm =
            get("timelineForm");

        if (timelineForm) {
            timelineForm.addEventListener(
                "submit",
                saveTimelineItem
            );
        }

        const overlay =
            get("creatorOverlay");

        if (overlay) {
            overlay.addEventListener(
                "click",
                event => {
                    if (
                        event.target ===
                        overlay
                    ) {
                        closeDashboard();
                    }
                }
            );
        }

        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }

                const password =
                    get(
                        "creatorPasswordScreen"
                    );

                if (password) {
                    closePasswordScreen();
                    return;
                }

                const timelineEditor =
                    get(
                        "timelineEditor"
                    );

                if (
                    timelineEditor &&
                    timelineEditor.classList.contains(
                        "visible"
                    )
                ) {
                    closeTimelineEditor();
                    return;
                }

                const projectEditor =
                    get(
                        "projectEditor"
                    );

                if (
                    projectEditor &&
                    projectEditor.classList.contains(
                        "visible"
                    )
                ) {
                    closeEditorWindow();
                    return;
                }

                const creator =
                    get(
                        "creatorOverlay"
                    );

                if (
                    creator &&
                    creator.classList.contains(
                        "visible"
                    )
                ) {
                    closeDashboard();
                }
            }
        );

        updateDashboard();

        console.log(
            "Creator system ready."
        );
    }

    function closeEditorWindow() {
        const editor =
            get("projectEditor");

        if (!editor) {
            return;
        }

        editor.classList.remove(
            "visible"
        );

        const form =
            get("projectForm");

        if (form) {
            form.reset();
        }

        get("projectId").value =
            "";
    }

    ready(setup);

})();