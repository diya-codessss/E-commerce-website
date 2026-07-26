const addcartButtons = document.querySelectorAll('.add-btn');
const removebtnButtons = document.querySelectorAll('.remove-from-cart');
const buyNowButtons = document.querySelectorAll('.buy-now');

 const addCartCount = document.querySelector('#cart-count');
 let count = 0;
 addcartButtons.forEach(button => {
 button.addEventListener('click', () => {
    count++;
    addCartCount.textContent = count;
});
 });
 removebtnButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (count > 0) {
            count--;
            addCartCount.textContent = count;
        }
    });
});
buyNowButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert("Proceeding to Checkout...");
    });
});
const wishlistButtons = document.querySelectorAll(".wishlist");

wishlistButtons.forEach((heart) => {
    heart.addEventListener("click", () => {
        if (heart.innerHTML === "❤️") {
            heart.innerHTML = "🤍";
        } else {
            heart.innerHTML = "❤️";
        }
    });
});
const searchInput = document.querySelector(".search-box input");
const productCards = document.querySelectorAll(".product-card");

searchInput.addEventListener("keyup", () => {

});
const categoryButtons = document.querySelectorAll(".nav-bar a");
let totalPrice = 0;

searchInput.addEventListener("keyup", () => {

    const searchValue = searchInput.value.toLowerCase();


productCards.forEach((card) => {

    const productName = card.querySelector("h3").textContent.toLowerCase();
if(productName.includes(searchValue)) {
    card.style.display = "";
} else {
    card.style.display = "none";
}

});
});