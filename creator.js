document.addEventListener("DOMContentLoaded", function () {

    const creatorButton =
        document.getElementById("creatorModeButton");

    const creatorOverlay =
        document.getElementById("creatorOverlay");

    const closeCreator =
        document.getElementById("closeCreator");

    const exitCreator =
        document.getElementById("exitCreator");

    const addProjectButton =
        document.getElementById("addProjectButton");

    const projectEditor =
        document.getElementById("projectEditor");

    const closeEditor =
        document.getElementById("closeEditor");

    const cancelEditor =
        document.getElementById("cancelEditor");

    const projectForm =
        document.getElementById("projectForm");

    const creatorProjects =
        document.getElementById("creatorProjects");

    const projectCount =
        document.getElementById("projectCount");

    const activeProjectCount =
        document.getElementById("activeProjectCount");


    /* =========================
       PROJECT STORAGE
    ========================= */

    let projects =
        JSON.parse(
            localStorage.getItem("emanuelPortfolioProjects")
        ) || [
            {
                id: 1,
                name: "MUN Together",
                description:
                    "A social network for Model UN delegates.",
                tech:
                    "HTML, CSS, JavaScript, Supabase",
                github: "",
                live: "",
                active: true
            },
            {
                id: 2,
                name: "Portfolio Website",
                description:
                    "My personal portfolio website.",
                tech:
                    "HTML, CSS, JavaScript",
                github: "",
                live: "",
                active: true
            }
        ];


    function saveProjects() {

        localStorage.setItem(
            "emanuelPortfolioProjects",
            JSON.stringify(projects)
        );

    }


    /* =========================
       OPEN CREATOR
    ========================= */

    creatorButton.addEventListener("click", function () {

        creatorOverlay.classList.add("visible");

        renderProjects();

    });


    /* =========================
       CLOSE CREATOR
    ========================= */

    function closeCreatorDashboard() {

        creatorOverlay.classList.remove("visible");

    }


    closeCreator.addEventListener(
        "click",
        closeCreatorDashboard
    );

    exitCreator.addEventListener(
        "click",
        closeCreatorDashboard
    );


    /* =========================
       CLOSE BACKGROUND
    ========================= */

    creatorOverlay.addEventListener(
        "click",
        function (event) {

            if (event.target === creatorOverlay) {

                closeCreatorDashboard();

            }

        }
    );


    /* =========================
       RENDER PROJECTS
    ========================= */

    function renderProjects() {

        creatorProjects.innerHTML = "";

        projectCount.textContent =
            projects.length;

        activeProjectCount.textContent =
            projects.filter(
                project => project.active
            ).length;


        if (projects.length === 0) {

            creatorProjects.innerHTML = `
                <div class="empty-projects">
                    <span>📂</span>
                    <h3>No projects yet</h3>
                    <p>Add your first project.</p>
                </div>
            `;

            return;
        }


        projects.forEach(function (project) {

            const card =
                document.createElement("div");

            card.className =
                "creator-project-card";


            card.innerHTML = `

                <div class="creator-project-info">

                    <div class="creator-project-title">

                        <h3>
                            ${escapeHTML(project.name)}
                        </h3>

                        ${
                            project.active
                            ? `<span class="active-badge">ACTIVE</span>`
                            : ""
                        }

                    </div>

                    <p>
                        ${escapeHTML(project.description)}
                    </p>

                    <small>
                        ${escapeHTML(project.tech || "No technologies added")}
                    </small>

                </div>


                <div class="creator-project-actions">

                    <button
                        class="edit-project"
                        data-id="${project.id}"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-project"
                        data-id="${project.id}"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            creatorProjects.appendChild(card);

        });


        document
            .querySelectorAll(".edit-project")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        editProject(
                            Number(this.dataset.id)
                        );

                    }
                );

            });


        document
            .querySelectorAll(".delete-project")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        deleteProject(
                            Number(this.dataset.id)
                        );

                    }
                );

            });

    }


    /* =========================
       ADD PROJECT
    ========================= */

    addProjectButton.addEventListener(
        "click",
        function () {

            document.getElementById(
                "editorTitle"
            ).textContent = "Add Project";

            projectForm.reset();

            document.getElementById(
                "projectId"
            ).value = "";

            projectEditor.classList.add(
                "visible"
            );

        }
    );


    /* =========================
       EDIT PROJECT
    ========================= */

    function editProject(id) {

        const project =
            projects.find(
                project => project.id === id
            );

        if (!project) return;


        document.getElementById(
            "editorTitle"
        ).textContent = "Edit Project";


        document.getElementById(
            "projectId"
        ).value = project.id;


        document.getElementById(
            "projectName"
        ).value = project.name;


        document.getElementById(
            "projectDescription"
        ).value = project.description;


        document.getElementById(
            "projectTech"
        ).value = project.tech;


        document.getElementById(
            "projectGithub"
        ).value = project.github;


        document.getElementById(
            "projectLive"
        ).value = project.live;


        document.getElementById(
            "projectActive"
        ).checked = project.active;


        projectEditor.classList.add(
            "visible"
        );

    }


    /* =========================
       SAVE PROJECT
    ========================= */

    projectForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "projectId"
                ).value;


            const projectData = {

                id: id
                    ? Number(id)
                    : Date.now(),

                name:
                    document.getElementById(
                        "projectName"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "projectDescription"
                    ).value.trim(),

                tech:
                    document.getElementById(
                        "projectTech"
                    ).value.trim(),

                github:
                    document.getElementById(
                        "projectGithub"
                    ).value.trim(),

                live:
                    document.getElementById(
                        "projectLive"
                    ).value.trim(),

                active:
                    document.getElementById(
                        "projectActive"
                    ).checked

            };


            if (id) {

                const index =
                    projects.findIndex(
                        project =>
                            project.id === Number(id)
                    );

                if (index !== -1) {

                    projects[index] =
                        projectData;

                }

            } else {

                projects.push(projectData);

            }


            saveProjects();

            renderProjects();

            projectEditor.classList.remove(
                "visible"
            );

        }
    );


    /* =========================
       DELETE PROJECT
    ========================= */

    function deleteProject(id) {

        const project =
            projects.find(
                project => project.id === id
            );

        if (!project) return;


        const confirmed =
            confirm(
                `Delete "${project.name}"?`
            );


        if (!confirmed) return;


        projects =
            projects.filter(
                project =>
                    project.id !== id
            );


        saveProjects();

        renderProjects();

    }


    /* =========================
       CLOSE EDITOR
    ========================= */

    function closeProjectEditor() {

        projectEditor.classList.remove(
            "visible"
        );

    }


    closeEditor.addEventListener(
        "click",
        closeProjectEditor
    );


    cancelEditor.addEventListener(
        "click",
        closeProjectEditor
    );


    /* =========================
       ESC KEY
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                projectEditor.classList.remove(
                    "visible"
                );

                creatorOverlay.classList.remove(
                    "visible"
                );

            }

        }
    );


    /* =========================
       SECURITY
    ========================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});