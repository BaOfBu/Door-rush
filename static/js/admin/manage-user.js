document.addEventListener("DOMContentLoaded", function () {
    var searchLink = document.getElementById("search-link");
    var searchText = document.getElementById("search-text");
    searchLink.addEventListener("click", function (event) {
        event.preventDefault();
        var query = encodeURIComponent(searchText.value);
        if (query != "") {
            var url = `/admin/manage-user/search?text=${query}`;
            window.location.href = url;
        } else {
            var url = `/admin/manage-user`;
            window.location.href = url;
        }
    });
    var prevPageLink = document.getElementById("prevPageLink");
    if (prevPageLink != null) {
        prevPageLink.addEventListener("click", function (event) {
            event.preventDefault();
            var currentUrl = new URL(window.location);
            var urlParams = new URLSearchParams(currentUrl.search);
            var searchText = urlParams.get("text");
            if (searchText) {
                urlParams.set("text", searchText);
            }
            var newPageNumber = prevPage;
            urlParams.set("page", newPageNumber);
            currentUrl.search = urlParams.toString();
            window.location.href = currentUrl.toString();
        });
    }
    var nextPageLink = document.getElementById("nextPageLink");
    if (nextPageLink != null) {
        nextPageLink.addEventListener("click", function (event) {
            event.preventDefault();
            var currentUrl = new URL(window.location);
            var urlParams = new URLSearchParams(currentUrl.search);
            var searchText = urlParams.get("text");
            if (searchText) {
                urlParams.set("text", searchText);
            }
            var newPageNumber = nextPage;
            urlParams.set("page", newPageNumber);
            currentUrl.search = urlParams.toString();
            window.location.href = currentUrl.toString();
        });
    }
    searchText.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchLink.click();
        }
    });
});
var banButtons = document.getElementsByClassName("detail-btn");
for (var i = 0; i < banButtons.length; i++) {
    banButtons[i].addEventListener("click", function (event) {
        event.preventDefault();
        const userID = this.getAttribute("data-user-id");
        var url = "/admin/manage-user/ban-user?userId=" + userID;
        console.log(url);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userID: userID })
        })
            .then(response => {
                if (response.ok) {
                    window.alert("Chặn người dùng thành công");
                    window.location.reload();
                } else {
                    window.alert("Chặn người dùng thất bại! Vui lòng thử lại sau!");
                }
            })
            .then(data => {})
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });
    });
}
