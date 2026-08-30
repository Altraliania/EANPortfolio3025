// ==========================================================
// MAIN SITE SCRIPT
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


        // ==================================================
        // CLOCK
        // ==================================================

        updateClock();


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
// CLOCK
// ==========================================================

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


    // ------------------------------------------------------
    // Only initialize on pages containing the map.
    // ------------------------------------------------------

    if (!mapElement) {

        return;

    }


    // ------------------------------------------------------
    // Make sure Leaflet loaded.
    // ------------------------------------------------------

    if (
        typeof L === "undefined"
    ) {

        console.error(
            "Leaflet is not available."
        );

        return;

    }


    // ------------------------------------------------------
    // Prevent double initialization.
    // ------------------------------------------------------

    if (
        mapElement._leaflet_id
    ) {

        return;

    }


    // ======================================================
    // CREATE MAP
    // ======================================================

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


    // ======================================================
    // MAP TILES
    // ======================================================

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


    // ======================================================
    // LOCATIONS
    // ======================================================

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


    // ======================================================
    // SCHOOL ICON
    // ======================================================

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


    // ======================================================
    // AIRPORT ICON
    // ======================================================

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


    // ======================================================
    // TOOLTIP HTML
    // ======================================================

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


    // ======================================================
    // POPUP HTML
    // ======================================================

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


    // ======================================================
    // SCHOOL MARKERS
    // ======================================================

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


    // ======================================================
    // AIRPORT MARKERS
    // ======================================================

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
    // EWR → SEA → YYJ
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


    // ======================================================
    // FLIGHT ROUTE TOOLTIP
    // ======================================================

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
    // FLIGHT OVERLAY CONTAINER
    // ======================================================
    //
    // This sits above the Leaflet map and contains:
    //
    // 1. Alaska Airlines logo
    // 2. Plane PNG
    //
    // They are hidden until the flight line is hovered.
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


    // ======================================================
    // SHOW FLIGHT OVERLAY
    // ======================================================

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


    // ======================================================
    // HIDE FLIGHT OVERLAY
    // ======================================================

    function hideFlightOverlay() {

        flightOverlay.classList.remove(
            "visible"
        );

    }


    // ======================================================
    // POSITION PLANE + AIRLINE LOGO
    // ======================================================

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


        // --------------------------------------------------
        // Plane
        // --------------------------------------------------

        hoverPlane.style.left =
            `${point.x}px`;


        hoverPlane.style.top =
            `${point.y}px`;


        // --------------------------------------------------
        // Airline logo
        // --------------------------------------------------
        //
        // Place it slightly above/right of the cursor.
        // --------------------------------------------------

        airlineLogo.style.left =
            `${point.x + 18}px`;


        airlineLogo.style.top =
            `${point.y - 58}px`;

    }


    // ======================================================
    // ROUTE MOUSE OVER
    // ======================================================

    flightRoute.on(
        "mouseover",
        function (event) {

            showFlightOverlay(
                event.latlng
            );

        }
    );


    // ======================================================
    // ROUTE MOUSE MOVE
    // ======================================================

    flightRoute.on(
        "mousemove",
        function (event) {

            showFlightOverlay(
                event.latlng
            );

        }
    );


    // ======================================================
    // ROUTE MOUSE OUT
    // ======================================================

    flightRoute.on(
        "mouseout",
        function () {

            hideFlightOverlay();

        }
    );


    // ======================================================
    // UPDATE PLANE/LOGO WHEN MAP MOVES
    // ======================================================

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


    // ======================================================
    // REMOVE OVERLAY WHEN MOUSE LEAVES MAP
    // ======================================================

    mapElement.addEventListener(
        "mouseleave",
        function () {

            hideFlightOverlay();

            lastFlightPosition =
                null;

        }
    );


    // ======================================================
    // ROUTE CLICK
    // ======================================================

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
    // ALL MAP POINTS
    // ======================================================

    const allPoints = [

        locations.forestStreet.coordinates,

        locations.ewr.coordinates,

        locations.sea.coordinates,

        locations.yyj.coordinates,

        locations.shawnigan.coordinates

    ];


    // ======================================================
    // FIT MAP
    // ======================================================

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
    // MARKER CLICK INTERACTIONS
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