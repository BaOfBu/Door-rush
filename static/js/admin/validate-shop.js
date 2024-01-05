$(document).ready(function () {
    var currentDate = moment();
    $('input[name="daterange"]').daterangepicker({
        startDate: currentDate,
        endDate: currentDate,
        locale: {
            cancelLabel: "Clear"
        }
    });
    $('input[name="daterange"]').on("apply.daterangepicker", function (ev, picker) {
        $(this).val(picker.startDate.format("DD/MM/YYYY") + " - " + picker.endDate.format("DD/MM/YYYY"));
    });
    $('input[name="daterange"]').on("cancel.daterangepicker", function (ev, picker) {
        $(this).data("daterangepicker").setStartDate(currentDate);
        $(this).data("daterangepicker").setEndDate(currentDate);
        $(this).val(currentDate.format("MM/DD/YYYY") + " - " + currentDate.format("MM/DD/YYYY"));
    });
});
