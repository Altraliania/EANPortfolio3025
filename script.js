// ==========================================================
// MAIN SITE SCRIPT
// ==========================================================


// ==========================================================
// CLOCK CONFIGURATION
// ==========================================================
//
// CHANGE THIS ONE VALUE whenever you want the "CURRENT"
// button to point to a different clock.
//
// Options:
// "EST"
// "PST"
// "FLIGHT"
//
// "FLIGHT" is NOT a selectable button.
// It can only be activated through CURRENT_CLOCK_MODE.
//
// ==========================================================

const CURRENT_CLOCK_MODE = "PST";


// ==========================================================
// FLIGHT MODE CONFIGURATION
// ==========================================================

const FLIGHT_MODE_LOCATION =
    "FLIGHT MODE";


// ==========================================================
// CLOCK TIMEZONES
// ==========================================================

const CLOCK_TIMEZONES = {

    EST:
        "America/New_York",

    PST:
        "America/Los_Angeles"

};


// ==========================================================
// CLOCK MODE LABELS
// ==========================================================

const CLOCK_MODE_LABELS = {

    EST:
        "LOCAL TIME (EST)",

    PST:
        "LOCAL TIME (PST)",

    FLIGHT:
        "FLIGHT MODE"

};


// ==========================================================
// CURRENT CLOCK MODE
// ==========================================================

let activeClockMode =
    "EST";


// ==========================================================
// CLOCK NOTIFICATION TIMER
// ==========================================================

let clockNotificationTimer =
    null;


// ==========================================================
// MAIN SITE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SCRIPT.JS LOADED"
        );


        // ==================================================
        // CONTACT FORM
        // ==================================================

        const form =
            document.getElementById(
                "contact-form"
            );


        const status =
            document.getElementById(
                "status"
            );


        if (
            form &&
            status
        ) {

            form.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const nameElement =
                        document.getElementById(
                            "name"
                        );


                    const emailElement =
                        document.getElementById(
                            "email"
                        );


                    const messageElement =
                        document.getElementById(
                            "message"
                        );


                    if (
                        !nameElement ||
                        !emailElement ||
                        !messageElement
                    ) {

                        status.textContent =
                            "Contact form fields are missing.";

                        return;

                    }


                    const name =
                        nameElement.value.trim();


                    const email =
                        emailElement.value.trim();


                    const message =
                        messageElement.value.trim();


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
                                    method:
                                        "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            name:
                                                name,

                                            email:
                                                email,

                                            message:
                                                message

                                        })
                                }
                            );


                        const text =
                            await response.text();


                        let result;


                        try {

                            result =
                                JSON.parse(
                                    text
                                );

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


        // ==================================================
        // PAGE FADE TRANSITIONS
        // ==================================================

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

                        if (
                            this.getAttribute(
                                "target"
                            ) === "_blank"
                        ) {

                            return;

                        }


                        const targetUrl =
                            this.getAttribute(
                                "href"
                            );


                        if (
                            !targetUrl ||
                            targetUrl === "#"
                        ) {

                            return;

                        }


                        event.preventDefault();


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


        // ==================================================
        // CLOCK
        // ==================================================

        initializeClock();


        setInterval(
            updateClock,
            1000
        );


        // ==================================================
        // VISITOR HEARTBEAT
        // ==================================================

        sendVisitorHeartbeat();


        setInterval(
            sendVisitorHeartbeat,
            30000
        );


        // ==================================================
        // VISITOR LOCATION
        // ==================================================

        sendVisitorLocation();


        setInterval(
            sendVisitorLocation,
            60000
        );


        // ==================================================
        // ACADEMIC MAP
        // ==================================================

        initializeAcademicMap();

    }
);


// ==========================================================
// CLOCK INITIALIZATION
// ==========================================================

