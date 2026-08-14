document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contact-form");
    const status = document.getElementById("status");

    console.log("SCRIPT.JS LOADED");
    console.log("FORM:", form);

    if (!form) {
        console.error("FORM NOT FOUND");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("FORM SUBMISSION STOPPED");

        if (status) {
            status.textContent = "FORM WORKS - PAGE DID NOT REFRESH!";
        }

    });

});