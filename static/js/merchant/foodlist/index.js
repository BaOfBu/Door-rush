// Lấy các phần tử DOM
const addCategoryBtn = document.getElementById('addCategoryBtn');
const modalCategory = document.getElementById('modalCategory');
const categoryList = document.getElementById('categoryList');
const categoryInput = document.getElementById('categoryInput');
// const addCategory = document.getElementById('addCategory');
const closeCategory = document.getElementById('closeCategory');

const modalProduct = document.getElementById('modalProduct');
const closeProduct = document.getElementById('closeProduct');

const modalProductDetail = document.getElementById('modalProductDetail');
const viewProductBtn = document.getElementById('viewProductBtn');
const closeProductDetail = document.getElementById('closeProductDetail');

let options = [];
let productDetail = null;

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

    function isExistFoodTypeUnvalid(){
        if(options.length === 0) return -2;
        for(let i = 0; i < options.length; i++){
            if(options[i].product === "" || options[i].maxQuantity === "" || options[i].price === "") return i;
        }
        return -1;
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
            const indexUnvalid = isExistFoodTypeUnvalid();
            if(indexUnvalid === -2){
                alert("Phải có ít nhất một lựa chọn của sản phẩm");
            }else if(indexUnvalid === -1){
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
            }else{
                const dropdownMenu = document.querySelector('.options .custom-dropdown-menu');

                const existingOptionsCount = dropdownMenu.querySelectorAll('li').length;
            
                const choice = indexUnvalid + 1;
                alert("Vui lòng điền đầy đủ thông tin và lưu lựa chọn " + choice);

                const optionCurrent = document.querySelector(`.custom-dropdown-menu li:nth-child(${choice})`);
                handleOptionClick(optionCurrent, indexUnvalid);
            }
            
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

// $("#viewProductBtn").on('click', function(){
//     modalProductDetail.style.display = 'block';
// });

$('.btn-detail').click(function() {
    modalProductDetail.style.display = 'block';
    // Lấy giá trị thuộc tính dữ liệu data-food-id
    const foodId = $(this).data('food-id');

    // Sử dụng giá trị foodId để xác định sản phẩm tương ứng
    console.log('Nút "Xem chi tiết" của sản phẩm có ID:', foodId);
    displayProductContent();
    // $('#modalProductDetail-' + foodId).modal('show');
    // Thực hiện các hành động khác dựa trên foodId nếu cần
    $('#fuMain2').fileinput({
        dropZoneEnabled: false,
        maxFileCount: 1,
        allowedFileExtensions: ['jpg', 'png', 'gif'],
        language: 'vi',
    });

    // $('#productNameDetail').val(productDetail.name);
    // $('#productName').val('123');
    function displayProductContent(){
        const merchantId = $('#merchantId').val();
        const apiUrl = '/merchant/products/get-product';
        
        console.log("Đã vô display");
        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ merchantId: merchantId, productId: foodId}),
            success: function (data) {
                console.log("Đã lấy dl success");
                console.log("data: ", data);
                console.log("data product: ", data.product);
                const product = data.product;
                productDetail = product;
                options = product.foodType;

                console.log(productDetail);
                $('#productNameDetail').val(productDetail.name);
                $("#img-old").attr("src", productDetail.image);
                $('#dropdownCategoryProductDetail').text(productDetail.category);
                $('#descriptionDetail').val(productDetail.description);

                const choice = options.length - 1;
                $('#dropdownItemDetail').text("Lựa chọn " + options.length);
                console.log(choice);
                $('#optionNameDetail').val(options[choice].product);
                $('#priceDetail').val(options[choice].price);
                $('#quantityDetail').val(options[choice].maxQuantity);
                $('#statusItemDetail').text(options[choice].status);

                $("#selectedProductCategoryDetail").val(productDetail.category);
                console.log("THÀNH CÔNG");

                for(let i = 0; i<options.length; i++){
                    addOldOptional(i+1, options[0].product, options[0].price, options[0].maxQuantity, options[0].status);
                }
                
                // if($('#statusItemDetail').text() === "Hết hàng"){
                //     $('#unavailableDetail').addClass('active');
                //     $('#availableDetail').removeClass('active');
                // }else{
                //     $('#availableDetail').addClass('active');
                //     $('#unavailable').removeClass('active');
                // }
            },
            error: function (error) {
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            }
        });
        

    }
    
    async function uploadProductImageDetail(productId) {
        const fileInput = $("#fuMain2")[0].files[0];
        if (!fileInput) {
          console.log('No file selected.');
          return;
        }
      
        console.log("fileInput: ", fileInput);
        const formData = new FormData();
        formData.append('image', fileInput);
        formData.append('productName', $('#productNameDetail').val());
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

    function isExistFoodTypeUnvalid(){
        if(options.length === 0) return -2;
        for(let i = 0; i < options.length; i++){
            if(options[i].product === "" || options[i].maxQuantity === "" || options[i].price === "") return i;
        }
        return -1;
    }

    $('#availableDetail').on('click', function(){
        $('#statusItemDetail').text("Còn hàng");
        $('#availableDetail').addClass('active');
        $('#unavailable').removeClass('active');
    });
    
    $('#unavailableDetail').on('click', function(){
        $('#statusItemDetail').text("Hết hàng");
        $('#unavailableDetail').addClass('active');
        $('#availableDetail').removeClass('active');
    });

    $(".checkboxProductCategoryDetail .custom-checkbox").change(function() {
        let selectedOptions = [];
      
        $(".category-checkbox:checked").each(function() {
          selectedOptions.push($(this).data("value"));
        });
      
        // if (selectedOptions.length > 3) {
        //   $(this).prop('checked', false);
        //   return;
        // }
      
        $("#dropdownCategoryProductDetail").text(selectedOptions.length > 0 ? selectedOptions.join(", ") : "Chọn các danh mục cho sản phẩm của bạn.");
      
        $("#selectedProductCategoryDetail").val(selectedOptions.join(", "));
    
        if(checkCategoriesProductDetail() === false){
            $('#dropdownCategoryProductDetail').addClass("is-invalid");
            $("#checkValidationCategoriesProductDetail").show();
        }else{
            $('#dropdownCategoryProductDetail').removeClass("is-invalid");
            $("#checkValidationCategoriesProductDetail").hide();
        }
    });

    $('#deleteProductDetail').on('click', function(){
        const product = productDetail;
        const merchantId = $('#merchantId').val();

        const apiUrl = '/merchant/products/delete-product';
        console.log("merchantId: ", merchantId);
        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify({ merchantId: $('#merchantId').val(), product: product }),
            success: function (data) {
                if(data.productDelete){
                    alert("Xóa sản phẩm thành công");
                }
                // location.reload();
            },
            error: function (error) {
                console.error('Lỗi khi xóat sản phẩm:', error);
            }
        });
    });

    $('#deleteOptionDetail').on('click', function(){
        const product = productDetail;
        let option = $('#dropdownItemDetail').text();
        let split = option.split(" ");
        let index = split[2];

        const optionId = options[index - 1].id;

        const apiUrl = '/merchant/products/delete-option';
        console.log("merchantId: ", merchantId);
        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify({ merchantId: $('#merchantId').val(), product: product, optionId: optionId }),
            success: function (data) {
                if(data.productDelete){
                    alert("Xóa lựa chọn thành công");
                }
                // location.reload();
            },
            error: function (error) {
                console.error('Xảy ra lỗi khi xóa lựa chọn:', error);
            }
        });
    });

    function checkCategoriesProductDetail(){
        let categories = $('#selectedProductCategoryDetail').val();
        console.log(categories);
        if(categories === '' || categories === "Chọn các danh mục cho sản phẩm của bạn."){
          return false;
        }
        return true;
    }

    function handleOptionClickDetail(option, index) {
        // Access option properties or perform actions based on the click
        // For example, you can toggle a class, update some data, etc.
        // $(option).toggleClass('selected');
        $('.optionDetail .custom-dropdown-menu .dropdown-item').removeClass('active');
        $(option).addClass('active');
        const optionName = index + 1;
        $('#dropdownItemDetail').text('Lựa chọn ' + optionName);
    
        console.log('Option clicked:', option.textContent);
    
        console.log("options: ", options);
        console.log("index: ", index);
        if(options[index]){
            const product = options[index].product;
            const price = options[index].price;
            const maxQuantity = options[index].maxQuantity;
            const status = options[index].status;
    
            $('#optionNameDetail').val(product);
            $('#priceDetail').val(price);
            $('#quantityDetail').val(maxQuantity);
            $('#statusItemDetail').text(status);
            
            if(status === 'Còn hàng'){
                $('#availableDetail').addClass('active');
                $('#unavailableDetail').removeClass('active');
            }else{
                $('#unavailableDetail').addClass('active');
                $('#availableDetail').removeClass('active');   
            }
        }else{
            $('#optionNameDetail').val("");
            $('#priceDetail').val("");
            $('#quantityDetail').val("");
            $('#statusItemDetail').text("Hết hàng");
            $('#unavailableDetail').addClass('active');
            $('#availableDetail').removeClass('active'); 
        }
        
    }

    $('#saveOptionDetail').on('click', function(){
        const product = $('#optionNameDetail').val();
        let isValid = true;
        if(product.length === 0 || product.length > 50){
            $('#optionNameDetail').addClass("is-invalid");
            $("#checkValidationOptionNameDetail").show();
            $('#optionNameDetail').focus();
            isValid = false;
        }
    
        const price = $('#priceDetail').val();
        if(price.length === 0){
            $('#priceDetail').addClass("is-invalid");
            $("#checkValidationPriceDetail").show();
            if(isValid) $('#price').focus();
            isValid = false;
        }
    
        const maxQuantity = $('#quantityDetail').val();
        if(maxQuantity.length === 0){
    
            $('#quantityDetail').addClass("is-invalid");
            $("#checkValidationQuantityDetail").show();
            if(isValid) $('#quantityDetail').focus();
            isValid = false;
        }
    
        const status = $('#statusItemDetail').text();
    
        if(isValid){
            let quantity = maxQuantity;
            if(status === "Hết hàng") quantity = 0;
            let option = {
                id: -1,
                product: product,
                price: price,
                maxQuantity: maxQuantity,
                quantity: quantity,
                status: status,
            }
    
            const choice = $('#dropdownItemDetail').text();
            console.log("choice: ", choice);
    
            const split = choice.split(" ");
            console.log(split);
    
            const index = split[2];
    
            options[index - 1] = option;
            // alert("Cập nhật lựa chọn thành công");
            // console.log("options after: ", options);
    
            if(index - 1 <= options.length - 1){
                options[index - 1] = option;
                alert("Cập nhật lựa chọn thành công");
            }else{
                options.push(option);
                alert("Lưu lựa chọn thành công");
            }
        }
    });

    $('#updateProduct').on('click', function(){
        let isValid = true;
    
        const name = $('#productNameDetail').val();
        productDetail.name = name;

        if(name.length === 0 || name.length > 50){
            $('#productNameDetail').addClass("is-invalid");
            $("#checkValidationNameDetail").show();
            $('#productNameDetail').focus();
            isValid = false;
        }
    
        // const image = $("#fuMain2")[0].files[0];
        // if(image.length === 0){
        //     $('#fuMain2').addClass("is-invalid");
        //     $("#checkValidationNameDetail").show();
        //     if(isValid) $('#fuMain2').focus();
        //     isValid = false;
        // }
    
        const category = $('#selectedProductCategoryDetail').val();
        productDetail.category = category;
        if(category.length === 0 || category === "Chọn các danh mục cho sản phẩm của bạn."){
            $('#dropdownCategoryProductDetail').addClass("is-invalid");
            $("#checkValidationCategoriesProductDetail").show();
            if(isValid) $('#dropdownCategoryProductDetail').focus();
            isValid = false;
        }
    
        const description = $("#descriptionDetail").val();
        productDetail.description = description;
        if(description.length === 0){
            $('#descriptionDetail').addClass("is-invalid");
            $("#checkValidationDescriptionDetail").show();
            if(isValid) $('#descriptionDetail').focus();
            isValid = false;
        }
    
        productDetail.foodType = options;
        if(isValid){
            const indexUnvalid = isExistFoodTypeUnvalid();
            if(indexUnvalid === -2){
                alert("Phải có ít nhất một lựa chọn của sản phẩm");
            }else if(indexUnvalid === -1){
                const merchantId = $('#merchantId').val();
                console.log("DETAIL: ", productDetail);
                const apiUrl = '/merchant/products/update-product';
        
                $.ajax({
                    url: apiUrl,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ merchantId: merchantId, product: productDetail}),
                    success: async function (data) {
                        await uploadProductImageDetail(data.foodId);
                        alert("Cập nhật thành công sản phẩm");
                        // location.reload();
                    },
                    error: function (error) {
                        console.error('Lỗi khi cập nhật sản phẩm:', error);
                    }
                });
            }else{
                const dropdownMenu = document.querySelector('.optionDetail .custom-dropdown-menu');

                const existingOptionsCount = dropdownMenu.querySelectorAll('li').length;
            
                const choice = indexUnvalid + 1;
                alert("Vui lòng điền đầy đủ thông tin và lưu lựa chọn " + choice);

                const optionCurrent = document.querySelector(`.optionDetail .custom-dropdown-menu li:nth-child(${choice})`);
                handleOptionClickDetail(optionCurrent, indexUnvalid);
            }
            
        }
    });

    $('#addOptionBtnDetail').on('click', function(){
        const dropdownMenu = document.querySelector('.optionDetail .custom-dropdown-menu');
    
        const existingOptionsCount = dropdownMenu.querySelectorAll('li').length;
    
        if(existingOptionsCount - 1 === options.length || existingOptionsCount === 1){
            console.log("vô 1");
            addNewOptionDetail();
        }else{
            const choice = options.length + 1;
            alert("Vui lòng điền đầy đủ thông tin và lưu lựa chọn " + choice);
            if(options.length > 1){
                const optionCurrent = $('.optionDetail .custom-dropdown-menu li:last').before();
                // console.log(optionCurrent.textContent);
                handleOptionClickDetail(optionCurrent, options.length);
            }
        }
        
    })
    
    $("#closeProductDetail").on('click', function() {
        // Ẩn modal
        modalProductDetail.style.display = 'none';
    });
    
    $("#recommendDetail").on('click', function() {
        const apiUrl = '/merchant/products/update-recommend';
        
        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ merchantId: $('#merchantId').val(), product: productDetail}),
            success: async function (data) {
                alert("Recommend sản phẩm thành công");
                // location.reload();
            },
            error: function (error) {
                console.error('Lỗi khi recommend sản phẩm:', error);
            }
        });
    })
    function addOldOptional(stt){
        const newOption = document.createElement('li');
        const newOptionContent = document.createElement('div');
        newOptionContent.classList.add('dropdown-item');

        const dropdownMenu = document.querySelector('.optionDetail .custom-dropdown-menu');
    
        const existingOptionsCount = dropdownMenu.querySelectorAll('li').length;

        const text = document.createElement('span');
        text.textContent = 'Lựa chọn ' + stt;

        newOptionContent.appendChild(text);
        newOption.appendChild(newOptionContent);

        existingOptionsCount

        newOptionContent.addEventListener('click', function() {
            // Handle the click event
            handleOptionClickDetail(this, existingOptionsCount - 1);
        });
        
        const existingLi = $('.optionDetail .custom-dropdown-menu li:last');
        existingLi.before(newOption);

        if(stt === options.length){
            $(newOptionContent).addClass('active');
        }
    }
    // Add a new option above the existing ones in the dropdown menu
    function addNewOptionDetail() {
        const dropdownMenu = document.querySelector('.optionDetail .custom-dropdown-menu');
    
        const existingOptionsCount = dropdownMenu.querySelectorAll('li').length;

        const addOptionLi = $('#addOptionBtnDetail').closest('li');
        const optionPrevLi = addOptionLi.prev();
        optionPrevLi.find('.dropdown-item').removeClass('active');

        const newOption = document.createElement('li');
        const newOptionContent = document.createElement('div');
        newOptionContent.classList.add('dropdown-item', 'active');
        // const icon = document.createElement('i');
        // icon.className = 'bi bi-plus';
        const text = document.createElement('span');
        text.textContent = 'Lựa chọn ' + existingOptionsCount;

        // Append the elements to the new option
        // newOptionContent.appendChild(icon);
        newOptionContent.appendChild(text);
        newOption.appendChild(newOptionContent);

        newOptionContent.addEventListener('click', function() {
            // Handle the click event
            handleOptionClickDetail(this, existingOptionsCount - 1);
        });
        
        const existingLi = $('.optionDetail .custom-dropdown-menu li:last');
        existingLi.before(newOption);

        $('#dropdownItemDetail').text(text.textContent);
        $('#optionNameDetail').val("");
        $('#priceDetail').val("");
        $('#quantityDetail').val("");
        // $('#description').val("");
        $('#availableDetail').removeClass('active');
        $('#unavailableDetail').addClass('active');
        $('#statusItemDetail').text("Hết hàng");

    }
});

