const wishlistCount = document.querySelector("#wishlist-count");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

wishlistCount.textContent = wishlist.length;

const addcartButtons = document.querySelectorAll(".add-btn");
const removebtnButtons = document.querySelectorAll(".remove-btn");
const buyNowButtons = document.querySelectorAll(".buy-now");

const addCartCount = document.querySelector("#cart-count");
const totalPriceElement = document.getElementById("total-price");
const cartList = document.querySelector("#cart-list");
const wishlistButtons = document.querySelectorAll(".wishlist");
const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");
const productCards = document.querySelectorAll(".product-card");
const categoryButtons = document.querySelectorAll(".nav-bar a");

let count = 0;
let totalPrice = 0;
let cart = [];

buyNowButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Proceeding to Checkout...");
    });
});

wishlistButtons.forEach(heart => {

    const productName = heart.closest(".product-card")
        .querySelector("h3").textContent;

    if (wishlist.includes(productName)) {

        heart.innerHTML = "❤️";

    } else {

        heart.innerHTML = "🤍";

    }

});

wishlistButtons.forEach((heart) => {

    heart.addEventListener("click", () => {

        const productCard = heart.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent;

        if (wishlist.includes(productName)) {

            wishlist = wishlist.filter(item => item !== productName);
            heart.innerHTML = "🤍";

        } else {

            wishlist.push(productName);
            heart.innerHTML = "❤️";

        }

        wishlistCount.textContent = wishlist.length;

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

    });

});

addcartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const productCard = button.closest(".product-card");

        const productName =
            productCard.querySelector("h3").textContent;

        const priceText =
            productCard.querySelector("p").textContent;

        const price =
            parseFloat(priceText.replace("$", ""));

        count++;
        addCartCount.textContent = count;

        totalPrice += price;
        totalPriceElement.textContent =
            totalPrice.toFixed(2);

        cart.push({
            name: productName,
            price: price
        });

        const li = document.createElement("li");

        li.textContent = `${productName} - $${price}`;

        li.dataset.name = productName;

        cartList.appendChild(li);

        button.textContent = "Added ✅";
        button.disabled = true;
        button.style.backgroundColor = "green";

    });

});
removebtnButtons.forEach(button => {

    button.addEventListener("click", () => {

        const productCard = button.closest(".product-card");

        const productName =
            productCard.querySelector("h3").textContent;

        const priceText =
            productCard.querySelector("p").textContent;

        const price =
            parseFloat(priceText.replace("$", ""));

        cart = cart.filter(product => product.name !== productName);

        const itemToRemove = cartList.querySelector(
            `[data-name="${productName}"]`
        );

        if (itemToRemove) {
            itemToRemove.remove();
        }

        totalPrice -= price;

        if (totalPrice < 0) {
            totalPrice = 0;
        }

        totalPriceElement.textContent = totalPrice.toFixed(2);


        if (count > 0) {
            count--;
        }

        addCartCount.textContent = count;
        const addButton = productCard.querySelector(".add-btn");

        addButton.textContent = "Add to Cart";
        addButton.disabled = false;
        addButton.style.backgroundColor = "";

    });

});



function searchProducts() {

    const searchValue = searchInput.value.toLowerCase();

    productCards.forEach(card => {

        const productName =
            card.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(searchValue)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

searchInput.addEventListener("keyup", searchProducts);

searchButton.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchProducts();

    }

});
console.log(categoryButtons.length);

categoryButtons.forEach(button => {

    button.addEventListener("click", (e) => {

        e.preventDefault();
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.getAttribute("data-category");

        productCards.forEach(card => {

            const productCategory = card.getAttribute("data-category");

            if (category === "all") {
                card.style.display = "";
            }
            else if (productCategory === category) {
                card.style.display = "";
            }
            else {
                card.style.display = "none";
            }

        });

    });

});
const wishlistIcon = document.querySelector(".wishlist-icon");

wishlistIcon.addEventListener("click", () => {
    window.location.href = "wishlist.html";
});