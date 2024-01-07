document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM đã được tải.');
  const merchantId = $("#merchantId").val();
  getToTal(merchantId);
  console.log("Đã success");

  const startMonth = $('#startMonth').val();
  const currentMonth = $('#currentMonth').val();
  const startYear = $('#startYear').val();
  const currentYear = $('#currentYear').val();

  let labels = getLabels(currentMonth, currentYear);
  let revenue = await updateRevenueOfMonth(merchantId, labels, currentYear);
  console.log("revenue: ", revenue);
  let revenueOfMonth = revenueData(labels, 'Doanh thu trong khoảng ngày này', revenue);
  console.log("data: ", revenueOfMonth);
  let revenueOfMonthChart = revenueChart('revenueOfMonthChart', revenueOfMonth);
  console.log("Đã update revenue within month");

  updateYear(startYear, currentYear);
  updateMonth(1, $('#currentMonth').val());

  let lastSelectedElement = document.querySelector(".year .dropdown-menu .dropdown-item");

  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  let revenueOfYear = await updateRevenueOfYear(merchantId, month, currentYear);
  let revenueOfYearData = revenueData(month, 'Doanh thu của tháng này', revenueOfYear);
  let revenueOfYearChart = revenueChart('revenueOfYearChart', revenueOfYearData);

  updateYearSelected(startYear, currentYear);

  let lastSelectedElementYears = document.querySelector(".revenue-year .dropdown-menu .dropdown-item");

  await updateChartRevenueYearly();

  function getToTal(merchantId){
    const apiUrl = '/merchant/revenue/total';
  
    // Sử dụng jQuery.ajax để thực hiện yêu cầu
    $.ajax({
        url: apiUrl,
        type: 'POST', // Hoặc 'PUT' tùy thuộc vào loại yêu cầu bạn muốn thực hiện
        contentType: 'application/json',
        data: JSON.stringify({ merchantId }),
        success: function (data) {
            // Xử lý phản hồi từ máy chủ
            const totalRevenue = Intl.NumberFormat("vi-VN").format(String(data.totalRevenue)) + 'đ';
            const average = Intl.NumberFormat("vi-VN").format(String(data.average)) + 'đ';
            const revenueToday = Intl.NumberFormat("vi-VN").format(String(data.revenueToday)) + 'đ';
  
            $("#total-revenue").text(totalRevenue);
            $("#total-order").text(data.totalOrder);
            $("#total-customer").text(data.totalCustomer);
            $("#average-monthly").text(average);
            if(data.quantity === -1){
              $("#hot-food").text(data.hotFood);
            }else{
              $("#hot-food").text(data.hotFood + ' - ' + data.quantity + ' lượt bán');
            }
            
            $("#order-today").text(data.orderToday + ' đơn hàng');
            $("#revenue-today").text(revenueToday);
        },
        error: function (error) {
            console.error('Lỗi khi lấy total:', error);
        }
    });
  }
  
  function checkLeapYear(year){
    if((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)){
      return true;
    }
    return false;
  }
  
  function getDayOfMonth(month, year){
    let day = [31, 28, 31, 30, 31, 30, 31, 31, 30 , 31, 30, 31];
    if(month === 2 && checkLeapYear(year)) return 29;
    return day[month - 1];
  }
  
  function getLabels(month, year){
    let labels = [];
    for(let i = 1; i <= 25; i = i + 3){
      let next = i + 2;
      let tmp = i + '/' + month + ' - ' + next + '/' + month;
      labels.push(tmp);
    }
  
    const dayOfMonth = getDayOfMonth(month, year);
    let temp = 28 + '/' + month;
    if(dayOfMonth !== 28){
      temp = temp + ' - ' + dayOfMonth + '/' + month;
    }
    labels.push(temp);
    return labels;
  }

  function updateRevenueOfMonth(merchantId, labels, year){  
    return new Promise((resolve, reject) => {
      const apiUrl = '/merchant/revenue/within-month';

      $.ajax({
          url: apiUrl,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ merchantId, labels, year }),
          success: function (data) {
              const dataRevenue = data.revenue;
              console.log(dataRevenue);

              // Giải quyết Promise với dữ liệu đã lấy được
              resolve(dataRevenue);
          },
          error: function (error) {
              console.error('Lỗi khi lấy doanh thu trong tháng:', error);

              // Giải quyết Promise với lỗi
              reject(error);
          }
      });
    });
  }
  
  function revenueData(labels, label, data){
    const RevenueData = {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
    };
    return RevenueData;
  }
  
  async function updateChartData(month, year){
    let labels = getLabels(month, year);
    revenueOfMonth.labels = labels;
    revenueOfMonth.datasets[0].data = await updateRevenueOfMonth(merchantId, labels, year);
    console.log(revenueOfMonth.datasets[0].data );
    revenueOfMonthChart.update();
  }

  function revenueChart(id, revenueData){
    const RevenueCtx = document.getElementById(id).getContext('2d');
    const RevenueChart = new Chart(RevenueCtx, {
      type: 'bar',
      data: revenueData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return Intl.NumberFormat("vi-VN").format(String(value)) + 'đ';
              }
            }
          }
        }
      }
    });
    console.log("Đã vẽ xong");
    return RevenueChart;
  }
  
  function updateYear(startYear, currentYear){
    for(let i = Number(currentYear); i >= startYear; i--){
      let newItem = '<li><a class="dropdown-item" data-value="' + i + '">' + i + '</a></li>';
      console.log(newItem);
      $(".year ul.dropdown-menu").append(newItem);
    }

    let defaultSelectedYear = $('.year .dropdown-menu .dropdown-item:first').data('value');

    // Thêm lớp "active" cho dropdown-item cuối cùng
    $('.year .dropdown-menu .dropdown-item:first').addClass('active');
    $("#dropdownMenuYear").val(defaultSelectedYear);
    $("#dropdownMenuYear").text(defaultSelectedYear);
  }
  
  function updateMonth(startMonth, currentMonth){
    const dropdownMenu = document.querySelector('.month .dropdown-menu');

    while (dropdownMenu.firstChild) {
        dropdownMenu.removeChild(dropdownMenu.firstChild);
    }
    lastSelectedElementMonth = null;

    for(let i = Number(currentMonth); i >= startMonth; i--){
      let newItem = '<li><a class="dropdown-item" data-value="' + i + '">' + i + '</a></li>';
      console.log(newItem);
      $(".month ul.dropdown-menu").append(newItem);
    }

    let defaultSelectedMonth = $('.month .dropdown-menu .dropdown-item:first').data('value');

    $('.month .dropdown-menu .dropdown-item:first').addClass('active');
    $("#dropdownMenuMonth").val(defaultSelectedMonth);
    $("#dropdownMenuMonth").text(defaultSelectedMonth);
  }
  
  $(".year ul.dropdown-menu").on("click", function (event) {
    const selectedValue = event.target.dataset.value;
  
    console.log("Data: ", selectedValue);
    $("#dropdownMenuYear").val(selectedValue);
    $("#dropdownMenuYear").text(selectedValue);
    if (lastSelectedElement) {
      lastSelectedElement.classList.remove('active');
    }
    event.target.classList.add('active');
    lastSelectedElement = event.target;

    if(selectedValue === startYear){
      updateMonth(startMonth, 12);

      updateChartData(12, selectedValue);
      console.log("Đã update thành công");
    }else if(selectedValue === currentYear){
      updateMonth(1, currentMonth);
      updateChartData(currentMonth, selectedValue);
    }else{
      updateMonth(1, 12);
      updateChartData(12, selectedValue);
    }

  });

  $(".month ul.dropdown-menu").on("click", function (event) {
    const selectedValue = event.target.dataset.value;
  
    console.log("Data: ", selectedValue);
    $("#dropdownMenuMonth").val(selectedValue);
    $("#dropdownMenuMonth").text(selectedValue);

    const dropdown_item = document.querySelectorAll(".month ul.dropdown-menu .dropdown-item");
    dropdown_item.forEach(item => {
      item.classList.remove('active');
    });

    event.target.classList.add('active');

    updateChartData(selectedValue, lastSelectedElement.dataset.value);
  });

  function updateRevenueOfYear(merchantId, labels, year){  
    return new Promise((resolve, reject) => {
      const apiUrl = '/merchant/revenue/within-year';

      $.ajax({
          url: apiUrl,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ merchantId, labels, year }),
          success: function (data) {
              const dataRevenue = data.revenue;
              console.log(dataRevenue);

              // Giải quyết Promise với dữ liệu đã lấy được
              resolve(dataRevenue);
          },
          error: function (error) {
              console.error('Lỗi khi lấy doanh thu trong năm:', error);

              // Giải quyết Promise với lỗi
              reject(error);
          }
      });
    });
  }

  function updateYearSelected(startYear, currentYear){
    for(let i = Number(currentYear); i >= startYear; i--){
      let newItem = '<li><a class="dropdown-item" data-value="' + i + '">' + i + '</a></li>';
      console.log(newItem);
      $(".revenue-year ul.dropdown-menu").append(newItem);
    }

    let defaultSelectedYear = $('.revenue-year .dropdown-menu .dropdown-item:first').data('value');

    // Thêm lớp "active" cho dropdown-item cuối cùng
    $('.revenue-year .dropdown-menu .dropdown-item:first').addClass('active');
    $("#dropdownMenuYears").val(defaultSelectedYear);
    $("#dropdownMenuYears").text(defaultSelectedYear);
  }  

  $(".revenue-year ul.dropdown-menu").on("click", function (event) {
    const selectedValue = event.target.dataset.value;
  
    console.log("Data: ", selectedValue);
    $("#dropdownMenuYears").val(selectedValue);
    $("#dropdownMenuYears").text(selectedValue);
    if (lastSelectedElementYears) {
      lastSelectedElementYears.classList.remove('active');
    }
    event.target.classList.add('active');
    lastSelectedElementYears = event.target;

    updateChartRevenueOfYear(selectedValue);

  });

  async function updateChartRevenueOfYear(year){
    revenueOfYearData.datasets[0].data = await updateRevenueOfYear(merchantId, month, year);
    console.log(revenueOfYearData.datasets[0].data );
    revenueOfYearChart.update();
  }

  function getValidYear(){
    let validYear = [];
    for(let i = Number(startYear); i <= Number(currentYear); i++){
      validYear.push(i);
    }
    console.log("valid year: ", validYear);
    return validYear;
  }

  function updateRevenueYearly(merchantId, labels){  
    return new Promise((resolve, reject) => {
      const apiUrl = '/merchant/revenue/yearly';

      $.ajax({
          url: apiUrl,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ merchantId, labels }),
          success: function (data) {
              const dataRevenue = data.revenue;
              console.log(dataRevenue);

              // Giải quyết Promise với dữ liệu đã lấy được
              resolve(dataRevenue);
          },
          error: function (error) {
              console.error('Lỗi khi lấy doanh thu hàng năm:', error);

              // Giải quyết Promise với lỗi
              reject(error);
          }
      });
    });
  }

  async function updateChartRevenueYearly(){
    const years = getValidYear();
    let revenueData = {
      labels: years,
      datasets: [{
        label: 'Doanh thu của năm này',
        data: await updateRevenueYearly(merchantId, years),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        fill: false
      }]
    };

    let revenueLineCtx = document.getElementById('revenueYearlyChart').getContext('2d');
    let revenueYearlyChart = new Chart(revenueLineCtx, {
      type: 'line',
      data: revenueData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return Intl.NumberFormat("vi-VN").format(String(value)) + 'đ';
              }
            }
          }
        }
      }
    });
  }
  
});
