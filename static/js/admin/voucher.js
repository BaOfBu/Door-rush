var removeButtons = document.getElementsByClassName("remove-btn");
for (var i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function (event) {
        window.alert("Xóa thành công");
        window.location.reload(true);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    var currentUrl = new URL(window.location);
    var urlParams = new URLSearchParams(currentUrl.search);
    let text = urlParams.get("text");
    let status = urlParams.get("status");
    if (!status) {
        status = "None";
    }
    var searchLink = document.getElementById("search-link");
    var searchText = document.getElementById("search-text");
    var statusSelect = document.getElementById("status");
    searchText.value = text;
    statusSelect.value = status;
    var nextBtn = document.getElementById("next");
    if (nextBtn != null) {
        nextBtn.addEventListener("click", function (event) {
            event.preventDefault();
            var currentUrl = new URL(window.location);
            var urlParams = new URLSearchParams(currentUrl.search);
            let page = urlParams.get("page");
            if (!page) {
                window.location.href = window.location.href + "&page=" + next;
            } else {
                urlParams.set("page", next);
                currentUrl.search = urlParams.toString();
                window.location.href = currentUrl.toString();
            }
        });
    }
    var prevBtn = document.getElementById("prev");
    if (prevBtn != null) {
        prevBtn.addEventListener("click", function (event) {
            event.preventDefault();
            var currentUrl = new URL(window.location);
            var urlParams = new URLSearchParams(currentUrl.search);
            let page = urlParams.get("page");
            if (!page) {
                window.location.href = window.location.href + "&page=" + prev;
            } else {
                urlParams.set("page", prev);
                currentUrl.search = urlParams.toString();
                window.location.href = currentUrl.toString();
            }
        });
    }
    searchLink.addEventListener("click", function (event) {
        event.preventDefault();
        let query = searchText.value.trim();
        let status = statusSelect.value;
        if (status == "None") status = "";
        const url = `/admin/voucher?text=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`;
        window.location.href = url;
    });
    searchText.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchLink.click();
        }
    });
    statusSelect.addEventListener("change", function (event) {
        event.preventDefault();
        let query = searchText.value.trim();
        let status = statusSelect.value;
        if (status == "None") status = "";
        const url = `/admin/voucher?text=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`;
        window.location.href = url;
    });
});
