// Xử lý giá từng loại của thức ăn
document.getElementById("price-of-food").innerHTML = priceOfFood[document.getElementById("food-type").value];

document.getElementById("food-type").addEventListener("change", function () {
    document.getElementById("price-of-food").innerHTML = priceOfFood[this.value];
});

// Xử lý thanh dịch chuyển đánh giá
if (numberOfRating >= 3) numberOfRating = 3;
// else numberOfRating = 1;
const swiper = new Swiper(".food-detail-card-review-content", {
    loop: true,
    slidesPerView: numberOfRating,
    spaceBetween: 20,
    autoHeight: false,
    sliderPerGroup: numberOfRating,
    centerSlide: "true",
    fade: "true",
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true
    },
    grabCursor: "true",
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    }
});

// Xử lý nút bấm gửi đánh giá
document.getElementById("submitFormButton").addEventListener("click", function () {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("thank-you-form").style.display = "flex";
});
// Xử lý nút bấm trở lại trang đánh giá
document.getElementById("returnButton").addEventListener("click", function () {
    document.getElementById("myForm").style.display = "flex";
    document.getElementById("thank-you-form").style.display = "none";
});
