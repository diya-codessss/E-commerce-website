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