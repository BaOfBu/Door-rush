$(document).ready(function () {
    var currentDate = moment();
    var daterangepickerInput = $('input[name="daterange"]');
    var params = {};
    var parser = new URL(window.location.href);
    parser.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    if (params.dateStart && params.dateEnd) {
        daterangepickerInput.daterangepicker({
            startDate: params.dateStart,
            endDate: params.dateEnd,
            locale: {
                cancelLabel: "Clear",
                format: "DD-MM-YYYY"
            }
        });
    } else {
        daterangepickerInput.daterangepicker({
            locale: {
                cancelLabel: "Clear",
                format: "DD-MM-YYYY"
            }
        });
        daterangepickerInput.val("Chọn ngày để lọc");
    }

    daterangepickerInput.on("apply.daterangepicker", function (ev, picker) {
        var startDate = picker.startDate.format("DD-MM-YYYY");
        var endDate = picker.endDate.format("DD-MM-YYYY");
        if (startDate != "" && endDate != "") {
            var url = `/admin/manage-shop/search?dateStart=${startDate}&dateEnd=${endDate}`;
            window.location.href = url;
        } else {
            var url = `/admin/manage-shop`;
            window.location.href = url;
        }
        $(this).val(startDate + " - " + endDate);
    });

    daterangepickerInput.on("cancel.daterangepicker", function (ev, picker) {
        // $(this).data("daterangepicker").setStartDate(currentDate);
        // $(this).data("daterangepicker").setEndDate(currentDate);
        // $(this).val(currentDate.format("MM/DD/YYYY") + " - " + currentDate.format("MM/DD/YYYY"));
        picker.setStartDate(null);
        picker.setEndDate(null);
        daterangepickerInput.val("Chọn ngày để lọc");
        window.location.href = "/admin/manage-shop";
    });

    $(".search-group").on("click", function () {
        daterangepickerInput.focus();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    sendDataToServer();
    var searchLink = document.getElementById("search-link");
    var searchText = document.getElementById("search-text");
    searchLink.addEventListener("click", function (event) {
        event.preventDefault();
        var query = encodeURIComponent(searchText.value);
        if (query != "") {
            var url = `/admin/manage-shop/search?text=${query}`;
            window.location.href = url;
        } else {
            var url = `/admin/manage-shop`;
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

function sendDataToServer() {
    var detailButtons = document.querySelectorAll(".detail-btn");
    detailButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            var id = this.getAttribute("data-id");
            $.getJSON(`/admin/manage-shop/ban-shop?id=${id}`, function (data) {
                if (data === false) {
                    alert("Báo cáo tài khoản không thành công.");
                } else {
                    alert("Báo cáo tài khoản thành công");
                    window.location.reload();
                }
            });
        });
    });
}
