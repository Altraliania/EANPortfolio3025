/*
=========================================================
CREATOR.JS
Emanuel Negussie Portfolio
=========================================================

This file controls:

1. Creator Mode button
2. Creator login popup
3. Password visibility
4. Creator dashboard
5. Close / Exit buttons
6. Project editor
7. Timeline editor
8. Supabase project storage
9. Supabase timeline storage
10. Site status
11. Visitor analytics

The Creator system is contained inside index.html.
Creator.html is NOT required.
=========================================================
*/

(function () {

    "use strict";

    console.log("CREATOR.JS LOADED");


    /* =====================================================
       ELEMENT HELPER
    ===================================================== */

    function get(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       MAIN ELEMENTS
    ===================================================== */

    const creatorButton =
        get("creatorModeButton");

    const loginOverlay =
        get("creatorLoginOverlay");

    const loginForm =
        get("creatorLoginForm");

    const emailInput =
        get("creatorEmail");

    const passwordInput =
        get("creatorPasswordInput");

    const passwordToggle =
        get("creatorPasswordToggle");

    const passwordError =
        get("creatorPasswordError");

    const cancelLogin =
        get("cancelCreatorLogin");

    const dashboard =
        get("creatorOverlay");

    const closeCreator =
        get("closeCreator");

    const exitCreator =
        get("exitCreator");

    const exitCreatorFooter =
        get("exitCreatorFooter");


    /* =====================================================
       DEBUGGING
    ===================================================== */

    console.log("Creator button:", creatorButton);
    console.log("Login overlay:", loginOverlay);
    console.log("Login form:", loginForm);
    console.log("Dashboard:", dashboard);


    /* =====================================================
       FORCE INITIAL STATE
    ===================================================== */

    function hideLogin() {

        if (!loginOverlay) {
            return;
        }

        loginOverlay.style.display = "none";

        loginOverlay.classList.remove("active");
        loginOverlay.classList.remove("visible");
        loginOverlay.classList.remove("show");

    }


    function hideDashboard() {

        if (!dashboard) {
            return;
        }

        dashboard.style.display = "none";

        dashboard.classList.remove("active");
        dashboard.classList.remove("visible");
        dashboard.classList.remove("show");

    }


    function showLogin() {

        if (!loginOverlay) {

            console.error(
                "CREATOR ERROR: #creatorLoginOverlay does not exist."
            );

            return;

        }

        console.log("Opening Creator Login");


        /*
        IMPORTANT:

        We use inline display as a fallback so this
        still works even if creator.css has different
        visibility rules.
        */

        loginOverlay.style.display = "flex";

        loginOverlay.classList.add("active");
        loginOverlay.classList.add("visible");
        loginOverlay.classList.add("show");


        document.body.classList.add(
            "creator-login-open"
        );


        if (emailInput) {
            setTimeout(function () {
                emailInput.focus();
            }, 100);
        }

    }


    function showDashboard() {

        if (!dashboard) {

            console.error(
                "CREATOR ERROR: #creatorOverlay does not exist."
            );

            return;

        }

        console.log("Opening Creator Dashboard");


        hideLogin();


        dashboard.style.display = "flex";

        dashboard.classList.add("active");
        dashboard.classList.add("visible");
        dashboard.classList.add("show");


        document.body.classList.add(
            "creator-dashboard-open"
        );


        loadProjects();
        loadTimeline();
        updateStats();
        checkSiteStatus();
        loadVisitorAnalytics();

    }


    function closeDashboard() {

        console.log("Closing Creator Dashboard");


        if (dashboard) {

            dashboard.style.display = "none";

            dashboard.classList.remove("active");
            dashboard.classList.remove("visible");
            dashboard.classList.remove("show");

        }


        document.body.classList.remove(
            "creator-dashboard-open"
        );

    }


    /* =====================================================
       CREATOR BUTTON
    ===================================================== */

    if (creatorButton) {

        creatorButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                console.log(
                    "CREATOR MODE BUTTON CLICKED"
                );

                /*
                This deliberately does NOT check the
                welcome screen/game.

                Creator Mode can therefore be opened
                even while the welcome screen is present.
                */

                showLogin();

            }
        );

    } else {

        console.error(
            "CREATOR ERROR: #creatorModeButton NOT FOUND"
        );

    }


    /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    passwordToggle.textContent =
                        "🙈";

                } else {

                    passwordInput.type =
                        "password";

                    passwordToggle.textContent =
                        "👁";

                }

            }
        );

    }


    /* =====================================================
       CANCEL LOGIN
    ===================================================== */

    if (cancelLogin) {

        cancelLogin.addEventListener(
            "click",
            function () {

                hideLogin();

                if (passwordError) {
                    passwordError.textContent = "";
                }

            }
        );

    }


    /* =====================================================
       CLICK OUTSIDE LOGIN
    ===================================================== */

    if (loginOverlay) {

        loginOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    loginOverlay
                ) {

                    hideLogin();

                }

            }
        );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();
                event.stopPropagation();


                if (passwordError) {
                    passwordError.textContent = "";
                }


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";

                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                if (!email || !password) {

                    if (passwordError) {
                        passwordError.textContent =
                            "Please enter your email and password.";
                    }

                    return;

                }


                /*
                Make sure Supabase exists.
                */

                const supabase =
                    window.supabaseClient;


                if (!supabase) {

                    console.error(
                        "Supabase client is missing."
                    );

                    if (passwordError) {
                        passwordError.textContent =
                            "Supabase could not be loaded. Check your internet connection.";
                    }

                    return;

                }


                const submitButton =
                    get("creatorPasswordSubmit");


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Unlocking...";

                }


                try {

                    console.log(
                        "Attempting Creator login..."
                    );


                    const result =
                        await supabase.auth.signInWithPassword(
                            {
                                email: email,
                                password: password
                            }
                        );


                    if (result.error) {

                        console.error(
                            "Creator login failed:",
                            result.error
                        );

                        if (passwordError) {

                            passwordError.textContent =
                                result.error.message ||
                                "Invalid email or password.";

                        }

                        return;

                    }


                    console.log(
                        "Creator login successful."
                    );


                    showDashboard();


                } catch (error) {

                    console.error(
                        "Creator login error:",
                        error
                    );


                    if (passwordError) {

                        passwordError.textContent =
                            "Unable to log in. Please try again.";

                    }

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Unlock";

                    }

                }

            }
        );

    }


    /* =====================================================
       CLOSE DASHBOARD
    ===================================================== */

    if (closeCreator) {

        closeCreator.addEventListener(
            "click",
            function () {

                closeDashboard();

            }
        );

    }


    if (exitCreator) {

        exitCreator.addEventListener(
            "click",
            function () {

                closeDashboard();

            }
        );

    }


    if (exitCreatorFooter) {

        exitCreatorFooter.addEventListener(
            "click",
            function () {

                closeDashboard();

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            if (
                loginOverlay &&
                loginOverlay.style.display === "flex"
            ) {

                hideLogin();

                return;

            }


            if (
                dashboard &&
                dashboard.style.display === "flex"
            ) {

                closeDashboard();

            }

        }
    );


    /* =====================================================
       PROJECT EDITOR
    ===================================================== */

    const addProjectButton =
        get("addProjectButton");

    const projectEditor =
        get("projectEditor");

    const closeEditor =
        get("closeEditor");

    const cancelEditor =
        get("cancelEditor");

    const projectForm =
        get("projectForm");


    function openProjectEditor(project) {

        if (!projectEditor) {
            return;
        }


        projectEditor.style.display =
            "flex";


        if (project) {

            get("editorTitle").textContent =
                "Edit Project";

            get("projectId").value =
                project.id || "";

            get("projectName").value =
                project.name || "";

            get("projectDescription").value =
                project.description || "";

            get("projectTech").value =
                project.technologies || "";

            get("projectGithub").value =
                project.github_url || "";

            get("projectLive").value =
                project.live_url || "";

            get("projectActive").checked =
                Boolean(project.active);

        } else {

            get("editorTitle").textContent =
                "Add Project";

            projectForm.reset();

            get("projectId").value =
                "";

            get("projectActive").checked =
                true;

        }

    }


    function closeProjectEditor() {

        if (!projectEditor) {
            return;
        }

        projectEditor.style.display =
            "none";

    }


    if (addProjectButton) {

        addProjectButton.addEventListener(
            "click",
            function () {

                openProjectEditor(null);

            }
        );

    }


    if (closeEditor) {

        closeEditor.addEventListener(
            "click",
            closeProjectEditor
        );

    }


    if (cancelEditor) {

        cancelEditor.addEventListener(
            "click",
            closeProjectEditor
        );

    }


    /* =====================================================
       SAVE PROJECT
    ===================================================== */

    if (projectForm) {

        projectForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const supabase =
                    window.supabaseClient;


                if (!supabase) {
                    alert("Supabase is not available.");
                    return;
                }


                const id =
                    get("projectId").value.trim();


                const project = {

                    name:
                        get("projectName").value.trim(),

                    description:
                        get("projectDescription").value.trim(),

                    technologies:
                        get("projectTech").value.trim(),

                    github_url:
                        get("projectGithub").value.trim() ||
                        null,

                    live_url:
                        get("projectLive").value.trim() ||
                        null,

                    active:
                        get("projectActive").checked

                };


                try {

                    let result;


                    if (id) {

                        result =
                            await supabase
                                .from("projects")
                                .update(project)
                                .eq("id", id);

                    } else {

                        result =
                            await supabase
                                .from("projects")
                                .insert([project]);

                    }


                    if (result.error) {

                        console.error(
                            result.error
                        );

                        alert(
                            "Could not save project:\n" +
                            result.error.message
                        );

                        return;

                    }


                    closeProjectEditor();

                    loadProjects();

                    updateStats();


                } catch (error) {

                    console.error(
                        "Project save error:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       LOAD PROJECTS
    ===================================================== */

    async function loadProjects() {

        const container =
            get("creatorProjects");


        if (!container) {
            return;
        }


        const supabase =
            window.supabaseClient;


        if (!supabase) {
            return;
        }


        try {

            const result =
                await supabase
                    .from("projects")
                    .select("*")
                    .order("id", {
                        ascending: false
                    });


            if (result.error) {

                console.error(
                    "Could not load projects:",
                    result.error
                );

                container.innerHTML =
                    "<p>Could not load projects.</p>";

                return;

            }


            const projects =
                result.data || [];


            if (!projects.length) {

                container.innerHTML =
                    "<p>No projects yet.</p>";

                return;

            }


            container.innerHTML =
                "";


            projects.forEach(
                function (project) {

                    const card =
                        document.createElement(
                            "div"
                        );

                    card.className =
                        "creator-project-card";


                    card.innerHTML = `

                        <div>

                            <h3>
                                ${escapeHTML(project.name || "Untitled")}
                            </h3>

                            <p>
                                ${escapeHTML(project.description || "")}
                            </p>

                            <small>
                                ${escapeHTML(project.technologies || "")}
                            </small>

                        </div>

                        <div class="creator-project-actions">

                            <button
                                type="button"
                                class="edit-project-button"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-project-button"
                            >
                                Delete
                            </button>

                        </div>

                    `;


                    const editButton =
                        card.querySelector(
                            ".edit-project-button"
                        );


                    const deleteButton =
                        card.querySelector(
                            ".delete-project-button"
                        );


                    editButton.addEventListener(
                        "click",
                        function () {

                            openProjectEditor(
                                project
                            );

                        }
                    );


                    deleteButton.addEventListener(
                        "click",
                        function () {

                            deleteProject(
                                project.id
                            );

                        }
                    );


                    container.appendChild(
                        card
                    );

                }
            );


        } catch (error) {

            console.error(
                "Project loading error:",
                error
            );

        }

    }


    /* =====================================================
       DELETE PROJECT
    ===================================================== */

    async function deleteProject(id) {

        if (
            !confirm(
                "Delete this project?"
            )
        ) {

            return;

        }


        const supabase =
            window.supabaseClient;


        if (!supabase) {
            return;
        }


        const result =
            await supabase
                .from("projects")
                .delete()
                .eq("id", id);


        if (result.error) {

            alert(
                "Could not delete project:\n" +
                result.error.message
            );

            return;

        }


        loadProjects();
        updateStats();

    }


    /* =====================================================
       TIMELINE
    ===================================================== */

    const addTimelineButton =
        get("addTimelineButton");

    const timelineEditor =
        get("timelineEditor");

    const closeTimelineEditor =
        get("closeTimelineEditor");

    const cancelTimelineEditor =
        get("cancelTimelineEditor");

    const timelineForm =
        get("timelineForm");


    function openTimelineEditor(item) {

        if (!timelineEditor) {
            return;
        }


        timelineEditor.style.display =
            "flex";


        if (item) {

            get("timelineEditorTitle").textContent =
                "Edit Milestone";

            get("timelineId").value =
                item.id || "";

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
                String(
                    item.active !== false
                );

        } else {

            get("timelineEditorTitle").textContent =
                "Add Milestone";

            timelineForm.reset();

            get("timelineId").value =
                "";

            get("timelineSide").value =
                "left";

            get("timelineActive").value =
                "true";

        }

    }


    function closeTimelineEditorWindow() {

        if (!timelineEditor) {
            return;
        }

        timelineEditor.style.display =
            "none";

    }


    if (addTimelineButton) {

        addTimelineButton.addEventListener(
            "click",
            function () {

                openTimelineEditor(null);

            }
        );

    }


    if (closeTimelineEditor) {

        closeTimelineEditor.addEventListener(
            "click",
            closeTimelineEditorWindow
        );

    }


    if (cancelTimelineEditor) {

        cancelTimelineEditor.addEventListener(
            "click",
            closeTimelineEditorWindow
        );

    }


    /* =====================================================
       SAVE TIMELINE
    ===================================================== */

    if (timelineForm) {

        timelineForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const supabase =
                    window.supabaseClient;


                if (!supabase) {

                    alert(
                        "Supabase is not available."
                    );

                    return;

                }


                const id =
                    get("timelineId").value.trim();


                const item = {

                    year:
                        get("timelineYear").value.trim(),

                    title:
                        get("timelineTitle").value.trim(),

                    description:
                        get("timelineDescription").value.trim(),

                    details:
                        get("timelineDetails").value.trim(),

                    side:
                        get("timelineSide").value,

                    active:
                        get("timelineActive").value ===
                        "true"

                };


                try {

                    let result;


                    if (id) {

                        result =
                            await supabase
                                .from("timeline")
                                .update(item)
                                .eq("id", id);

                    } else {

                        result =
                            await supabase
                                .from("timeline")
                                .insert([item]);

                    }


                    if (result.error) {

                        console.error(
                            result.error
                        );

                        alert(
                            "Could not save milestone:\n" +
                            result.error.message
                        );

                        return;

                    }


                    closeTimelineEditorWindow();

                    loadTimeline();

                } catch (error) {

                    console.error(
                        "Timeline save error:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       LOAD TIMELINE
    ===================================================== */

    async function loadTimeline() {

        const container =
            get("creatorTimeline");


        if (!container) {
            return;
        }


        const supabase =
            window.supabaseClient;


        if (!supabase) {
            return;
        }


        try {

            const result =
                await supabase
                    .from("timeline")
                    .select("*")
                    .order("year", {
                        ascending: true
                    });


            if (result.error) {

                console.error(
                    "Could not load timeline:",
                    result.error
                );

                container.innerHTML =
                    "<p>Could not load timeline.</p>";

                return;

            }


            const items =
                result.data || [];


            if (!items.length) {

                container.innerHTML =
                    "<p>No milestones yet.</p>";

                return;

            }


            container.innerHTML =
                "";


            items.forEach(
                function (item) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "creator-timeline-card";


                    card.innerHTML = `

                        <div>

                            <strong>
                                ${escapeHTML(item.year || "")}
                            </strong>

                            <h3>
                                ${escapeHTML(item.title || "")}
                            </h3>

                            <p>
                                ${escapeHTML(item.description || "")}
                            </p>

                        </div>

                        <div class="creator-timeline-actions">

                            <button
                                type="button"
                                class="edit-timeline-button"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-timeline-button"
                            >
                                Delete
                            </button>

                        </div>

                    `;


                    card
                        .querySelector(
                            ".edit-timeline-button"
                        )
                        .addEventListener(
                            "click",
                            function () {

                                openTimelineEditor(
                                    item
                                );

                            }
                        );


                    card
                        .querySelector(
                            ".delete-timeline-button"
                        )
                        .addEventListener(
                            "click",
                            function () {

                                deleteTimeline(
                                    item.id
                                );

                            }
                        );


                    container.appendChild(
                        card
                    );

                }
            );


        } catch (error) {

            console.error(
                "Timeline loading error:",
                error
            );

        }

    }


    /* =====================================================
       DELETE TIMELINE
    ===================================================== */

    async function deleteTimeline(id) {

        if (
            !confirm(
                "Delete this milestone?"
            )
        ) {

            return;

        }


        const supabase =
            window.supabaseClient;


        if (!supabase) {
            return;
        }


        const result =
            await supabase
                .from("timeline")
                .delete()
                .eq("id", id);


        if (result.error) {

            alert(
                "Could not delete milestone:\n" +
                result.error.message
            );

            return;

        }


        loadTimeline();

    }


    /* =====================================================
       STATS
    ===================================================== */

    async function updateStats() {

        const supabase =
            window.supabaseClient;


        if (!supabase) {
            return;
        }


        try {

            const result =
                await supabase
                    .from("projects")
                    .select(
                        "id, active",
                        {
                            count: "exact"
                        }
                    );


            if (result.error) {
                return;
            }


            const projects =
                result.data || [];


            const projectCount =
                get("projectCount");


            const activeCount =
                get("activeProjectCount");


            if (projectCount) {

                projectCount.textContent =
                    projects.length;

            }


            if (activeCount) {

                activeCount.textContent =
                    projects.filter(
                        function (project) {

                            return project.active === true;

                        }
                    ).length;

            }


        } catch (error) {

            console.error(
                "Stats error:",
                error
            );

        }

    }


    /* =====================================================
       SITE STATUS
    ===================================================== */

    async function checkSiteStatus() {

        setStatus(
            "siteStatusWebsite",
            "Online",
            true
        );


        setStatus(
            "siteStatusAPI",
            "Checking...",
            false
        );


        setStatus(
            "siteStatusDatabase",
            "Checking...",
            false
        );


        setStatus(
            "siteStatusAnalytics",
            "Checking...",
            false
        );


        const supabase =
            window.supabaseClient;


        if (!supabase) {

            setStatus(
                "siteStatusAPI",
                "Offline",
                false
            );

            setStatus(
                "siteStatusDatabase",
                "Offline",
                false
            );

            setStatus(
                "siteStatusAnalytics",
                "Offline",
                false
            );

            return;

        }


        try {

            const result =
                await supabase
                    .from("projects")
                    .select("id")
                    .limit(1);


            if (result.error) {

                setStatus(
                    "siteStatusDatabase",
                    "Error",
                    false
                );

            } else {

                setStatus(
                    "siteStatusDatabase",
                    "Online",
                    true
                );

            }


            setStatus(
                "siteStatusAPI",
                "Online",
                true
            );


            setStatus(
                "siteStatusAnalytics",
                "Online",
                true
            );


        } catch (error) {

            console.error(
                "Site status error:",
                error
            );

        }


        const checked =
            get("siteStatusLastChecked");


        if (checked) {

            checked.textContent =
                "Last checked " +
                new Date().toLocaleTimeString();

        }

    }


    function setStatus(
        id,
        text,
        good
    ) {

        const element =
            get(id);


        if (!element) {
            return;
        }


        element.textContent =
            text;


        element.classList.remove(
            "status-good",
            "status-error",
            "status-checking"
        );


        if (good) {

            element.classList.add(
                "status-good"
            );

        } else {

            element.classList.add(
                "status-error"
            );

        }

    }


    /* =====================================================
       VISITOR ANALYTICS
       
       This does NOT break Creator Mode if your visitor
       table/API doesn't exist yet.
    ===================================================== */

    async function loadVisitorAnalytics() {

        const online =
            get("onlineVisitorCount");

        const total =
            get("totalVisitorCount");

        const mapCount =
            get("visitorMapCount");

        const updated =
            get("visitorLastUpdated");


        if (online) {
            online.textContent = "—";
        }

        if (total) {
            total.textContent = "—";
        }

        if (mapCount) {
            mapCount.textContent =
                "No data";
        }

        if (updated) {
            updated.textContent =
                "Waiting for visitor data...";
        }

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value || "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function initializeCreator() {

        console.log(
            "Initializing Creator Mode..."
        );


        /*
        Do NOT hide the Creator button because of
        the welcome screen.
        */

        hideLogin();
        hideDashboard();


        if (projectEditor) {

            projectEditor.style.display =
                "none";

        }


        if (timelineEditor) {

            timelineEditor.style.display =
                "none";

        }


        console.log(
            "Creator Mode initialized successfully."
        );

    }


    /*
    This works whether creator.js loads before or
    after DOMContentLoaded.
    */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeCreator
        );

    } else {

        initializeCreator();

    }

})();