// Lấy các phần tử DOM
const addCategoryBtn = document.getElementById('addCategoryBtn');
const modalCategory = document.getElementById('modalCategory');
const categoryList = document.getElementById('categoryList');
const categoryInput = document.getElementById('categoryInput');
// const addCategory = document.getElementById('addCategory');
const closeCategory = document.getElementById('closeCategory');

const modalProduct = document.getElementById('modalProduct');
const addProductBtn = document.getElementById('addProductBtn');
const closeProduct = document.getElementById('closeProduct');

const modalProductDetail = document.getElementById('modalProductDetail');
const viewProductBtn = document.getElementById('viewProductBtn');
const closeProductDetail = document.getElementById('closeProductDetail');

$('#addProductBtn').on('click', function() {
    modalProduct.style.display = 'block';
});

$('#addCategoryBtn').on('click', function() {
    modalCategory.style.display = 'block';
});

$("#viewProductBtn").on('click', function(){
    modalProductDetail.style.display = 'block';
});

$("#closeCategory").on('click', function() {
    modalCategory.style.display = 'none';
});

$("#closeProduct").on('click', function() {
    // Ẩn modal
    modalProduct.style.display = 'none';
});

$("#closeProductDetail").on('click', function() {
    // Ẩn modal
    modalProductDetail.style.display = 'none';
});

// Bắt sự kiện khi nhấn vào nút Thêm
// addCategory.addEventListener('click', function() {
//     // Lấy giá trị từ input
//     const newCategory = categoryInput.value;

//     // Kiểm tra xem category có giá trị không
//     if (newCategory.trim() !== '') {
//         // Thực hiện xử lý với category (ở đây là in ra console)
//         console.log('Thêm category mới:', newCategory);

//         // Ẩn modal
//         modalCategory.style.display = 'none';

//         // Reset giá trị của input
//         categoryInput.value = '';

//         // Thêm category mới vào danh sách và hiển thị lại danh sách
//         renderCategoryList(getCategoryList().concat(newCategory));
//     } else {
//         alert('Vui lòng nhập category.');
//     }
// });

function deleteCategory(merchantId, categoryId){
    console.log("Đã delete categoryId: ", categoryId.toString());
    const apiUrl = '/merchant/products/delete-category';

    // Sử dụng jQuery.ajax để thực hiện yêu cầu
    $.ajax({
        url: apiUrl,
        type: 'POST', // Hoặc 'PUT' tùy thuộc vào loại yêu cầu bạn muốn thực hiện
        contentType: 'application/json',
        data: JSON.stringify({ merchantId, categoryId }),
        success: function (data) {
            // Xử lý phản hồi từ máy chủ
            console.log('Xóa category thành công', data);
            alert(data.message);
            location.reload();
            // Cập nhật giao diện người dùng nếu cần
        },
        error: function (error) {
            console.error('Lỗi khi xóa category:', error);
        }
    });
}

function checkCategories(){
    let categories = $('#selectedCategory').val();
    console.log(categories);
    if(categories === '' || categories === "Hãy chọn thêm những loại kinh doanh của cửa hàng bạn (nếu muốn)"){
      return false;
    }
    return true;
}

$(".category-checkbox").change(function() {
    let selectedOptions = [];
  
    $(".category-checkbox:checked").each(function() {
      selectedOptions.push($(this).data("value"));
    });
  
    // if (selectedOptions.length > 3) {
    //   $(this).prop('checked', false);
    //   return;
    // }
  
    $("#dropdownCategory").text(selectedOptions.length > 0 ? selectedOptions.join(", ") : "Hãy chọn thêm những loại kinh doanh của cửa hàng bạn (nếu muốn)");
  
    $("#selectedCategory").val(selectedOptions.join(", "));
});

$('#addCategory').on('click', function(){
    if(checkCategories() === false){
        $('#dropdownCategory').addClass("is-invalid");
        $("#checkValidationCategories").show();
      }else{
        $('#dropdownCategory').removeClass("is-invalid");
        $("#checkValidationCategories").hide();

        const apiUrl = '/merchant/products/update-category';
        const merchantId = $("#merchantId").val();
        const categories = $("#selectedCategory").val();

        console.log(categories);
        $.ajax({
            url: apiUrl,
            type: 'POST', // Hoặc 'PUT' tùy thuộc vào loại yêu cầu bạn muốn thực hiện
            contentType: 'application/json',
            data: JSON.stringify({ merchantId, categories }),
            success: function (data) {
                // Xử lý phản hồi từ máy chủ
                console.log('Thêm categories thành công', data);
                alert(data.message);
                location.reload();
                // Cập nhật giao diện người dùng nếu cần
            },
            error: function (error) {
                console.error('Lỗi khi thêm categories:', error);
            }
        });
    }
})
// Hàm hiển thị danh sách category
// function renderCategoryList(categories) {
//     const categoryList = document.getElementById('categoryList');
//     categoryList.innerHTML = '';

//     categories.forEach(function(category) {
//         const listItem = document.createElement('li');
//         listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
//         const categoryText = document.createElement('span');
//         categoryText.textContent = category;
        
//         const closeButton = document.createElement('button');
//         closeButton.classList.add('btn-close', 'btn-sm');
//         // closeButton.innerHTML = '&times;';
//         closeButton.addEventListener('click', function() {
//             // Xử lý sự kiện khi nút đóng được nhấn
//             // Ở đây có thể là xóa category khỏi danh sách, hoặc thực hiện các tác vụ khác
//             console.log('Đã đóng category:', category);
//         });
        
//         listItem.appendChild(categoryText);
//         listItem.appendChild(closeButton);
        
//         categoryList.appendChild(listItem);
//     });
// }

// Hàm giả định: Lấy danh sách category từ nguồn dữ liệu nào đó
function getCategoryList() {
    return ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'Category 7', 'Category 8', 'Category 9', 'Category 10', 'Category 11', 'Category 12', 'Category 13'];
}

function renderPreviousPage(){
    let nextPage = document.getElementById("previousPage");
    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page') || 1;
    let currentPage = Number(page);
    page = currentPage - 1;
    urlParams.set("page", page);
    nextPage.setAttribute('href', "?" + urlParams);
}
  
  
function renderNextPage(){
    let nextPage = document.getElementById("nextPage");
    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page') || 1;
    let currentPage = Number(page);
    page = currentPage + 1;
    urlParams.set("page", page);
    nextPage.setAttribute('href', "?" + urlParams);
}

$(document).ready(function () {
    console.log("Page is ready!");

    const id = $('#categoryId').val();
    $(`#${id}`).addClass('active');

    let closeButtons = document.querySelectorAll(".btn-close");
    closeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        // Lấy ID của danh mục từ thuộc tính data-category-id
        let categoryId = button.getAttribute("data-category-id");
        // Gọi hàm xử lý xóa danh mục với ID tương ứng
        deleteCategory($('#merchantId').val(), categoryId);
      });
    });
});
