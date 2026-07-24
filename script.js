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