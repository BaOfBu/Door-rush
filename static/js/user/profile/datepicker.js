document.addEventListener('DOMContentLoaded', function () {
    const dateRangePicker = document.getElementById('dateRangePicker');
  
    // Cấu hình và khởi tạo Datepicker cho chế độ "range"
    flatpickr(dateRangePicker, {
      mode: 'range', // Chế độ "range"
      dateFormat: 'd/m/Y', // Định dạng ngày tháng
      locale: 'vi', // Ngôn ngữ tiếng Việt
      // Các tùy chọn khác có thể được thêm vào đây
    });
    
});  