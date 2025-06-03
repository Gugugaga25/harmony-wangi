let allProducts = [];
let currentType = "all";
let currentCategory = "all";

fetch("other.json")
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    renderProducts(allProducts);
    setupEventListeners();
  })
  .catch(err => {
    console.error("Gagal memuat JSON:", err);
  });

function renderProducts(data) {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  data.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-gender", product.gender);
    card.setAttribute("data-category", product.category);

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
      </div>
    `;

    grid.appendChild(card);
  });
}

function setupEventListeners() {
  const typeButtons = document.querySelectorAll(".gender-filter");
  const categoryButtons = document.querySelectorAll(".category");
  const searchInput = document.getElementById("searchInput");

  typeButtons.forEach(button => {
    button.addEventListener("click", () => {
      typeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentType = button.dataset.gender;
      filterProducts();
    });
  });

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentCategory = button.dataset.category;
      filterProducts();
    });
  });

  searchInput.addEventListener("input", filterProducts);
}

function filterProducts() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allProducts.filter(product => {
    const name = product.name.toLowerCase();
    const genderMatch = currentType === "all" || product.gender === currentType;
    const categoryMatch = currentCategory === "all" || product.category === currentCategory;
    const keywordMatch = name.includes(keyword);
    return genderMatch && categoryMatch && keywordMatch;
  });

  renderProducts(filtered);
}
