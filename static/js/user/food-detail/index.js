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
document.getElementById("submitFormButton").addEventListener("click", function (event) {
    // Ngăn không cho form submit theo cách thông thường
    event.preventDefault();
    // Get the current URL's path
    const path = window.location.pathname;
    // Split the path into segments
    const pathSegments = path.split("/");
    let itemId = pathSegments[3];
    let userId = "657ed32ab3c555f469af362d";
    let rating = 0;
    let stars = document.querySelectorAll('input[name="star"]');
    // Loop through each radio button to find the checked one
    for (let star of stars) {
        if (star.checked) {
            rating = Number(star.value);
        }
    }
    if (rating === 0) {
        alert("Bạn cần phải nhập đủ thông tin đánh giá");
    } else {
        let comment = document.getElementById("floatingTextarea2").value;
        let feedbackDate = new Date();

        // Thu thập dữ liệu từ form
        fetch(`${itemId}/getfeedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                itemId: itemId,
                userId: userId,
                rating: rating,
                comment: comment,
                feedbackDate: feedbackDate
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                }
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });
        document.getElementById("myForm").style.display = "none";
        document.getElementById("thank-you-form").style.display = "flex";
    }
});
// Xử lý nút bấm trở lại trang đánh giá
document.getElementById("returnButton").addEventListener("click", function () {
    const form = document.getElementById("myForm");
    form.style.display = "flex";
    form.reset();
    document.getElementById("thank-you-form").style.display = "none";
});

// Xử lý nút bấm thêm vào giỏ
document.getElementById("addItemToCart").addEventListener("click", function (event) {
    const selectedFoodTypeIndex = document.getElementById("food-type").value;
    const selectedFoodType = typeOfFoodId[selectedFoodTypeIndex];
    // Ngăn không cho form submit theo cách thông thường
    event.preventDefault();
    // Get the current URL's path
    const path = window.location.pathname;
    // Split the path into segments
    const pathSegments = path.split("/");
    let itemId = pathSegments[3];
    fetch(`${itemId}/addToCart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            foodId: itemId,
            quantity: Number(document.getElementById("food-quantity").value),
            foodType: selectedFoodType,
            notes: document.getElementById("food-note").value
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            window.location.reload();
            return response.json;
        })
        .then(data => {
            if (data.success) {
            }
        })
        .catch(error => {
            console.error("There has been a problem with your fetch operation:", error);
        });
});
