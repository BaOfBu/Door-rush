$(document).ready(function () {
    $("#form-validate").on("submit", function (e) {
        e.preventDefault();
        // Data
        let shopName = $("#nameOfShop").val();
        let cccd = $("#cardId").val();
        let email = $("#email").val();
        // Get the current URL's path
        const path = window.location.pathname;
        // Split the path into segments
        const pathSegments = path.split("/");
        let itemId = pathSegments[3];
        $.getJSON(`/admin/validate-shop/${itemId}/checkValidate`, {
            shopName: shopName,
            cccd: cccd,
            email: email
        }).done(function (data) {
            if (data === false) {
                alert("Thông tin không hợp lệ!!!");
            } else {
                alert("Thông tin đã được kiểm tra hoàn tất!!!");
            }
        });
    });
});
