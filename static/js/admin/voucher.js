var removeButtons = document.getElementsByClassName("remove-btn");

for (var i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function (event) {
        window.alert("Xóa thành công");
        window.location.reload(true);
    });
}
