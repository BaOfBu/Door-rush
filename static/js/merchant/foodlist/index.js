// Lấy các phần tử DOM
const addCategoryBtn = document.getElementById('addCategoryBtn');
const modal = document.getElementById('myModal');
const categoryList = document.getElementById('categoryList');
const categoryInput = document.getElementById('categoryInput');
const addCategory = document.getElementById('addCategory');
const closeBtn = document.getElementsByClassName('close')[0];

// Bắt sự kiện khi nhấn vào nút Thêm Category
addCategoryBtn.addEventListener('click', function() {
    // Hiển thị modal
    modal.style.display = 'block';

    // Hiển thị danh sách category đã có (ở đây là danh sách giả định)
    renderCategoryList(getCategoryList());
});

// Bắt sự kiện khi nhấn vào nút Đóng hoặc nút đóng modal
closeBtn.addEventListener('click', function() {
    // Ẩn modal
    modal.style.display = 'none';
});

// Bắt sự kiện khi nhấn vào nút Thêm
addCategory.addEventListener('click', function() {
    // Lấy giá trị từ input
    const newCategory = categoryInput.value;

    // Kiểm tra xem category có giá trị không
    if (newCategory.trim() !== '') {
        // Thực hiện xử lý với category (ở đây là in ra console)
        console.log('Thêm category mới:', newCategory);

        // Ẩn modal
        modal.style.display = 'none';

        // Reset giá trị của input
        categoryInput.value = '';

        // Thêm category mới vào danh sách và hiển thị lại danh sách
        renderCategoryList(getCategoryList().concat(newCategory));
    } else {
        alert('Vui lòng nhập category.');
    }
});

// Hàm hiển thị danh sách category
// Hàm hiển thị danh sách category
function renderCategoryList(categories) {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    categories.forEach(function(category) {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        const categoryText = document.createElement('span');
        categoryText.textContent = category;
        
        const closeButton = document.createElement('button');
        closeButton.classList.add('btn-close', 'btn-sm');
        // closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function() {
            // Xử lý sự kiện khi nút đóng được nhấn
            // Ở đây có thể là xóa category khỏi danh sách, hoặc thực hiện các tác vụ khác
            console.log('Đã đóng category:', category);
        });
        
        listItem.appendChild(categoryText);
        listItem.appendChild(closeButton);
        
        categoryList.appendChild(listItem);
    });
}

// Hàm giả định: Lấy danh sách category từ nguồn dữ liệu nào đó
function getCategoryList() {
    return ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'Category 7', 'Category 8', 'Category 9', 'Category 10', 'Category 11', 'Category 12', 'Category 13'];
}
