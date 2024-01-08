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
    $('#fuMain').fileinput({
        dropZoneEnabled: false,
        maxFileCount: 1,
        allowedFileExtensions: ['jpg', 'png', 'gif'],
        language: 'vi',
    });
    
    async function uploadProductImage(productId) {
        const fileInput = $("#fuMain")[0].files[0];
        if (!fileInput) {
          console.error('No file selected.');
          return;
        }
      
        console.log("fileInput: ", fileInput);
        const formData = new FormData();
        formData.append('image', fileInput);
        formData.append('productName', $('#productName').val());
        formData.append('foodId', productId);
        return new Promise((resolve, reject) => {
            $.ajax({
            url: '/merchant/products/upload-product-image',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                // console.log("body: ", req.body);
                // delete req.body.image;
                console.log(data);
                resolve(data);
            },
            error: function(error) {
                console.error('Error:', error);
                reject(error);
            }
            });
        });
    }

    $('#addProduct').on('click', function(){
        let isValid = true;
    
        const name = $('#productName').val();
        if(name.length === 0 || name.length > 50){
            $('#productName').addClass("is-invalid");
            $("#checkValidationName").show();
            $('#productName').focus();
            isValid = false;
        }
    
        const image = $("#fuMain")[0].files[0];
        if(image.length === 0){
            $('#fuMain').addClass("is-invalid");
            $("#checkValidationName").show();
            if(isValid) $('#fuMain').focus();
            isValid = false;
        }
    
        const category = $('#selectedProductCategory').val();
        if(category.length === 0 || category === "Chọn các danh mục cho sản phẩm của bạn."){
            $('#dropdownCategoryProduct').addClass("is-invalid");
            $("#checkValidationCategoriesProduct").show();
            if(isValid) $('#dropdownCategoryProduct').focus();
            isValid = false;
        }
    
        const description = $("#description").val();
        if(description.length === 0){
            $('#description').addClass("is-invalid");
            $("#checkValidationDescription").show();
            if(isValid) $('#description').focus();
            isValid = false;
        }
    
        if(isValid){
            const foodType = options;
            let product = {
                name: name,
                image: image,
                category: category,
                description: description,
                foodType: foodType,
            };
    
            const merchantId = $('#merchantId').val();
    
            const apiUrl = '/merchant/products/add-product';
    
            $.ajax({
                url: apiUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ merchantId: merchantId, product: product}),
                success: async function (data) {
                    await uploadProductImage(data.foodId);
                    alert("Thêm thành công sản phẩm");
                    // location.reload();
                },
                error: function (error) {
                    console.error('Lỗi khi thêm sản phẩm:', error);
                }
            });
        }
            // product.name = $('#productName').val();
            // product.image = $("#fuMain")[0].files[0];
            // product.description = $("#description").val();
            // product.category = $('#selectedProductCategory').val();
            // product.foodType = options;
    })
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

$(".checkboxCategory .custom-checkbox").change(function() {
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

function checkCategoriesProduct(){
    let categories = $('#selectedProductCategory').val();
    console.log(categories);
    if(categories === '' || categories === "Chọn các danh mục cho sản phẩm của bạn."){
      return false;
    }
    return true;
}

$(".checkboxProductCategory .custom-checkbox").change(function() {
    let selectedOptions = [];
  
    $(".category-checkbox:checked").each(function() {
      selectedOptions.push($(this).data("value"));
    });
  
    // if (selectedOptions.length > 3) {
    //   $(this).prop('checked', false);
    //   return;
    // }
  
    $("#dropdownCategoryProduct").text(selectedOptions.length > 0 ? selectedOptions.join(", ") : "Chọn các danh mục cho sản phẩm của bạn.");
  
    $("#selectedProductCategory").val(selectedOptions.join(", "));

    if(checkCategoriesProduct() === false){
        $('#dropdownCategoryProduct').addClass("is-invalid");
        $("#checkValidationCategoriesProduct").show();
    }else{
        $('#dropdownCategoryProduct').removeClass("is-invalid");
        $("#checkValidationCategoriesProduct").hide();
    }
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

$('#addOptionBtn').on('click', function(){
    const dropdownMenu = document.querySelector('.options .custom-dropdown-menu');

    const existingOptionsCount = dropdownMenu.querySelectorAll('li').length;

    addNewOption();
    // Add a new option above the existing ones in the dropdown menu
    function addNewOption() {
        const addOptionLi = $('#addOptionBtn').closest('li');
        const optionPrevLi = addOptionLi.prev();
        optionPrevLi.find('.dropdown-item').removeClass('active');

        const newOption = document.createElement('li');
        const newOptionContent = document.createElement('div');
        newOptionContent.classList.add('dropdown-item', 'active');
        const icon = document.createElement('i');
        icon.className = 'bi bi-plus';
        const text = document.createElement('span');
        text.textContent = ' Lựa chọn ' + existingOptionsCount;

        // Append the elements to the new option
        newOptionContent.appendChild(icon);
        newOptionContent.appendChild(text);
        newOption.appendChild(newOptionContent);
        
        const existingLi = $('.options .custom-dropdown-menu li:last');
        existingLi.before(newOption);

        $('#dropdownItem').text(text.textContent);
        $('#optionName').val("");
        $('#price').val("");
        $('#quantity').val("");
        // $('#description').val("");
        $('#available').removeClass('active');
        $('#unavailable').addClass('active');
        $('#statusItem').text("Hết hàng");

    }
})

$('#available').on('click', function(){
    $('#statusItem').text("Còn hàng");
    $('#available').addClass('active');
    $('#unavailable').removeClass('active');
})

$('#unavailable').on('click', function(){
    $('#statusItem').text("Hết hàng");
    $('#unavailable').addClass('active');
    $('#available').removeClass('active');
})

let options = [];

$('#saveOption').on('click', function(){
    const product = $('#optionName').val();
    const isValid = true;
    if(product.length === 0 || product.length > 50){
        $('#optionName').addClass("is-invalid");
        $("#checkValidationOptionName").show();
        $('#optionName').focus();
        isValid = false;
    }

    const price = $('#price').val();
    if(price.length === 0){
        $('#price').addClass("is-invalid");
        $("#checkValidationPrice").show();
        if(isValid) $('#price').focus();
        isValid = false;
    }

    const maxQuantity = $('#quantity').val();
    if(quantity.length === 0 ){
        $('#quantity').addClass("is-invalid");
        $("#checkValidationQuantity").show();
        if(isValid) $('#quantity').focus();
        isValid = false;
    }

    const status = $('#statusItem').text();

    if(isValid){
        let quantity = maxQuantity;
        if(status === "Hết hàng") quantity = 0;
        let option = {
            product: product,
            price: price,
            maxQuantity: maxQuantity,
            quantity: quantity,
            status: status,
        }
        options.push(option);
        alert("Lưu lựa chọn thành công");
    }
})


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