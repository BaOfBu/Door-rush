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

document.getElementById("addressForm").addEventListener("submit", function() {
  window.alert("Đã cập nhật địa chỉ thành công!!!");
});

document.getElementById("passwordForm").addEventListener("submit", function() {
  window.alert("Đã cập nhật mật khẩu mới thành công!!!");
});

function addNewAddress() {
  // Tạo một đối tượng div mới chứa label và ô nhập địa chỉ
  const newAddressDiv = document.createElement('div');
  newAddressDiv.className = 'form-group mb-4';

  // Tạo một đối tượng label mới
  const newAddressLabel = document.createElement('label');
  newAddressLabel.textContent = `Địa chỉ ${document.querySelectorAll('#addressForm .form-group').length + 1}`;
  newAddressLabel.setAttribute('for', `inputAddress${document.querySelectorAll('.form-group').length + 1}`);

  // Tạo một đối tượng input mới
  const newAddressInput = document.createElement('input');
  newAddressInput.type = 'text';
  newAddressInput.className = 'form-control';
  newAddressInput.name = "address";
  newAddressInput.id = `inputAddress${document.querySelectorAll('.form-group').length + 1}`;
  newAddressInput.placeholder = 'Nhập địa chỉ mới';

  // Thêm label và input vào div mới tạo
  newAddressDiv.appendChild(newAddressLabel);
  newAddressDiv.appendChild(newAddressInput);

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