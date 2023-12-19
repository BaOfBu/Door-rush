const swiper = new Swiper(".popular-categories-swiper", {
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
    },
    autoplay: {
        delay: 10000,
    }
});

const recommendSwiper = new Swiper(".recommend-swiper", {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 57,
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
    },
});