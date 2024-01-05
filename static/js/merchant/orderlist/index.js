document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('optional');
    if(page === 'history'){
        const status = urlParams.get('status');
        const start = urlParams.get('startDate');
        const end = urlParams.get('endDate');

        if(start === "" || end === ""){
            let startDate = localStorage.getItem('selectedStartDate');
            startDate = startDate.replace(/[^\d-]/g, "");
            let endDate = localStorage.getItem('selectedEndDate');
            endDate = endDate.replace(/[^\d-]/g, "");

            if(startDate !== null && endDate !== null){
              $('#timeRange').val(moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' - ' + moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
              const newUrl = `/merchant/orders?optional=history&status=${status}&startDate=${startDate}&endDate=${endDate}&page=1`;
              window.location.href = newUrl;
            }
        }else{
            const startDate = localStorage.getItem('selectedStartDate');
            const endDate = localStorage.getItem('selectedEndDate');
    
            if(startDate !== null && endDate !== null){
              $('#timeRange').val(moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' - ' + moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
            }
        }
    }
});

function setActiveLink(page) {
    let navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        let linkUrl = link.getAttribute('href');
        let spanElement = link.querySelector('span');

        // Remove "active" class from all spans
        spanElement.classList.remove('active');

        // Check if the link matches the current URL
        if (page.includes(linkUrl)) {
            // Add the "active" class to the corresponding span
            spanElement.classList.add('active');
        }
    });
};

function renderPreviousPage(){
    let nextPage = document.getElementById("previousPage");
    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page');
    let currentPage = Number(page);
    page = currentPage - 1;
    urlParams.set("page", page);
    nextPage.setAttribute('href', "?" + urlParams);
}
  
  
function renderNextPage(){
    let nextPage = document.getElementById("nextPage");
    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page');
    let currentPage = Number(page);
    page = currentPage + 1;
    urlParams.set("page", page);
    nextPage.setAttribute('href', "?" + urlParams);
}

$('#btnComplete').click(function () {
    const orderId = $('#orderId').val();
    const newStatus = 'Hoàn thành';

    // Gọi hàm để thực hiện yêu cầu
    changeOrderStatus(orderId, newStatus);
});

$('#btnCancel').click(function () {
    const orderId = $('#orderId').val();
    const newStatus = 'Đã hủy';
    let isConfirmed = confirm('Bạn có chắc chắn muốn hủy đơn hàng không?');

    if (isConfirmed) {
        changeOrderStatus(orderId, newStatus);
    } 
});

$('#btnDelivery').click(function () {
    const orderId = $('#orderId').val();
    const newStatus = 'Đang giao';

    // Gọi hàm để thực hiện yêu cầu
    changeOrderStatus(orderId, newStatus);
});

function changeOrderStatus(orderId, newStatus) {
    // Địa chỉ API hoặc endpoint xử lý thay đổi trạng thái
    const apiUrl = '/merchant/orders/change-order-status';

    // Sử dụng jQuery.ajax để thực hiện yêu cầu
    $.ajax({
        url: apiUrl,
        type: 'POST', // Hoặc 'PUT' tùy thuộc vào loại yêu cầu bạn muốn thực hiện
        contentType: 'application/json',
        data: JSON.stringify({ orderId, newStatus }),
        success: function (data) {
            // Xử lý phản hồi từ máy chủ
            console.log('Trạng thái đơn hàng đã được thay đổi:', data);
            location.reload();
            // Cập nhật giao diện người dùng nếu cần
        },
        error: function (error) {
            console.error('Lỗi khi thay đổi trạng thái đơn hàng:', error);
        }
    });
}
