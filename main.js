let currentProducts = products;
let categories = new Set();
let basket = [];
let addToBasketButtons;

const productsSection = document.querySelector(".products");

const addToBasket = (e) => {
    const selectedId = parseInt(e.target.dataset.id);
    const key = currentProducts.findIndex((product) => product.id === selectedId);
    basket.push(currentProducts[key]);
  
    const basketTotal = basket.reduce((sum, product) => sum + product.price, 0);
  
    basketTotal > 0
      ? basketClearBtn.classList.add("active")
      : basketClearBtn.classList.remove("active");
  
    basketAmountSpan.innerHTML = `${basketTotal.toFixed(2)} zł`;
};

const renderProducts = (items) => {
    productsSection.innerHTML = "";
    items.forEach(item => {
        const newProduct = document.createElement("div");
        newProduct.className = `product-item ${item.sale ? "on-sale" : ""}`;
        newProduct.innerHTML = `
        <img src="${item.image}" alt="product-image"/>
        <p class="product-name">${item.name}</p>
        <p class="product-description">${item.description}</p>
        <div class="product-price">
          <span class="price">${item.price.toFixed(2)} zł</span>
          ${item.sale ? `<span class="price-sale">${(item.price - item.saleAmount).toFixed(2)} zł</span>` : ""}
        </div>
        <button class="product-add-to-basket-btn" data-id="${item.id}">Dodaj do koszyka</button>
        ${item.sale ? `<p class="product-item-sale-info">Promocja</p>` : ""}
        `;
        productsSection.appendChild(newProduct);
    });

    addToBasketButtons = document.querySelectorAll(".product-add-to-basket-btn");
    addToBasketButtons.forEach((btn) =>
      btn.addEventListener("click", addToBasket)
    );
};

const renderCategories = (items) => {
    for (let i = 0; i < items.length; i++) {
        categories.add(items[i].category);
    }

    const categoriesItems = document.querySelector(".categories-items");
    categoriesItems.innerHTML = ""; // Wyczyść istniejące kategorie

    categories = ["All", ...categories];

    categories.forEach((category, index) => {
        const newCategory = document.createElement("button");
        newCategory.innerHTML = category;
        newCategory.dataset.category = category;

        if (index === 0) newCategory.classList.add("active");

        categoriesItems.appendChild(newCategory);
    });

    const categoriesButtons = document.querySelectorAll(".categories-items button");

    categoriesButtons.forEach((btn) => 
        btn.addEventListener("click", (e) => { 
            const category = e.target.dataset.category;

            categoriesButtons.forEach((btn) => btn.classList.remove("active"));
            e.target.classList.add("active");

            currentProducts = products;

            if (category !== "All") {
                currentProducts = currentProducts.filter(
                (product) => product.category === category
            );
        }   
        renderProducts(currentProducts);
    })
    );
};

window.onload = () => {
    renderProducts(currentProducts);
    renderCategories(currentProducts);
};

const searchBarInput = document.querySelector(".search-bar-input");

searchBarInput.addEventListener("input", (e) => {
    const search = e.target.value.toLowerCase();

    const foundProducts = currentProducts.filter((product) => {
        if (product.name.toLowerCase().includes(search)) {
            return product;
        }
    });

    const emptyState = document.querySelector(".empty-state");

    foundProducts.length === 0 
        ? emptyState.classList.add("active") 
        : emptyState.classList.remove("active");

    renderProducts(foundProducts);
});

const basketAmountSpan = document.querySelector(".basket-amount");
const basketClearBtn = document.querySelector(".basket-clear-btn");

const clearBasket = () => {
  basketAmountSpan.innerHTML = "Koszyk";
  basket = [];
  basketClearBtn.classList.remove("active");
};

basketClearBtn.addEventListener("click", clearBasket);
