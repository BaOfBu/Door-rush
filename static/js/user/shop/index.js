const swiper = new Swiper(".popular-categories-row", {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 10,
    sliderPerGroup: 3,
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