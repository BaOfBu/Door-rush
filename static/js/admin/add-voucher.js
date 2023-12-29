document.getElementById("add-btn").addEventListener("click", function () {
    const voucherName = document.getElementById("inputNameVoucher").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const discount = document.getElementById("discount").value;
    if (voucherName.length === 0 || discount.length === 0 || endDate.length === 0 || startDate.length === 0) {
        alert("Vui lòng điền đầy đủ thông tin!!!");
        event.preventDefault();
        return;
    }
    window.alert("Thêm Voucher thành công");
});
