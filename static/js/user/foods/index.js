var searchInput = document.getElementById('searchInput');
var searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', function () {
    var searchValue = searchInput.value;
    var keyword = document.getElementById('keyword');
    keyword.value = searchValue;
    $('#searchForm').submit();
});