const addcartButtons = document.querySelectorAll('.add-btn');
const removebtnButtons = document.querySelectorAll('.remove-btn');
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
const categoryButtons = document.querySelectorAll(".nav-bar a");
let totalPrice = 0;
let cart = [];

const cartList = document.querySelector("#cart-list");

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
const totalPriceElement = document.getElementById("total-price");
addcartButtons.forEach(button => {
    button.addEventListener('click', () => {

        const productCard = button.closest('.product-card');
        const priceElement = productCard.querySelector('p');
        const priceText = priceElement.textContent;

        const price = parseFloat(priceText.replace('$', ''));
        totalPrice += price;
        totalPriceElement.textContent = totalPrice.toFixed(2);
        const productName = productCard.querySelector("h3").textContent;

cart.push({
    name: productName,
    price: price
});
const li = document.createElement("li");

li.textContent = `${productName} - $${price}`;

cartList.appendChild(li);
 button.textContent = "Added ✅";
        button.disabled = true;
        button.style.backgroundColor = "green";
    });
});
removebtnButtons.forEach(button => {
    button.addEventListener("click", () => {

        const productCard = button.closest(".product-card");

        const priceElement = productCard.querySelector("p");
        const priceText = priceElement.textContent;

        const price = parseFloat(priceText.replace("$", ""));

        totalPrice -= price;

        if (totalPrice < 0) {
            totalPrice = 0;
        }

        totalPriceElement.textContent = totalPrice.toFixed(2);

        if (count > 0) {
            count--;
            addCartCount.textContent = count;
        }

        // Add to Cart button reset
        const addButton = productCard.querySelector(".add-btn");

        if (addButton) {
            addButton.textContent = "Add to Cart";
            addButton.disabled = false;
            addButton.style.backgroundColor = "";
        }

    });
});
function searchProducts() {

    const searchValue = searchInput.value.toLowerCase();

    productCards.forEach((card) => {

        const productName = card.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(searchValue)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

}
const searchButton = document.querySelector(".search-box button");

searchInput.addEventListener("keyup", searchProducts);

searchButton.addEventListener("click", searchProducts);
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchProducts();
    }

});
const productName = productCard.querySelector("h3").textContent;
cart = cart.filter(product => product.name !== productName);
const items = cartList.querySelectorAll("li");
items.forEach((li) => {
    if (li.textContent.includes(productName)) {
        li.remove();
    }
}); 
  

