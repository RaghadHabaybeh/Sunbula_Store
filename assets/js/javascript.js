let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

    const existingIndex = cart.findIndex((item) => item.name === name);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ image, name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI(); 
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const totalItemsSpan = document.getElementById("total-items");
  const totalPriceSpan = document.getElementById("total-price");

  function updateCartCount() {
    let total = 0;
    cart.forEach(item => total += item.quantity);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = total;
  }

  function updateCartUI() {
    cartContainer.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
      totalItemsSpan.textContent = "0";
      totalPriceSpan.textContent = "0.00";
      updateCartCount();
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
    updateCartCount();

    const oldCheckout = document.querySelector(".checkout-wrapper");
    if (oldCheckout) oldCheckout.remove();

    const checkoutWrapper = document.createElement('div');
    checkoutWrapper.className = "text-center checkout-wrapper";
    const button = document.createElement('button');
    button.className = "btn btn-danger fs-4 hover-effect mt-4";
    button.innerText = "Checkout";
    checkoutWrapper.appendChild(button);
    cartContainer.appendChild(checkoutWrapper);

    button.onclick = function () {
      location.href = "cheakout.html";
    };

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

        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();

            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        });
      });
    });
  }

  updateCartUI();

  document.body.style.backgroundColor = "#e1d7da";
});
 



document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("checkoutForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    let isValid = true;

    function validateField(field, errorElementId, message) {
      const errorElement = document.getElementById(errorElementId);
      if (field.value.trim() === "" || field.value === "Title" || field.value === "Region/country") {
        errorElement.textContent = message;
        isValid = false;
      } else {
        errorElement.textContent = "";
      }
    }

    validateField(document.getElementById("email"), "email-error", "email required");
    validateField(document.getElementById("first-name"), "Firstname-error", "first name required");
    validateField(document.getElementById("last-name"), "lastname-error", "last name required");
    validateField(document.getElementById("address"), "lastname-error","address required");
        validateField(document.getElementById("City"), "city-error", "city required");

    
    const selects = document.querySelectorAll("select#title");
    if (selects.length > 0) {
      const titleSelect = selects[0];
      if (titleSelect.value === "Title") {
        if (!titleSelect.nextElementSibling || !titleSelect.nextElementSibling.classList.contains("error-message")) {
          const err = document.createElement("div");
          err.className = "error-message";
          err.textContent = "title required";
          titleSelect.after(err);
        } else {
          titleSelect.nextElementSibling.textContent ="title required";
        }
        isValid = false;
      } else {
        if (titleSelect.nextElementSibling && titleSelect.nextElementSibling.classList.contains("error-message")) {
          titleSelect.nextElementSibling.textContent = "";
        }
      }
    }

    if (selects.length > 1) {
      const regionSelect = selects[1];
      if (regionSelect.value === "Region/country") {
        if (!regionSelect.nextElementSibling || !regionSelect.nextElementSibling.classList.contains("error-message")) {
          const err = document.createElement("div");
          err.className = "error-message";
          err.textContent = "country required";
          regionSelect.after(err);
        } else {
          regionSelect.nextElementSibling.textContent = "country required";
        }
        isValid = false;
      } else {
        if (regionSelect.nextElementSibling && regionSelect.nextElementSibling.classList.contains("error-message")) {
          regionSelect.nextElementSibling.textContent = "";
        }
      }
    }
    if (isValid) {
      form.submit();
    }
  });
});





