const swiperOne = new Swiper(".popular-categories-swiper", {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 20,
    sliderPerGroup: 3,
    centerSlide: "true",
    fade: "true",
    navigation: {
        nextEl: ".swiper-button-next-1",
        prevEl: ".swiper-button-prev-1"
    },
});

const swiperTwo = new Swiper(".recommend-swiper", {
    loop: false,
    slidesPerView: 3,
    spaceBetween: 57,
    sliderPerGroup: 3,
    centerSlide: "true",
    fade: "true",
    navigation: {
        nextEl: ".swiper-button-next-2",
        prevEl: ".swiper-button-prev-2"
    },
});

const swiperThree = new Swiper(".category-swiper", {
    loop: false,
    slidesPerView: 7,
    spaceBetween: 50,
    sliderPerGroup: 7,
    fade: "true",
    centerSlide: "true",
    navigation: {
        nextEl: ".swiper-button-next-3",
        prevEl: ".swiper-button-prev-3"
    },
});