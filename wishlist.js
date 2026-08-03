const wishlistList = document.querySelector("#wishlist-list");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function displayWishlist() {

    wishlistList.innerHTML = "";

    if (wishlist.length === 0) {

        wishlistList.innerHTML = "<h2>Your Wishlist is Empty ❤️</h2>";
        return;

    }

    wishlist.forEach((product, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${product}</span>
            <button class="remove-btn">Remove</button>
        `;

        li.querySelector(".remove-btn").addEventListener("click", () => {

            wishlist.splice(index,1);

            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            displayWishlist();

        });

        wishlistList.appendChild(li);

    });

}

displayWishlist();