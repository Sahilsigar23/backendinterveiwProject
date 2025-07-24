// Basic admin portal JS
const BASE_URL = window.location.origin;
let token = null;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            const data = await res.json();
            token = data.access_token;
            loginSection.style.display = 'none';
            dashboard.style.display = 'block';
            loadDashboard();
        } else {
            loginError.textContent = 'Invalid credentials';
        }
    };

    logoutBtn.onclick = () => {
        token = null;
        loginSection.style.display = 'block';
        dashboard.style.display = 'none';
    };
});

async function loadDashboard() {
    await loadAnalytics();
    await loadProducts();
    renderAddProductForm();
}

async function loadAnalytics() {
    const analyticsDiv = document.getElementById('analytics');
    const res = await fetch(`${BASE_URL}/analytics/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        const data = await res.json();
        analyticsDiv.innerHTML = `<h3>Analytics</h3>
            <p>Total Inventory Value: $${data.total_value}</p>
            <p>Total Products: ${data.total_products}</p>`;
    } else {
        analyticsDiv.innerHTML = '<p>Could not load analytics.</p>';
    }
}

async function loadProducts() {
    const productsDiv = document.getElementById('products');
    const res = await fetch(`${BASE_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        const data = await res.json();
        productsDiv.innerHTML = `<h3>Products</h3>` + data.map(product => `
            <div>
                <b>${product.name}</b> (SKU: ${product.sku})<br/>
                Type: ${product.type} | Qty: ${product.quantity} | Price: $${product.price}<br/>
                <button onclick="showUpdateForm(${product.id}, ${product.quantity})">Update Quantity</button>
            </div>
        `).join('<hr/>');
    } else {
        productsDiv.innerHTML = '<p>Could not load products.</p>';
    }
}

function renderAddProductForm() {
    const addDiv = document.getElementById('add-product');
    addDiv.innerHTML = `
        <h3>Add Product</h3>
        <form id="add-form">
            <input type="text" id="add-name" placeholder="Name" required />
            <input type="text" id="add-type" placeholder="Type" required />
            <input type="text" id="add-sku" placeholder="SKU" required />
            <input type="text" id="add-image" placeholder="Image URL" required />
            <input type="text" id="add-desc" placeholder="Description" required />
            <input type="number" id="add-qty" placeholder="Quantity" required />
            <input type="number" id="add-price" placeholder="Price" required step="0.01" />
            <button type="submit">Add</button>
        </form>
        <div id="add-error" style="color:red;"></div>
    `;
    document.getElementById('add-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('add-name').value,
            type: document.getElementById('add-type').value,
            sku: document.getElementById('add-sku').value,
            image_url: document.getElementById('add-image').value,
            description: document.getElementById('add-desc').value,
            quantity: parseInt(document.getElementById('add-qty').value),
            price: parseFloat(document.getElementById('add-price').value)
        };
        const res = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            loadProducts();
            document.getElementById('add-error').textContent = '';
        } else {
            document.getElementById('add-error').textContent = 'Failed to add product.';
        }
    };
}

function showUpdateForm(id, currentQty) {
    const qty = prompt('Enter new quantity:', currentQty);
    if (qty !== null) {
        updateQuantity(id, parseInt(qty));
    }
}

async function updateQuantity(id, quantity) {
    const res = await fetch(`${BASE_URL}/products/${id}/quantity`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
    });
    if (res.ok) {
        loadProducts();
    } else {
        alert('Failed to update quantity');
    }
} 