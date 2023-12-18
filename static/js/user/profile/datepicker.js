document.addEventListener('DOMContentLoaded', function () {
    const dateRangePicker = document.getElementById('dateRangePicker');
    const toggleIcon = document.getElementById('toggleIcon');

    // Cấu hình và khởi tạo Datepicker cho chế độ "range"
    flatpickr(dateRangePicker, {
      mode: 'range', // Chế độ "range"
      dateFormat: 'd/m/Y', // Định dạng ngày tháng
      locale: 'vi', // Ngôn ngữ tiếng Việt
      maxDate: new Date()
    });
    
    toggleIcon.addEventListener('click', function () {
      dateRangePicker._flatpickr.toggle();
    });
});  

document.addEventListener('DOMContentLoaded', function () {
  const dateRangePicker = document.getElementById('datePicker');
  const toggleIcon = document.getElementById('toggle');

  flatpickr(datePicker, {
    dateFormat: 'd/m/Y', // Định dạng ngày tháng
    locale: 'vi', // Ngôn ngữ tiếng Việt
    maxDate: new Date()
  });
  
  toggleIcon.addEventListener('click', function () {
    dateRangePicker._flatpickr.toggle();
  });
}); 