let parfumData = {};

// Ambil data dari file JSON yang disebut di HTML
fetch(jsonSource)
  .then(res => res.json())
  .then(data => {
    parfumData = data;
    renderAll();
  })
  .catch(err => console.error("Gagal memuat JSON:", err));

function renderAll() {
  generatePriceTable();
  generateAromaList();
}

function generatePriceTable() {
  const priceTable = document.getElementById('priceTable');

  parfumData.priceList.forEach(item => {
    const row = document.createElement('div');
    row.className = 'price-row';

    row.innerHTML = `
      <div class="size-section">
        <div class="price-cell"><h4>Standard</h4><div class="price">${item.size500ml.standard}</div></div>
        <div class="price-cell"><h4>Premium</h4><div class="price">${item.size500ml.premium}</div></div>
      </div>
      <div class="quantity-cell">${item.quantity}</div>
      <div class="size-section">
        <div class="price-cell"><h4>Standard</h4><div class="price">${item.size2lt.standard}</div></div>
        <div class="price-cell"><h4>Premium</h4><div class="price">${item.size2lt.premium}</div></div>
      </div>
    `;

    priceTable.appendChild(row);
  });
}

function generateAromaList() {
  const aromaGrid = document.getElementById('aromaGrid');
  aromaGrid.innerHTML = '';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'aroma-list';
  const leftList = document.createElement('ul');

  const rightColumn = document.createElement('div');
  rightColumn.className = 'aroma-list';
  const rightList = document.createElement('ul');

  parfumData.aromaVariants.forEach(pair => {
    const leftItem = document.createElement('li');
    leftItem.textContent = pair[0];
    leftList.appendChild(leftItem);

    const rightItem = document.createElement('li');
    rightItem.textContent = pair[1];
    rightList.appendChild(rightItem);
  });

  leftColumn.appendChild(leftList);
  rightColumn.appendChild(rightList);

  aromaGrid.appendChild(leftColumn);
  aromaGrid.appendChild(rightColumn);
}