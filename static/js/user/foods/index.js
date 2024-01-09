var searchInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function () {
    var searchValue = searchInput.value;
    var keyword = document.getElementById("keyword");
    keyword.value = searchValue;
    $("#searchForm").submit();
});
document.addEventListener("DOMContentLoaded", function () {
    var prevPageAnchor = document.getElementById("prevPage");
    var nextPageAnchor = document.getElementById("nextPage");
    //
    var currentUrlPrev = new URL(window.location);
    var urlParamsPrev = new URLSearchParams(currentUrlPrev.search);
    var searchTextPrev = urlParamsPrev.get("text");
    if (searchTextPrev) {
        urlParamsPrev.set("text", searchTextPrev);
    }
    urlParamsPrev.set("page", prev);
    currentUrlPrev.search = urlParamsPrev.toString();
    prevPageLink = currentUrlPrev.toString();
    if (prevPageAnchor) {
        prevPageAnchor.href = prevPageLink;
    }
    //
    var currentUrlNext = new URL(window.location);
    var urlParamsNext = new URLSearchParams(currentUrlNext.search);
    var searchTextNext = urlParamsNext.get("text");
    if (searchTextNext) {
        urlParamsPrev.set("text", searchTextNext);
    }
    urlParamsNext.set("page", next);
    currentUrlNext.search = urlParamsNext.toString();
    nextPageLink = currentUrlNext.toString();
    if (nextPageAnchor) {
        nextPageAnchor.href = nextPageLink;
    }
    console.log(prevPageLink);
    console.log(nextPageLink);
});
