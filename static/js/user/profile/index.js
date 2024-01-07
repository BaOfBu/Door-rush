document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('optional');
  const start = urlParams.get('startDate');
  const end = urlParams.get('endDate');

  let startDate;
  let endDate;

  const statusFilter = urlParams.get('status') || "all";
  
  if(page === 'history'){
    
    startDate = localStorage.getItem('selectedStartDate');
    endDate = localStorage.getItem('selectedEndDate');
    if(startDate !== null && endDate !== null){
      $('#timeRange').val(moment(startDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' - ' + moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
    }
    setActiveStatusFilter(statusFilter);
  }
  
  showContent(page);
  setActiveLink(page);

  function showContent(contentId) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
      content.style.display = 'none';
    });
  
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
      selectedContent.style.display = 'block';
    }
  
    if(contentId === 'history' && startDate !== null && endDate != null){
      startDate = startDate.replace(/[^\d-]/g, "");
      endDate = endDate.replace(/[^\d-]/g, "");
      if(start === "" || end === ""){
        const newUrl = `?optional=history&status=${statusFilter}&startDate=${startDate}&endDate=${endDate}&page=1`;
        console.log(newUrl);
        window.location.href = newUrl;
      }
    }
  }
});

function setActiveLink(page) {
  const links = document.querySelectorAll('.link .page');

  const currentLink = Array.from(links).find(link => link.getAttribute('href').includes(`?optional=${page}`));

  links.forEach(link => {
    link.classList.remove('active');
  });

  if (currentLink) {
    currentLink.classList.add('active');
  }
};

function setActiveStatusFilter(statusFilter) {
  const links = document.querySelectorAll('.dropdown-menu .dropdown-item');

  const currentLink = Array.from(links).find(link => link.getAttribute('href').includes(`?optional=history&status=${statusFilter}`));

  links.forEach(link => {
    link.classList.remove('active');
  });

  if (currentLink) {
    currentLink.classList.add('active');
  }
};

$('#fuMain').fileinput({
  dropZoneEnabled: false,
  maxFileCount: 1,
  allowedFileExtensions: ['jpg', 'png', 'gif'],
  language: 'vi',
});

async function uploadAvatar() {
  const fileInput = $("#fuMain")[0].files[0];
  if (!fileInput) {
    console.error('No file selected.');
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput);

  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/profile/upload-avatar',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
          delete req.body.image;
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

$("#updateButton").on("click", async function(event) {
  // const isValid = true; // Điều kiện kiểm tra hợp lệ

  if (!checkEmail($('#inputEmail').val())) {
    $('#inputEmail').addClass("is-invalid");
    $("#checkValidationEmailUser").show();
    $('#inputEmail').focus();
    return;
  }

  if (!checkPhone($("#inputPhoneNumber").val())) {
    $("#inputPhoneNumber").addClass("is-invalid");
    $("#checkValidationPhoneUser").show();
    $('#inputPhoneNumber').focus();
    return;
  }

  try {
    await uploadAvatar();
    console.log("dob: ", $('#txtDoB').val());
    $("#infoForm").submit();
    alert("Đã cập nhật thông tin thành công!!!");
  } catch (error) {
    console.error('Error during avatar upload:', error);
  }
});

$("#submitButton").on("click", function (event) {
  event.preventDefault();
  let isValid = true;
  console.log("Đã ấn nút submit");
  let index = 1;

  while ($(`#inputAddress${index}`).val()) {
    console.log("Đang kiểm tra đk " + index);
    let address = $(`#inputAddress${index}`).val();

    if (checkFormatAddress(address) === false) {
      $(`#inputAddress${index}`).addClass("is-invalid");
      $(`#checkValidationAddress${index}`).show();
      if(isValid) $(`#inputAddress${index}`).focus();
      isValid = false;
    }else{
      $(`#inputAddress${index}`).removeClass("is-invalid");
      $(`#checkValidationAddress${index}`).hide();
    }
    index++;
  }

  if (!isValid) {
    event.preventDefault();
  } else {
    $('#addressForm').submit();
    alert("Đã cập nhật địa chỉ thành công!!!");
  }
});

$("#txtPassword").on("input", function () {
  $("#txtConfirm").val("");
  if (checkPassword()) {
      $(this).removeClass("is-invalid");
      $("#checkValidationPassword").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationPassword").show();
  }
});

function checkPassword() {
  let password = $("#txtPassword").val();

  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,50}$/;
  return regex.test(password);
}

