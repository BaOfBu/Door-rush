document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('optional');

  if(page === 'history'){
    const statusFilter = urlParams.get('status') || "all";
    setActiveStatusFilter(statusFilter);
  }

  showContent(page);
  setActiveLink(page);
});

function showContent(contentId) {
  const contents = document.querySelectorAll('.content');
  contents.forEach(content => {
    content.style.display = 'none';
  });

  const selectedContent = document.getElementById(contentId);
  if (selectedContent) {
    selectedContent.style.display = 'block';
  }
}

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

document.getElementById("infoForm").addEventListener("submit", function() {
  window.alert("Đã cập nhật thông tin thành công!!!");
});

$("#submitButton").on("click", function (event) {
  event.preventDefault();
  let isValid = true;
  console.log("Đã ấn nút submit");
  let index = 1;
  const regex = /,\s/g;

  while ($(`#inputAddress${index}`).val()) {
    console.log("Đang kiểm tra đk " + index);
    let address = $(`#inputAddress${index}`).val();
    let matches = address.match(regex);

    if (matches !== null && matches.length === 3) {
      let parts = address.split(", ");
      const regex2 = /^\d+\s/;
      let result = regex2.test(parts[0]);
      console.log(parts[0]);
      if (!result) {
        isValid = false;
        console.log("false " + index);
        $(`#inputAddress${index}`).addClass("is-invalid");
        $(`#checkValidationAddress${index}`).show();
      }else{
        $(`#inputAddress${index}`).removeClass("is-invalid");
        $(`#checkValidationAddress${index}`).hide();
      }
    }else{
      isValid = false;
      console.log("false " + index);
      $(`#inputAddress${index}`).addClass("is-invalid");
      $(`#checkValidationAddress${index}`).show();
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
      // $('#passwordForm').on("submit", function(e){
      //   e.preventDefault();
      //   const id = $('#userID').val();
      //   const currentPassword = $('#inputCurrentPassword').val();
      //   $.getJSON(`/profile/${id}/is-available?currentPassword=${currentPassword}`, function (data) {
      //     if (data === false) {
      //       alert('Mật khẩu không chính xác, vui lòng nhập lại!');
      //       $('#passwordForm').off('submit').submit();
      //     } else {
      //       alert("Đã cập nhật mật khẩu mới thành công!!!");
      //       $('#passwordForm').off('submit').submit();
      //     }
      //   });
      // });
    }
});

// document.getElementById("passwordForm").addEventListener("submit", function() {
//   window.alert("Đã cập nhật mật khẩu mới thành công!!!");
// });

// $("#addAddressButton").on("click", function() {
//   // Create a new form group with input and validation elements
//   let index = $("#addressForm .form-group").length + 1;
//   let newAddressDiv = `
//     <div class="form-group mb-4">
//       <label for="inputAddress${index}">Địa chỉ ${index}</label>
//       <div class="input-group has-validation">
//         <input type="text" class="form-control" name="address" id="inputAddress${index}" placeholder="Nhập địa chỉ của bạn" aria-describedby="checkValidationAddress${index}">
//         <div id="checkValidationAddress${index}" class="invalid-feedback">
//           Vui lòng nhập đúng định dạng của địa chỉ: "Số nhà" "Tên đường", "Phường", "Quận", "TP.HCM". Ví dụ: 227 Nguyễn Văn Cừ, phường 4, quận 5, TP.HCM.
//         </div>
//       </div>
//     </div>
//   `;

//   const addressForm = document.getElementById('addressForm');

//   // Thêm div mới tạo vào cuối form
//   addressForm.insertBefore(newAddressDiv, addressForm.lastElementChild);
// });

function addNewAddress() {
  // Tạo một đối tượng div mới chứa label và ô nhập địa chỉ
  const newAddressDiv = document.createElement('div');
  newAddressDiv.className = 'form-group mb-4';

  const index = document.querySelectorAll('#addressForm .form-group').length + 1;
  // Tạo một đối tượng label mới
  const newAddressLabel = document.createElement('label');
  newAddressLabel.textContent = `Địa chỉ ${index}`;
  newAddressLabel.setAttribute('for', `inputAddress${index}`);

  // Tạo một đối tượng input mới

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

  // Thêm label và input vào div mới tạo
  newAddressDiv.appendChild(newAddressLabel);
  newAddressDiv.appendChild(newValidationDiv);

  // Tìm form theo ID
  const addressForm = document.getElementById('addressForm');

  // Thêm div mới tạo vào cuối form
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

document.addEventListener('DOMContentLoaded', function() {
  const dropdownButton = document.querySelector('#dropdownCategory');
  const dropdownMenu = document.querySelector('.dropdown-category');


  dropdownMenu.addEventListener('click', function(event) {
    const selectedCategory = event.target.dataset.value;

    // Update the button text with the selected category
    dropdownButton.textContent = selectedCategory;
    document.getElementById('selectedCategory').value = selectedCategory;
  });
});