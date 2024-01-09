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
    if (isAccount === false) {
        alert("Bạn cần phải đăng nhập để thực hiện việc đánh giá");
    } else {
        // Get the current URL's path
        const path = window.location.pathname;
        // Split the path into segments
        const pathSegments = path.split("/");
        let itemId = pathSegments[3];
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
    let option;
    if (isAccount === false) {
        event.preventDefault();
        alert("Bạn cần phải đăng nhập để thêm vào giỏ hàng");
        window.location.href = "/account/login";
    } else if (isSameMerchant == false) {
        option = window.confirm(
            "Bạn có muốn thay thế các món ăn hiện tại trong giỏ hàng của cửa hàng khác bằng món ăn của cửa hàng này không?"
        );
    } else if (document.getElementById("food-quantity").value == 0) {
        alert("Sản phẩm đã hết, vui lòng lựa chọn sản phẩm khác");
        return;
    }
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
            isSameMerchant: isSameMerchant,
            option: option,
            isAccount: isAccount,
            merchantId: merchantId,
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
// Xử lý nút bấm mua ngay
document.getElementById("buy-only").addEventListener("click", function (event) {
    let option;
    if (isAccount === false) {
        event.preventDefault();
        alert("Bạn cần phải đăng nhập để mua sản phẩm");
        window.location.href = "/account/login";
    } else if (isSameMerchant == false) {
        option = window.confirm(
            "Bạn có muốn thay thế các món ăn hiện tại trong giỏ hàng của cửa hàng khác bằng món ăn của cửa hàng này không?"
        );
    } else if (document.getElementById("food-quantity").value == 0) {
        alert("Sản phẩm đã hết, vui lòng lựa chọn sản phẩm khác");
        return;
    }
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
            isSameMerchant: isSameMerchant,
            option: option,
            isAccount: isAccount,
            merchantId: merchantId,
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
            if (option == false) {
                window.location.reload();
            } else {
                window.location.href = "/shopping-cart";
            }

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
document.getElementById("food-type").addEventListener("change", function (event) {
    event.preventDefault();
    const selectedFoodTypeIndex = document.getElementById("food-type").value;
    const selectedFoodTypeCurrentQuantity = typeOfFoodCurrentQuantity[selectedFoodTypeIndex];
    console.log(selectedFoodTypeIndex, selectedFoodTypeCurrentQuantity);
    if (selectedFoodTypeCurrentQuantity == 0) {
        document.getElementById("food-quantity").setAttribute("min", "0");
        document.getElementById("food-quantity").setAttribute("max", "0");
        document.getElementById("food-quantity").value = 0;
    } else {
        document.getElementById("food-quantity").setAttribute("max", selectedFoodTypeCurrentQuantity);
        document.getElementById("food-quantity").value = 1;
    }
});
function updateQuantity() {
    var selectedFoodIndex = document.getElementById("food-type").value;
    var maxQuantity = typeOfFoodCurrentQuantity[selectedFoodIndex];
    var quantityField = document.getElementById("food-quantity");
    quantityField.max = maxQuantity;
    quantityField.value = maxQuantity >= 1 ? 1 : maxQuantity;
    document.getElementById("max-quantity").innerText = "Số lượng sản phẩm còn lại: " + maxQuantity;
}
window.onload = updateQuantity;