$("#txtConfirm").on("input", function () {
  if (checkConfirmPassword()) {
      $(this).removeClass("is-invalid");
      $("#checkValidationConfirmPassword").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationConfirmPassword").show();
  }
});

function checkConfirmPassword() {
  let password = $("#txtPassword").val();
  let confirm_password = $("#txtConfirm").val();

  return confirm_password.length > 0 && password == confirm_password;
}

$("#submitPasswordButton").on("click", function (event) {
  let isValid = true;

  if(checkPassword() === false){
      $('#txtPassword').addClass("is-invalid");
      $("#checkValidationPassword").show();
      if(isValid) $('#txtPassword').focus();
      isValid = false;
  }
  if(checkConfirmPassword() === false){
      $('#txtConfirm').addClass("is-invalid");
      $("#checkValidationConfirmPassword").show();
      if(isValid) $('#txtConfirm').focus();
      isValid = false;
  }

  if (!isValid) {
      event.preventDefault();
  } else {
      const id = $('#userID').val();
      const currentPassword = $('#inputCurrentPassword').val();
      $.getJSON(`/profile/${id}/is-available?currentPassword=${currentPassword}`, function (data) {
        if (data === false) {
          alert('Mật khẩu không chính xác, vui lòng nhập lại!');
          $('#passwordForm').off('submit').submit();
        } else {
          alert("Đã cập nhật mật khẩu mới thành công!!!");
          $('#passwordForm').submit();
        }
      });
    }
});

function addNewAddress() {
  const newAddressDiv = document.createElement('div');
  newAddressDiv.className = 'form-group mb-4';

  const index = document.querySelectorAll('#addressForm .form-group').length + 1;
  const newAddressLabel = document.createElement('label');
  newAddressLabel.textContent = `Địa chỉ ${index}`;
  newAddressLabel.setAttribute('for', `inputAddress${index}`);

  const newValidationDiv = document.createElement('div');
  newValidationDiv.className = 'input-group has-validation';

  const newAddressInput = document.createElement('input');
  newAddressInput.type = 'text';
  newAddressInput.className = 'form-control';
  newAddressInput.name = "address";
  newAddressInput.id = `inputAddress${index}`;
  newAddressInput.placeholder = 'Nhập địa chỉ mới';
  newAddressInput.setAttribute('aria-describedby', `checkValidationAddress${index}`);

  const newErrorDiv = document.createElement('div');
  newErrorDiv.className = 'invalid-feedback';
  newErrorDiv.id = `checkValidationAddress${index}`;
  newErrorDiv.innerHTML = `Vui lòng nhập đúng định dạng của địa chỉ: "Số nhà" "Tên đường", "Phường", "Quận", "TP.HCM". Ví dụ: 227 Nguyễn Văn Cừ, phường 4, quận 5, TP.HCM.`;

  newValidationDiv.appendChild(newAddressInput);
  newValidationDiv.appendChild(newErrorDiv);

  newAddressDiv.appendChild(newAddressLabel);
  newAddressDiv.appendChild(newValidationDiv);

  const addressForm = document.getElementById('addressForm');

  addressForm.insertBefore(newAddressDiv, addressForm.lastElementChild);
}

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

$(".category-checkbox").change(function() {
  let selectedOptions = [];

  $(".category-checkbox:checked").each(function() {
    selectedOptions.push($(this).data("value"));
  });

  if (selectedOptions.length > 3) {
    $(this).prop('checked', false);
    return;
  }

  $("#dropdownCategory").text(selectedOptions.length > 0 ? selectedOptions.join(", ") : "Hãy chọn những loại kinh doanh của cửa hàng bạn");

  $("#selectedCategory").val(selectedOptions.join(", "));
  if(checkCategories() === false){
    $('#dropdownCategory').addClass("is-invalid");
    $("#checkValidationCategories").show();
  }else{
    $('#dropdownCategory').removeClass("is-invalid");
    $("#checkValidationCategories").hide();
  }
});

function checkShopName(){
  let shopName = $('#inputShopName').val();
  if(shopName.length > 0) return true;
  return false;
}

$("#inputShopName").on("input", function () {
  $('#checkValidationShopName').hide();
});

function checkRepresentative(){
  let representative = $('#inputRepresentative').val();
  if(representative.length > 0) return true;
  return false;
}

$("#inputRepresentative").on("input", function () {
  $('#checkValidationRepresentative').hide();
});

function checkCCCD(){
  let regex = /^\d{12}$/;
  return regex.test($('#inputCitizenIdentityCard').val());
}

