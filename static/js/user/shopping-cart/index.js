$(document).ready(function () {
    $("#option-submit").on("click", function(e){
        e.preventDefault()
        const foodVoucher = $("#food-voucher").val()
        const shipVoucher = $("#ship-voucher").val()
        const addressInput = $("#address-input").val()
        const addressDropdown = $("#address-dropdown").val()
        console.log(foodVoucher, shipVoucher, addressInput, addressDropdown)
    })
})