function initializeClock() {

    const clockButtons =
        document.querySelectorAll(
            ".clock-mode-button"
        );


    // ------------------------------------------------------
    // Default mode
    // ------------------------------------------------------

    activeClockMode =
        "EST";


    updateClock();

    updateClockModeButtons();


    // ------------------------------------------------------
    // Clock navigation
    // ------------------------------------------------------

    clockButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const requestedMode =
                        String(
                            this.dataset.clockMode || ""
                        )
                        .trim()
                        .toUpperCase();


                    if (!requestedMode) {

                        return;

                    }


                    // --------------------------------------
                    // CURRENT
                    // --------------------------------------

                    if (
                        requestedMode ===
                        "CURRENT"
                    ) {

                        const currentMode =
                            normalizeClockMode(
                                CURRENT_CLOCK_MODE
                            );


                        activeClockMode =
                            currentMode;


                        updateClock();

                        updateClockModeButtons();

                        showClockNotification(
                            getClockNotification(
                                currentMode
                            )
                        );


                        return;

                    }


                    // --------------------------------------
                    // EST / PST ONLY
                    //
                    // FLIGHT IS NOT A SELECTABLE OPTION.
                    // --------------------------------------

                    if (
                        requestedMode ===
                        "FLIGHT"
                    ) {

                        return;

                    }


                    if (
                        requestedMode !==
                        "EST" &&
                        requestedMode !==
                        "PST"
                    ) {

                        return;

                    }


                    activeClockMode =
                        requestedMode;


                    updateClock();

                    updateClockModeButtons();


                    showClockNotification(
                        getClockNotification(
                            requestedMode
                        )
                    );

                }
            );

        }
    );

}


// ==========================================================
// NORMALIZE CLOCK MODE
// ==========================================================

function normalizeClockMode(
    mode
) {

    const normalized =
        String(
            mode || "EST"
        )
        .trim()
        .toUpperCase();


    if (
        normalized ===
        "PST"
    ) {

        return "PST";

    }


    if (
        normalized ===
        "FLIGHT"
    ) {

        return "FLIGHT";

    }


    return "EST";

}


// ==========================================================
// UPDATE CLOCK
// ==========================================================

