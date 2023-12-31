$(document).ready(function () {
    $("#form-validate").on("submit", function (e) {
        e.preventDefault();
        // Get the current URL's path
        const path = window.location.pathname;
        // Split the path into segments
        const pathSegments = path.split("/");
        let itemId = pathSegments[3];
        console.log(itemId);
        $.getJSON(`/admin/validate-shop/${itemId}/checkValidate`).done(function (data) {});
    });
});
