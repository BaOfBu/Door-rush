const swiper = new Swiper(".food-detail-card-review-content", {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 20,
    sliderPerGroup: 3,
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
document.getElementById("submitFormButton").addEventListener("click", function () {
    document.getElementById("my-form").style.display = "none";
    document.getElementById("thank-you-form").style.display = "block";
});
