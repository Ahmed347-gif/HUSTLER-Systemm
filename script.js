// Product data storage
let products = JSON.parse(localStorage.getItem('hustlerProducts')) || [];

// DOM Elements
const productForm = document.getElementById('product-form');
const productsList = document.getElementById('productsList');
const searchInput = document.getElementById('searchInput');
const logoUpload = document.getElementById('logo-upload');
const logoImage = document.getElementById('logo-image');

// Form Elements
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productCategory = document.getElementById('product-category');
const buyerName = document.getElementById('buyer-name');
const productQuantity = document.getElementById('product-quantity');
const orderDate = document.getElementById('order-date');

// Event Listeners
productForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', handleSearch);
logoUpload.addEventListener('change', handleLogoUpload);

// Initialize the application
function init() {
    // Load saved logo if exists
    const savedLogo = localStorage.getItem('hustlerLogo');
    if (savedLogo) {
        logoImage.src = savedLogo;
    }
    // Set default date to today
    orderDate.valueAsDate = new Date();
    loadProducts();
    renderProducts();
    updateStats();
}

// Handle logo upload
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoImage.src = e.target.result;
            localStorage.setItem('hustlerLogo', e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const quantity = parseInt(productQuantity.value);
    
    // Create multiple products based on quantity
    for (let i = 0; i < quantity; i++) {
        const product = {
            id: Date.now() + i, // Ensure unique ID for each product
            name: productName.value,
            price: parseFloat(productPrice.value),
            category: productCategory.value,
            buyer: buyerName.value,
            orderDate: orderDate.value,
            createdAt: new Date().toISOString()
        };
        products.push(product);
    }

    saveProducts();
    renderProducts();
    productForm.reset();
    // Reset date to today after form submission
    orderDate.valueAsDate = new Date();
    showNotification(`${quantity} products added successfully!`, 'success');
}

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('hustlerProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('hustlerProducts', JSON.stringify(products));
    updateStats();
}

// Render products to the table
function renderProducts(productsToRender = products) {
    productsList.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsList.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>No products found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>EGP:${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
            <td>${product.buyer}</td>
            <td>${new Date(product.orderDate).toLocaleDateString()}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        productsList.appendChild(row);
    });
}

// Handle search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.buyer.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    productName.value = product.name;
    productPrice.value = product.price;
    productCategory.value = product.category;
    buyerName.value = product.buyer;
    orderDate.value = product.orderDate;

    // Remove the product from the array
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderProducts();
    showNotification('Product ready for editing', 'info');
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        renderProducts();
        showNotification('Product deleted successfully', 'success');
    }
}

// Delete all products
function deleteAllProducts() {
    if (confirm('Are you sure you want to delete all products?')) {
        products = [];
        saveProducts();
        renderProducts();
        showNotification('All products have been deleted', 'success');
    }
}

// Update statistics
function updateStats() {
    const totalProducts = products.length;
    const totalAmount = products.reduce((sum, product) => sum + parseFloat(product.price), 0);
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the application
init(); 