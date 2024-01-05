$(function () {
  let startDate = localStorage.getItem('selectedStartDate');
  let endDate = localStorage.getItem('selectedEndDate');
  if(startDate === null || endDate === null){
    startDate = moment().subtract(15, 'days');
    endDate = moment();
  }else{
    startDate = moment(startDate, "YYYY-MM-DD").format("DD/MM/YYYY");
    endDate = moment(endDate, "YYYY-MM-DD").format("DD/MM/YYYY");
  }
  $('#periodPicker').daterangepicker({
      timePicker: false,
      startDate: startDate, 
      endDate: endDate, 
      locale: {
          format: 'DD/MM/YYYY'
      }
  });
  $('#periodPicker').on('apply.daterangepicker', function (ev, picker) {
    let startDate = picker.startDate.format('DD/MM/YYYY');
    let endDate = picker.endDate.format('DD/MM/YYYY');
    $('#timeRange').val(startDate + ' - ' + endDate);

    let statusFilter = document.getElementById('dropdownMenu').innerText.replace(/\s/g, '');
    const statusMapping = {
        "Tấtcảtrạngthái": "all",
        "Hoànthành": "delivered",
        "Đãhủy": "cancelled"
    };

    const statusValue = statusMapping[statusFilter];

    startDate = picker.startDate.format('YYYY-MM-DD');
    endDate = picker.endDate.format('YYYY-MM-DD');

    localStorage.setItem('selectedStartDate', JSON.stringify(startDate));
    localStorage.setItem('selectedEndDate', JSON.stringify(endDate));

    const newUrl = `?optional=history&status=${statusValue}&startDate=${startDate}&endDate=${endDate}`;
    window.location.href = newUrl;
  });
});