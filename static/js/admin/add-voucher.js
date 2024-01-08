let voucherInput = document.getElementById("inputNameVoucher");
let notice = document.getElementById("lengthNotice");
voucherInput.addEventListener("input", function () {
    if (voucherInput.value.length > 20) {
        notice.style.display = "block";
    } else {
        notice.style.display = "none";
    }
});

document.getElementById("add-btn").addEventListener("click", function (event) {
    const voucherName = document.getElementById("inputNameVoucher").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const discount = document.getElementById("discount").value;
    if (voucherName.length === 0 || discount.length === 0 || endDate.length === 0 || startDate.length === 0) {
        event.preventDefault();
        alert("Vui lòng điền đầy đủ thông tin!!!");
        return;
    }
    if (voucherName.length > 20) {
        event.preventDefault();
        alert("Độ dài mã giảm không quá 20 kí tự!!!");
        return;
    }
    window.alert("Thêm Voucher thành công");
});
