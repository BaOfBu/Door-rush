document.addEventListener('DOMContentLoaded', function () {
    const dateRangePicker = document.getElementById('dateRangePicker');
    const toggleIcon = document.getElementById('toggleIcon');

    const storedRange = localStorage.getItem('selectedDateRange');

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };


    // Cấu hình và khởi tạo Datepicker cho chế độ "range"
    flatpickr(dateRangePicker, {
      mode: 'range', // Chế độ "range"
      dateFormat: 'd/m/Y', // Định dạng ngày tháng
      defaultDate: storedRange ? JSON.parse(storedRange) : null,
      maxDate: new Date(),
      onClose: function (selectedDates) {
        // Đặt một khoảng thời gian chờ nhỏ (ví dụ, 100ms) để đảm bảo Flatpickr cập nhật giá trị dropdown
        setTimeout(function () {
          // Lấy giá trị thực của dropdown
          let statusFilter = document.getElementById('dropdownMenu').innerText.replace(/\s/g, '');
          // Ánh xạ các giá trị của dropdown thành các giá trị cụ thể
          const statusMapping = {
              "Tấtcảtrạngthái": "all",
              "Đangchuẩnbị": "preparing",
              "Đanggiao": "delivering",
              "Hoànthành": "delivered",
              "Đãhủy": "cancelled"
          };

          // Lấy giá trị thực tế tương ứng với giá trị hiển thị của dropdown
          const statusValue = statusMapping[statusFilter];

          // Lấy ngày bắt đầu và ngày kết thúc
          const startDate = selectedDates[0].toLocaleDateString('en-US', options).replace(/\//g, '-');
          const endDate = selectedDates[1].toLocaleDateString('en-US', options).replace(/\//g, '-');

          localStorage.setItem('selectedDateRange', JSON.stringify(selectedDates));

          // Thực hiện hành động thay đổi URL ở đây
          const newUrl = `?optional=history&status=${statusValue}&startDate=${startDate}&endDate=${endDate}`;
          window.location.href = newUrl;

      }, 100);
      }

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