function updateClock() {

    const clockTime =
        document.getElementById(
            "clockTime"
        );


    const clockDate =
        document.getElementById(
            "clockDate"
        );


    const clockLabel =
        document.getElementById(
            "clockLabel"
        );


    // ======================================================
    // FLIGHT MODE
    // ======================================================
    //
    // No time.
    // No date.
    // Just:
    //
    // Currently Flying
    //
    // ======================================================

    if (
        activeClockMode ===
        "FLIGHT"
    ) {

        if (clockTime) {

            clockTime.textContent =
                "Currently Flying";

        }


        if (clockDate) {

            clockDate.textContent =
                "";

        }


        if (clockLabel) {

            clockLabel.textContent =
                CLOCK_MODE_LABELS.FLIGHT;

        }


        return;

    }


    // ======================================================
    // NORMAL CLOCK
    // ======================================================

    const now =
        new Date();


    const timezone =
        CLOCK_TIMEZONES[
            activeClockMode
        ] ||
        CLOCK_TIMEZONES.EST;


    const time =
        now.toLocaleTimeString(
            "en-US",
            {
                timeZone:
                    timezone,

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
                    timezone,

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


    if (clockTime) {

        clockTime.textContent =
            time;

    }


    if (clockDate) {

        clockDate.textContent =
            date;

    }


    if (clockLabel) {

        clockLabel.textContent =
            CLOCK_MODE_LABELS[
                activeClockMode
            ] ||
            "LOCAL TIME";

    }

}


// ==========================================================
// UPDATE CLOCK BUTTONS
// ==========================================================

function updateClockModeButtons() {

    const buttons =
        document.querySelectorAll(
            ".clock-mode-button"
        );


    buttons.forEach(
        function (button) {

            const buttonMode =
                String(
                    button.dataset.clockMode || ""
                )
                .trim()
                .toUpperCase();


            let isActive =
                false;


            // CURRENT button is active whenever
            // the active mode matches CURRENT_CLOCK_MODE.

            if (
                buttonMode ===
                "CURRENT"
            ) {

                isActive =
                    activeClockMode ===
                    normalizeClockMode(
                        CURRENT_CLOCK_MODE
                    );

            }


            // EST and PST buttons work normally.

            else if (
                buttonMode ===
                "EST" ||
                buttonMode ===
                "PST"
            ) {

                isActive =
                    buttonMode ===
                    activeClockMode;

            }


            // FLIGHT buttons are never active because
            // Flight Mode is not a selectable button.

            else {

                isActive =
                    false;

            }


            button.classList.toggle(
                "active",
                isActive
            );

        }
    );

}


// ==========================================================
// CLOCK NOTIFICATION TEXT
// ==========================================================

function getClockNotification(
    mode
) {

    if (
        mode ===
        "FLIGHT"
    ) {

        return "Emanuel is on Flight Mode";

    }


    if (
        mode ===
        "PST"
    ) {

        return "The Current timezone is PST";

    }


    return "The Current timezone is EST";

}


// ==========================================================
// SHOW CLOCK NOTIFICATION
// ==========================================================

function showClockNotification(
    message
) {

    const notification =
        document.getElementById(
            "clockNotification"
        );


    const notificationText =
        document.getElementById(
            "clockNotificationText"
        );


    if (
        !notification ||
        !notificationText
    ) {

        return;

    }


    notificationText.textContent =
        message;


    // ------------------------------------------------------
    // Force notification to appear on the LEFT.
    // ------------------------------------------------------

    notification.style.left =
        "20px";

    notification.style.right =
        "auto";


    notification.classList.remove(
        "visible"
    );


    // Force the browser to recognize the
    // removal before adding it again.

    void notification.offsetWidth;


    notification.classList.add(
        "visible"
    );


    if (
        clockNotificationTimer
    ) {

        clearTimeout(
            clockNotificationTimer
        );

    }


    // ------------------------------------------------------
    // Notification stays visible for 1.5 seconds.
    // ------------------------------------------------------

    clockNotificationTimer =
        setTimeout(
            function () {

                notification.classList.remove(
                    "visible"
                );

            },
            1500
        );

}


// ==========================================================
// VISITOR HEARTBEAT
// ==========================================================

async function sendVisitorHeartbeat() {

    try {

        const response =
            await fetch(
                "/api/visitor",
                {
                    method:
                        "POST",

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


// ==========================================================
// VISITOR LOCATION
// ==========================================================

async function sendVisitorLocation() {

    try {

        await fetch(
            "/api/visitor-locations",
            {
                method:
                    "POST",

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


    } catch (error) {

        console.error(
            "Visitor location tracking failed:",
            error
        );

    }

}


// ==========================================================
// ACADEMIC JOURNEY MAP
// ==========================================================

function initializeAcademicMap() {

    const mapElement =
        document.getElementById(
            "academicMap"
        );


    if (!mapElement) {

        return;

    }


    if (
        typeof L === "undefined"
    ) {

        console.error(
            "Leaflet is not available."
        );

        return;

    }


    if (
        mapElement._leaflet_id
    ) {

        return;

    }


    const map =
        L.map(
            "academicMap",
            {
                zoomControl:
                    true,

                scrollWheelZoom:
                    true
            }
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(
        map
    );


    const locations = {

        forestStreet: {

            name:
                "Forest Street Community School",

            type:
                "School",

            info:
                "Attended: 2019–2025 • Grades 2–7",

            description:
                "My elementary and middle school in Orange, New Jersey.",

            coordinates: [
                40.7717,
                -74.2336
            ]

        },


        ewr: {

            name:
                "Newark Liberty International Airport",

            type:
                "Airport",

            info:
                "My Home Airport • EWR",

            description:
                "My home airport in New Jersey.",

            coordinates: [
                40.6895,
                -74.1745
            ]

        },


        sea: {

            name:
                "Seattle-Tacoma International Airport",

            type:
                "Airport",

            info:
                "My Layover Airport • SEA",

            description:
                "My layover airport in Washington.",

            coordinates: [
                47.4502,
                -122.3088
            ]

        },


        yyj: {

            name:
                "Victoria International Airport",

            type:
                "Airport",

            info:
                "My Arrival Airport • YYJ",

            description:
                "My arrival airport in British Columbia.",

            coordinates: [
                48.6469,
                -123.4260
            ]

        },


        shawnigan: {

            name:
                "Shawnigan Lake School",

            type:
                "School",

            info:
                "Attending: 2025–2030 • Grades 8–12",

            description:
                "My current high school in British Columbia.",

            coordinates: [
                48.6500,
                -123.5700
            ]

        }

    };


    const schoolIcon =
        L.divIcon(
            {

                className:
                    "",

                html:
                    `
                    <div class="academic-school-marker"></div>
                    `,

                iconSize:
                    [18, 18],

                iconAnchor:
                    [9, 9]

            }
        );


    const airportIcon =
        L.divIcon(
            {

                className:
                    "",

                html:
                    `
                    <div class="academic-airport-marker"></div>
                    `,

                iconSize:
                    [18, 18],

                iconAnchor:
                    [9, 9]

            }
        );


    function tooltipHTML(
        location
    ) {

        return `

            <div class="academic-tooltip-title">
                ${location.name}
            </div>

            <div class="academic-tooltip-info">
                ${location.info}
            </div>

        `;

    }


    function popupHTML(
        location
    ) {

        return `

            <div class="academic-popup">

                <div class="academic-popup-label">
                    ${location.type}
                </div>

                <h3>
                    ${location.name}
                </h3>

                <p>
                    ${location.description}
                </p>

                <div class="academic-popup-info">
                    ${location.info}
                </div>

            </div>

        `;

    }


    const forestMarker =
        L.marker(
            locations.forestStreet.coordinates,
            {
                icon:
                    schoolIcon
            }
        )
        .addTo(
            map
        )
        .bindTooltip(
            tooltipHTML(
                locations.forestStreet
            ),
            {
                direction:
                    "top",

                sticky:
                    true,

                className:
                    "academic-tooltip"
            }
        )
        .bindPopup(
            popupHTML(
                locations.forestStreet
            )
        );


    const shawniganMarker =
        L.marker(
            locations.shawnigan.coordinates,
            {
                icon:
                    schoolIcon
            }
        )
        .addTo(
            map
        )
        .bindTooltip(
            tooltipHTML(
                locations.shawnigan
            ),
            {
                direction:
                    "top",

                sticky:
                    true,

                className:
                    "academic-tooltip"
            }
        )
        .bindPopup(
            popupHTML(
                locations.shawnigan
            )
        );


    const ewrMarker =
        L.marker(
            locations.ewr.coordinates,
            {
                icon:
                    airportIcon
            }
        )
        .addTo(
            map
        )
        .bindTooltip(
            tooltipHTML(
                locations.ewr
            ),
            {
                direction:
                    "top",

                sticky:
                    true,

                className:
                    "academic-tooltip"
            }
        )
        .bindPopup(
            popupHTML(
                locations.ewr
            )
        );


    const seaMarker =
        L.marker(
            locations.sea.coordinates,
            {
                icon:
                    airportIcon
            }
        )
        .addTo(
            map
        )
        .bindTooltip(
            tooltipHTML(
                locations.sea
            ),
            {
                direction:
                    "top",

                sticky:
                    true,

                className:
                    "academic-tooltip"
            }
        )
        .bindPopup(
            popupHTML(
                locations.sea
            )
        );


    const yyjMarker =
        L.marker(
            locations.yyj.coordinates,
            {
                icon:
                    airportIcon
            }
        )
        .addTo(
            map
        )
        .bindTooltip(
            tooltipHTML(
                locations.yyj
            ),
            {
                direction:
                    "top",

                sticky:
                    true,

                className:
                    "academic-tooltip"
            }
        )
        .bindPopup(
            popupHTML(
                locations.yyj
            )
        );


    // ======================================================
    // FLIGHT ROUTE
    // ======================================================

    const flightRoute =
        L.polyline(
            [
                locations.ewr.coordinates,

                locations.sea.coordinates,

                locations.yyj.coordinates
            ],
            {

                color:
                    "#007bff",

                weight:
                    4,

                opacity:
                    0.9,

                dashArray:
                    "9 9",

                lineCap:
                    "round",

                lineJoin:
                    "round"

            }
        )
        .addTo(
            map
        );


    flightRoute.bindTooltip(
        `
        <div class="academic-tooltip-title">
            Flight Route
        </div>

        <div class="academic-tooltip-info">
            EWR → SEA → YYJ
        </div>
        `,
        {
            sticky:
                true,

            className:
                "academic-tooltip"
        }
    );


    // ======================================================
    // FLIGHT HOVER OVERLAY
    // ======================================================

    const mapContainer =
        mapElement.parentElement;


    const flightOverlay =
        document.createElement(
            "div"
        );


    flightOverlay.className =
        "flight-hover-overlay";


    flightOverlay.innerHTML =
        `

        <div
            class="flight-airline-logo"
            id="flightAirlineLogo"
        >

            <img
                src="Alaska-Airlines-One-World.png"
                alt="Alaska Airlines"
            >

        </div>


        <div
            class="flight-hover-plane"
            id="flightHoverPlane"
        >

            <img
                src="Alaska-Airline-Plane.png"
                alt="Alaska Airlines aircraft"
            >

        </div>

        `;


    mapContainer.appendChild(
        flightOverlay
    );


    const airlineLogo =
        flightOverlay.querySelector(
            "#flightAirlineLogo"
        );


    const hoverPlane =
        flightOverlay.querySelector(
            "#flightHoverPlane"
        );


    function showFlightOverlay(
        latLng
    ) {

        flightOverlay.classList.add(
            "visible"
        );


        positionFlightOverlay(
            latLng
        );

    }


    function hideFlightOverlay() {

        flightOverlay.classList.remove(
            "visible"
        );

    }


    function positionFlightOverlay(
        latLng
    ) {

        if (!latLng) {

            return;

        }


        const point =
            map.latLngToContainerPoint(
                latLng
            );


        hoverPlane.style.left =
            `${point.x}px`;


        hoverPlane.style.top =
            `${point.y}px`;


        airlineLogo.style.left =
            `${point.x + 18}px`;


        airlineLogo.style.top =
            `${point.y - 58}px`;

    }


    flightRoute.on(
        "mouseover",
        function (event) {

            showFlightOverlay(
                event.latlng
            );

        }
    );


    flightRoute.on(
        "mousemove",
        function (event) {

            showFlightOverlay(
                event.latlng
            );

        }
    );


    flightRoute.on(
        "mouseout",
        function () {

            hideFlightOverlay();

        }
    );


    let lastFlightPosition =
        null;


    flightRoute.on(
        "mousemove",
        function (event) {

            lastFlightPosition =
                event.latlng;

        }
    );


    map.on(
        "move",
        function () {

            if (
                flightOverlay.classList.contains(
                    "visible"
                ) &&
                lastFlightPosition
            ) {

                positionFlightOverlay(
                    lastFlightPosition
                );

            }

        }
    );


    mapElement.addEventListener(
        "mouseleave",
        function () {

            hideFlightOverlay();

            lastFlightPosition =
                null;

        }
    );


    flightRoute.on(
        "click",
        function (event) {

            L.popup()
                .setLatLng(
                    event.latlng
                )
                .setContent(
                    `
                    <div class="academic-popup">

                        <div class="academic-popup-label">
                            FLIGHT ROUTE
                        </div>

                        <h3>
                            Alaska Airlines
                        </h3>

                        <p>
                            Route:
                            <strong>
                                EWR → SEA → YYJ
                            </strong>
                        </p>

                        <div class="academic-popup-info">
                            EWR • SEA • YYJ
                        </div>

                    </div>
                    `
                )
                .openOn(
                    map
                );

        }
    );


    // ======================================================
    // MAP BOUNDS
    // ======================================================

    const allPoints = [

        locations.forestStreet.coordinates,

        locations.ewr.coordinates,

        locations.sea.coordinates,

        locations.yyj.coordinates,

        locations.shawnigan.coordinates

    ];


    const bounds =
        L.latLngBounds(
            allPoints
        );


    map.fitBounds(
        bounds,
        {
            padding:
                [35, 35]
        }
    );


    // ======================================================
    // MARKER CLICK BEHAVIOR
    // ======================================================

    function setupMarker(
        marker
    ) {

        marker.on(
            "click",
            function () {

                map.flyTo(
                    marker.getLatLng(),
                    9,
                    {
                        duration:
                            1
                    }
                );


                marker.openPopup();

            }
        );

    }


    setupMarker(
        forestMarker
    );


    setupMarker(
        shawniganMarker
    );


    setupMarker(
        ewrMarker
    );


    setupMarker(
        seaMarker
    );


    setupMarker(
        yyjMarker
    );


    // ======================================================
    // MAP RESIZE
    // ======================================================

    setTimeout(
        function () {

            map.invalidateSize();

        },
        300
    );


    window.addEventListener(
        "resize",
        function () {

            map.invalidateSize();

        }
    );

}