$("#closeCategory").on('click', function() {
    modalCategory.style.display = 'none';
});

$("#closeProduct").on('click', function() {
    modalProduct.style.display = 'none';
});


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

    if(existingOptionsCount - 1 === options.length || existingOptionsCount === 1){
        addNewOption();
    }else{
        const choice = options.length + 1;
        alert("Vui lòng điền đầy đủ thông tin và lưu lựa chọn " + choice);
        if(options.length > 1){
            const optionCurrent = $('.options .custom-dropdown-menu li:last').before();
            handleOptionClick(optionCurrent, options.length - 1);
        }

    }
    
    // Add a new option above the existing ones in the dropdown menu
    function addNewOption() {
        const addOptionLi = $('#addOptionBtn').closest('li');
        const optionPrevLi = addOptionLi.prev();
        optionPrevLi.find('.dropdown-item').removeClass('active');

        const newOption = document.createElement('li');
        const newOptionContent = document.createElement('div');
        newOptionContent.classList.add('dropdown-item', 'active');
        // const icon = document.createElement('i');
        // icon.className = 'bi bi-plus';
        const text = document.createElement('span');
        text.textContent = 'Lựa chọn ' + existingOptionsCount;

        // Append the elements to the new option
        // newOptionContent.appendChild(icon);
        newOptionContent.appendChild(text);
        newOption.appendChild(newOptionContent);

        newOptionContent.addEventListener('click', function() {
            // Handle the click event
            handleOptionClick(this, existingOptionsCount - 1);
        });
        
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

function handleOptionClick(option, index) {
    // Access option properties or perform actions based on the click
    // For example, you can toggle a class, update some data, etc.
    // $(option).toggleClass('selected');
    $('.custom-dropdown-menu .dropdown-item').removeClass('active');
    $(option).addClass('active');
    const optionName = index + 1;
    $('#dropdownItem').text('Lựa chọn ' + optionName);

    console.log('Option clicked:', option.textContent);

    console.log("options: ", options);
    if(options[index]){
        const product = options[index].product;
        const price = options[index].price;
        const maxQuantity = options[index].maxQuantity;
        const status = options[index].status;

        $('#optionName').val(product);
        $('#price').val(price);
        $('#quantity').val(maxQuantity);
        $('#statusItem').text(status);
        
        if(status === 'Còn hàng'){
            $('#available').addClass('active');
            $('#unavailable').removeClass('active');
        }else{
            $('#unavailable').addClass('active');
            $('#available').removeClass('active');   
        }
    }else{
        $('#optionName').val("");
        $('#price').val("");
        $('#quantity').val("");
        $('#statusItem').text("Hết hàng");
        $('#unavailable').addClass('active');
        $('#available').removeClass('active'); 
    }
    
    // Add more logic as needed
}

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

$('#saveOption').on('click', function(){
    const product = $('#optionName').val();
    let isValid = true;
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
    if(maxQuantity.length === 0){

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

        const choice = $('#dropdownItem').text();
        console.log("choice: ", choice);

        const split = choice.split(" ");
        console.log(split);

        const index = split[2];

        options[index - 1] = option;
        // alert("Cập nhật lựa chọn thành công");
        // console.log("options after: ", options);

        if(index - 1 <= options.length - 1){
            options[index - 1] = option;
            alert("Cập nhật lựa chọn thành công");
        }else{
            options.push(option);
            alert("Lưu lựa chọn thành công");
        }
    }
})

$('#resetQuantity').on('click', function(){
    const apiUrl = '/merchant/products/reset-quantity';
    const merchantId = $("#merchantId").val();

    $.ajax({
        url: apiUrl,
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify({ merchantId: merchantId }),
        success: function (data) {
            alert(data.message);
            location.reload();
        },
        error: function (error) {
            console.error('Lỗi khi cập nhật lại số lượng:', error);
        }
    });
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