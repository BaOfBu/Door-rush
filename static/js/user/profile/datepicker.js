$(function() {
  $('#txtDoB').datetimepicker({
    timepicker: false,
    format: 'd/m/Y',
    mask: true,
    closeOnDateSelect: true,
    onChangeDateTime:function(dp,$input){
      console.log($input.val());
    }
    
  });

  $('#toggle').on('click', function() {
    $('#txtDoB').datetimepicker('toggle');
  });
});

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
        "Đangchuẩnbị": "preparing",
        "Đanggiao": "delivering",
        "Hoànthành": "delivered",
        "Đãhủy": "cancelled"
    };

    const statusValue = statusMapping[statusFilter];

    startDate = picker.startDate.format('YYYY-MM-DD');
    endDate = picker.endDate.format('YYYY-MM-DD');

    localStorage.setItem('selectedStartDate', JSON.stringify(startDate));
    localStorage.setItem('selectedEndDate', JSON.stringify(endDate));

    const newUrl = `?optional=history&status=${statusValue}&startDate=${startDate}&endDate=${endDate}&page=1`;
    window.location.href = newUrl;
  });
  $('#resetIcon').on('click', function(){
    // $('#timeRange').removeAttribute('value');
    localStorage.removeItem('selectedStartDate');
    localStorage.removeItem('selectedEndDate');
    if(localStorage.getItem('selectedStart')){
      console.log("local: ", localStorage.removeItem('selectedEndDate'));
    }
    let statusFilter = document.getElementById('dropdownMenu').innerText.replace(/\s/g, '');
    const statusMapping = {
        "Tấtcảtrạngthái": "all",
        "Hoànthành": "delivered",
        "Đãhủy": "cancelled"
    };

    const statusValue = statusMapping[statusFilter];
    const newUrl = `/profile?optional=history&status=${statusValue}&startDate=&endDate=&page=1`;
    window.location.href = newUrl;
  })
});