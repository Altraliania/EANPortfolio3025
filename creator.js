(function () {
    "use strict";

    const CREATOR_PASSWORD = "Altralania2011";
    const EASTER_EGG_PASSWORD = "Altrarunner";

    const STORAGE_KEY = "portfolioProjects";

    let passwordScreen = null;
    let gameScreen = null;

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function get(id) {
        return document.getElementById(id);
    }

    function createStyle() {
        if (get("creatorInjectedStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "creatorInjectedStyles";

        style.textContent = `
            #creatorModeButton {
                position: fixed !important;
                right: 20px !important;
                bottom: 20px !important;
                left: auto !important;
                top: auto !important;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
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
                transition: opacity .35s ease, visibility .35s ease !important;
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
                transition: transform .45s cubic-bezier(.2,.8,.2,1), opacity .35s ease !important;
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
                margin-bottom: 12px !important;
            }

            .creator-password-field label {
                display: block !important;
                margin-bottom: 8px !important;
                font-size: 13px !important;
                font-weight: 700 !important;
                color: var(--heading-color, #222222) !important;
            }

            .creator-password-input-wrapper {
                position: relative !important;
                width: 100% !important;
            }

            #creatorPasswordInput {
                width: 100% !important;
                height: 50px !important;
                padding: 0 52px 0 15px !important;
                border: 1px solid var(--border-color, #e2e8f0) !important;
                border-radius: 10px !important;
                background: var(--bg-color, #f8f9fa) !important;
                color: var(--text-color, #222222) !important;
                outline: none !important;
                font-family: inherit !important;
                font-size: 15px !important;
                box-sizing: border-box !important;
                transition: border-color .2s ease, box-shadow .2s ease !important;
            }

            #creatorPasswordInput:focus {
                border-color: #007bff !important;
                box-shadow: 0 0 0 3px rgba(0,123,255,.12) !important;
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
                z-index: 3 !important;
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
                transition: transform .2s ease, filter .2s ease !important;
            }

            .creator-password-actions button:hover {
                transform: translateY(-1px) !important;
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

            .creator-password-submit:hover {
                filter: brightness(1.08) !important;
            }

            .creator-password-footer {
                text-align: center !important;
                margin-top: 24px !important;
                padding-top: 18px !important;
                border-top: 1px solid var(--border-color, #e2e8f0) !important;
                color: #888 !important;
                font-size: 10px !important;
                letter-spacing: .5px !important;
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
                transition: opacity .35s ease, visibility .35s ease !important;
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
                transform: scale(.92) translateY(25px) !important;
                opacity: 0 !important;
                transition: transform .45s ease, opacity .35s ease !important;
            }

            #easterEggGame.easter-game-visible .easter-game-card {
                transform: scale(1) translateY(0) !important;
                opacity: 1 !important;
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
                font-size: 28px !important;
                color: white !important;
            }

            .easter-game-card p {
                margin: 0 0 20px 0 !important;
                color: #aaa !important;
            }

            .easter-game-stats {
                display: flex !important;
                justify-content: space-between !important;
                margin-bottom: 12px !important;
                color: #aaa !important;
                font-size: 13px !important;
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

            @media (max-width: 600px) {
                #creatorModeButton {
                    right: 12px !important;
                    bottom: 12px !important;
                }

                .creator-password-card {
                    padding: 25px !important;
                }

                .creator-password-card h1 {
                    font-size: 25px !important;
                }

                .easter-game-card {
                    padding: 20px !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function getOrCreateCreatorButton() {
        let button = get("creatorModeButton");

        if (button) {
            return button;
        }

        button = document.createElement("button");

        button.id = "creatorModeButton";
        button.type = "button";
        button.textContent = "⚙️ Creator Mode";

        document.body.appendChild(button);

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
                    This area is restricted to the portfolio creator.
                    Enter your password to continue.
                </p>

                <div class="creator-password-field">

                    <label for="creatorPasswordInput">
                        Password
                    </label>

                    <div class="creator-password-input-wrapper">

                        <input
                            id="creatorPasswordInput"
                            type="password"
                            placeholder="Enter your password"
                            autocomplete="off"
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

        document.body.appendChild(passwordScreen);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                passwordScreen.classList.add(
                    "creator-password-visible"
                );
            });
        });

        const input =
            get("creatorPasswordInput");

        const submit =
            get("creatorPasswordSubmit");

        const cancel =
            get("creatorPasswordCancel");

        const toggle =
            get("creatorPasswordToggle");

        setTimeout(() => {
            input.focus();
        }, 300);

        function login() {
            const value =
                input.value.trim();

            const error =
                get("creatorPasswordError");

            if (!value) {
                error.textContent =
                    "Please enter your password.";

                shake(input);

                return;
            }

            if (value === EASTER_EGG_PASSWORD) {
                closePasswordScreen(
                    launchGame
                );

                return;
            }

            if (value === CREATOR_PASSWORD) {
                closePasswordScreen(
                    openDashboard
                );

                return;
            }

            error.textContent =
                "Incorrect password.";

            input.value = "";

            shake(input);

            setTimeout(() => {
                input.focus();
            }, 100);
        }

        submit.addEventListener(
            "click",
            login
        );

        input.addEventListener(
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
            () => {
                closePasswordScreen();
            }
        );

        toggle.addEventListener(
            "click",
            () => {
                if (input.type === "password") {
                    input.type = "text";
                    toggle.textContent = "🙈";
                } else {
                    input.type = "password";
                    toggle.textContent = "👁";
                }

                input.focus();
            }
        );
    }

    function shake(element) {
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

    function openDashboard() {
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
    }

    function closeDashboard() {
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

    function getProjects() {
        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {
            const defaults = [
                {
                    id: "website-development",
                    name: "Website Development",
                    description: "Instead of using a web service, I actually made this website with JavaScript with the help of AI. Since joining the AllStarCode* Program, I have learned to code with JavaScript.",
                    tech: "HTML, CSS, JavaScript",
                    github: "",
                    live: "",
                    active: true
                },
                {
                    id: "cookbook",
                    name: "Cookbook",
                    description: "Since my oldest sister came back from the State of Alaska and made her own cookbook, I have learned how to cook and make my own recipes from inspiration from YouTubers and my own sister.",
                    tech: "Cooking, Recipe Development",
                    github: "",
                    live: "",
                    active: true
                }
            ];

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(defaults)
            );

            return defaults;
        }

        try {
            return JSON.parse(saved);
        } catch {
            return [];
        }
    }

    function saveProjects(projects) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(projects)
        );
    }

    function updateDashboard() {
        const projects =
            getProjects();

        const active =
            projects.filter(
                project =>
                    project.active === true
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

        container.innerHTML = "";

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

        projects.forEach(project => {
            const card =
                document.createElement("div");

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

            container.appendChild(card);
        });

        container
            .querySelectorAll("[data-edit]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        editProject(
                            button.dataset.edit
                        );
                    }
                );
            });

        container
            .querySelectorAll("[data-toggle]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        toggleProject(
                            button.dataset.toggle
                        );
                    }
                );
            });

        container
            .querySelectorAll("[data-delete]")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        deleteProject(
                            button.dataset.delete
                        );
                    }
                );
            });
    }

    function escape(value) {
        const element =
            document.createElement("div");

        element.textContent =
            value || "";

        return element.innerHTML;
    }

    function editProject(id) {
        const projects =
            getProjects();

        const project =
            projects.find(
                item =>
                    item.id === id
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

        get("projectId").value = "";

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

        const id =
            get("projectId");

        if (id) {
            id.value = "";
        }
    }

    function saveProject(event) {
        event.preventDefault();

        const name =
            get("projectName").value.trim();

        const description =
            get("projectDescription").value.trim();

        const tech =
            get("projectTech").value.trim();

        const github =
            get("projectGithub").value.trim();

        const live =
            get("projectLive").value.trim();

        const active =
            get("projectActive").checked;

        if (!name || !description) {
            alert(
                "Please fill in the project name and description."
            );

            return;
        }

        const projects =
            getProjects();

        const existingId =
            get("projectId").value;

        if (existingId) {
            const index =
                projects.findIndex(
                    project =>
                        project.id === existingId
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
                    .replace(/[^a-z0-9]+/g, "-");

            let originalId = id;
            let number = 1;

            while (
                projects.some(
                    project =>
                        project.id === id
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

        saveProjects(projects);

        closeEditor();

        updateDashboard();
    }

    function deleteProject(id) {
        const projects =
            getProjects();

        const project =
            projects.find(
                item =>
                    item.id === id
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
                    item.id !== id
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
                    item.id === id
            );

        if (!project) {
            return;
        }

        project.active =
            !project.active;

        saveProjects(projects);

        updateDashboard();
    }

    function launchGame() {
        if (get("easterEggGame")) {
            return;
        }

        gameScreen =
            document.createElement("div");

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
            canvas.getContext("2d");

        const start =
            get("startEasterGame");

        const close =
            get("closeEasterGame");

        const scoreDisplay =
            get("easterScore");

        const bestDisplay =
            get("easterBest");

        let player;
        let blocks = [];
        let score = 0;
        let running = false;
        let frame;
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
                ctx.moveTo(x, 0);
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
                ctx.moveTo(0, y);
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

            cancelAnimationFrame(frame);

            loop();
        }

        function spawn() {
            const size =
                20 +
                Math.random() * 30;

            blocks.push({
                x:
                    Math.random() *
                    (canvas.width - size),

                y:
                    -size,

                width: size,
                height: size,

                speed:
                    2 +
                    Math.random() * 2.5
            });
        }

        function hit(a, b) {
            return (
                a.x <
                    b.x + b.width &&
                a.x + a.width >
                    b.x &&
                a.y <
                    b.y + b.height &&
                a.y + a.height >
                    b.y
            );
        }

        function update() {
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
                        canvas.height + 60
                );

            for (const block of blocks) {
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
                    score / 10
                );
        }

        function draw() {
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
                    `Score: ${Math.floor(score / 10)}`,
                    canvas.width / 2,
                    200
                );
            }
        }

        function loop() {
            if (!running) {
                draw();
                return;
            }

            update();
            draw();

            frame =
                requestAnimationFrame(
                    loop
                );
        }

        function gameOver() {
            running = false;

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

            draw();
        }

        start.addEventListener(
            "click",
            startGame
        );

        close.addEventListener(
            "click",
            () => {
                running = false;

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
                keys[event.key] =
                    true;

                if (
                    event.key === "Escape"
                ) {
                    if (gameScreen) {
                        close.click();
                    }
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

        creatorButton.onclick =
            null;

        creatorButton.addEventListener(
            "click",
            function (event) {
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

        const add =
            get("addProjectButton");

        if (add) {
            add.addEventListener(
                "click",
                addProject
            );
        }

        const closeEditorButton =
            get("closeEditor");

        if (closeEditorButton) {
            closeEditorButton.addEventListener(
                "click",
                closeEditor
            );
        }

        const cancelEditor =
            get("cancelEditor");

        if (cancelEditor) {
            cancelEditor.addEventListener(
                "click",
                closeEditor
            );
        }

        const form =
            get("projectForm");

        if (form) {
            form.addEventListener(
                "submit",
                saveProject
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

        window.addEventListener(
            "storage",
            event => {
                if (
                    event.key ===
                    STORAGE_KEY
                ) {
                    updateDashboard();
                }
            }
        );

        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    const password =
                        get(
                            "creatorPasswordScreen"
                        );

                    if (password) {
                        closePasswordScreen();
                        return;
                    }

                    const editor =
                        get(
                            "projectEditor"
                        );

                    if (
                        editor &&
                        editor.classList.contains(
                            "visible"
                        )
                    ) {
                        closeEditor();
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
            }
        );

        updateDashboard();

        console.log(
            "Creator system ready."
        );
    }

    ready(setup);
})();