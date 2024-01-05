$(document).ready(function () {
    var currentDate = moment();
    var daterangepickerInput = $('input[name="daterange"]');

    daterangepickerInput.daterangepicker({
        startDate: currentDate,
        endDate: currentDate,
        locale: {
            cancelLabel: "Clear"
        }
    });

    daterangepickerInput.on("apply.daterangepicker", function (ev, picker) {
        $(this).val(picker.startDate.format("DD/MM/YYYY") + " - " + picker.endDate.format("DD/MM/YYYY"));
    });

    daterangepickerInput.on("cancel.daterangepicker", function (ev, picker) {
        $(this).data("daterangepicker").setStartDate(currentDate);
        $(this).data("daterangepicker").setEndDate(currentDate);
        $(this).val(currentDate.format("MM/DD/YYYY") + " - " + currentDate.format("MM/DD/YYYY"));
    });

    $(".search-group").on("click", function () {
        daterangepickerInput.focus();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var searchLink = document.getElementById("search-link");
    var searchText = document.getElementById("search-text");
    searchLink.addEventListener("click", function (event) {
        event.preventDefault();
        var query = encodeURIComponent(searchText.value);
        if (query != "") {
            var url = `/admin/validate-shop/search?text=${query}`;
            window.location.href = url;
        } else {
            var url = `/admin/validate-shop`;
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
});
