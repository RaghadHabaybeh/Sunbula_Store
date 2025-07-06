window.addEventListener('load', function () {
  setTimeout(() => {
    let loading1 = document.getElementById('loading');
    if (loading1) {
      loading1.style.display = 'none';
      let content = document.getElementById('main-content');
      if (content) content.style.display = 'block';
    }
  }, 500);
}); 

document.querySelectorAll(".product-card .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const image = card.querySelector("img").src;
    const name = card.querySelector(".product-name").innerText.trim();
    const priceText = card.querySelector(".price").innerText.trim();
    const price = parseFloat(priceText.replace(/\$/g, '').split(" ")[0]);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex((item) => item.name === name);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ image, name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  });
});

 document.addEventListener("DOMContentLoaded", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const cartContainer = document.getElementById("cart-items");
      const totalItemsSpan = document.getElementById("total-items");
      const totalPriceSpan = document.getElementById("total-price");

      function updateCartUI() {
        cartContainer.innerHTML = "";
        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
          cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
          totalItemsSpan.textContent = "0";
          totalPriceSpan.textContent = "0.00";
          return;
        }

        cart.forEach((product, index) => {
          totalItems += product.quantity;
          totalPrice += product.quantity * product.price;

          const productCard = document.createElement("div");
          productCard.classList.add("col-12", "d-flex", "align-items-center", "border", "p-3", "cart-item");

          productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100" height="100" class="me-3" style="object-fit:cover;">
            <div class="flex-grow-1">
              <h5>${product.name}</h5>
              <p>Price: $${product.price}</p>
              <div class="d-flex align-items-center">
                <label class="me-2">Quantity:</label>
                <input type="number" class="form-control form-control-sm quantity-input" value="${product.quantity}" data-index="${index}" min="1" style="width: 70px;">
              </div>
            </div>
            <button class="btn btn-danger btn-sm ms-3 remove-btn" data-index="${index}">Remove</button>
          `;
          

          cartContainer.appendChild(productCard);
        });

        totalItemsSpan.textContent = totalItems;
        totalPriceSpan.textContent = totalPrice.toFixed(2);

        attachEventListeners();
      }

      function attachEventListeners() {
        document.querySelectorAll(".quantity-input").forEach(input => {
          input.addEventListener("input", function () {
            const index = this.getAttribute("data-index");
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
              cart[index].quantity = newQuantity;
              localStorage.setItem("cart", JSON.stringify(cart));
              updateCartUI();
            }
          });
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
          button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
          });
        });
      }

      updateCartUI();
      // updatingcount ()



      
      if (cart.length > 0) {
  const Checkoutbtn = document.createElement('div');
  const button = document.createElement('button');
  button.className = "btn btn-danger  fs-4 hover-effect mt-4";
  button.innerText = "Checkout";
  Checkoutbtn.className = "text-center";
  Checkoutbtn.appendChild(button);
  cartContainer.appendChild(Checkoutbtn);
  button.onclick = function () {
    location.href = "cheakout.html";
  }
}
document.body.style.backgroundColor="#e1d7da";

  // const cartcount=document.getElementById('cart-count')


// function updatingcount (){
// let totalcount=0
// for(let i=0;i<cart.length;i++){
//   totalcount+=cart[i].quantity
//   cartcount.innerText=totalcount
// }

// }



});