$("#inputCitizenIdentityCard").on("input", function () {
  if (checkCCCD()) {
      $(this).removeClass("is-invalid");
      $("#checkValidationCCCD").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationCCCD").show();
  }
});

function checkEmail(email){
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

$("#inputEmail").on("input", function () {
  if (checkEmail($('#inputEmail').val())) {
      $(this).removeClass("is-invalid");
      $("#checkValidationEmailUser").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationEmailUser").show();
  }
});

$("#inputShopEmail").on("input", function () {
  if (checkEmail($('#inputShopEmail').val())) {
      $(this).removeClass("is-invalid");
      $("#checkValidationEmail").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationEmail").show();
  }
});

function checkPhone(phone){
  let regex = /^(0[3-9])+([0-9]{8})$/;
  return regex.test(phone);
}

$("#inputPhoneNumber").on("input", function () {
  if (checkPhone($("#inputPhoneNumber").val())) {
      $(this).removeClass("is-invalid");
      $("#checkValidationPhoneUser").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationPhoneUser").show();
  }
});

$("#inputShopPhoneNumber").on("input", function () {
  if (checkPhone($('#inputShopPhoneNumber').val())) {
      $(this).removeClass("is-invalid");
      $("#checkValidationPhone").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationPhone").show();
  }
});

function checkFormatAddress(address){
  const regex = /,\s/g;
  let matches = address.match(regex);

  if (matches !== null && matches.length === 3) {
    let parts = address.split(", ");
    const regex2 = /^\d+\s/;
    let result = regex2.test(parts[0]);
    console.log(parts[0]);
    if (!result) {
      isValid = false;
      console.log("false " + index);
      return false;
    }else{
      if(parts[3] === 'TP.HCM'){
        return true;
      }else{
        return false;
      }
    }
  }else{
    return false;
  }
}

$("#inputShopAddress").on("input", function () {
  if (checkFormatAddress($('#inputShopAddress').val())) {
      $(this).removeClass("is-invalid");
      $("#checkValidationAddressShop").hide();
  } else {
      $(this).addClass("is-invalid");
      $("#checkValidationAddressShop").show();
  }
});

function checkCategories(){
  let categories = $('#selectedCategory').val();
  if(categories === ''){
    return false;
  }
  let split = categories.split(", ");
  if(split.length > 3){
    return false;
  }else{
    return true;
  }
}

$("#submitRegisterButton").on("click", function (event) {
  let isValid = true;

  if(checkShopName() == false){
    $('#inputShopName').addClass("is-invalid");
    $("#checkValidationShopName").show();
    $('#inputShopName').focus();
    isValid = false;
  }
  if(checkRepresentative() == false){
    $('#inputRepresentative').addClass("is-invalid");
    $("#checkValidationRepresentative").show();
    if(isValid) $('#inputRepresentative').focus();
    isValid = false; 
  }
  if(checkCCCD() === false){
    $('#inputCitizenIdentityCard').addClass("is-invalid");
    $("#checkValidationCCCD").show();
    if(isValid) $('#inputCitizenIdentityCard').focus();
    isValid = false;
  }
  if(checkEmail($('#inputShopEmail').val()) === false){
    $('#inputShopEmail').addClass("is-invalid");
    $("#checkValidationEmail").show();
    if(isValid) $('inputShopEmail').focus();
    isValid = false;
  }
  if(checkPhone($('#inputShopPhoneNumber').val()) === false){
    $('#inputShopPhoneNumber').addClass("is-invalid");
    $("#checkValidationPhone").show();
    if(isValid) $('#inputShopPhoneNumber').focus();
    isValid = false;
  }
  if(checkFormatAddress($('#inputShopAddress').val()) === false){
    $('#inputShopAddress').addClass("is-invalid");
    $("#checkValidationAddressShop").show();
    if(isValid) $('#inputShopAddress').focus();  
    isValid = false;
  }
  if(checkCategories() === false){
    $('#dropdownCategory').addClass("is-invalid");
    $("#checkValidationCategories").show();
    if(isValid) $('#dropdownCategory').focus();
    isValid = false;
  }else{
    $('#dropdownCategory').removeClass("is-invalid");
    $("#checkValidationCategories").hide();
  }
  if(!isValid){
    event.preventDefault();
  }else{
    $('#RegisterForm').submit();
    alert("Đã gửi form đăng ký thành merchant thành công! Vui lòng đợi xác nhận trong vài ngày.")
  }
  
});