const Pages = {
    async loadProducts() {
        const products = await API.fetchProducts();
        return `
            <div class="page-header">
                <h2 class="section-title">সকল প্রোডাক্ট</h2>
                <button class="btn-primary" onclick="Pages.showAddProduct()">
                    <i class="fas fa-plus"></i> নতুন প্রোডাক্ট
                </button>
            </div>
            <div class="products-grid">
                ${products.map(product => `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.banglaTitle}">
                        <h3>${product.banglaTitle}</h3>
                        <p class="price">${product.banglaPrice}</p>
                        <div class="product-actions">
                            <button onclick="Pages.editProduct(${product.id})">
                                <i class="fas fa-edit"></i> সম্পাদনা
                            </button>
                            <button onclick="Pages.deleteProduct(${product.id})">
                                <i class="fas fa-trash"></i> মুছুন
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    async loadNewOrders() {
        const orders = await API.getOrders();
        const newOrders = orders.filter(order => order.status === 'pending');
        return `
            <h2 class="section-title">নতুন অর্ডার</h2>
            <div class="orders-grid">
                ${newOrders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <h3>অর্ডার #${order.id}</h3>
                            <span class="status-badge pending">অপেক্ষমান</span>
                        </div>
                        <div class="order-details">
                            <p>কাস্টমার: ${order.customer}</p>
                            <p>মোট: ${order.total}</p>
                        </div>
                        <div class="order-actions">
                            <button onclick="Pages.processOrder(${order.id})">
                                <i class="fas fa-check"></i> প্রক্রিয়া শুরু করুন
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    async loadCategories() {
        const categories = await API.getCategories();
        return `
            <div class="page-header">
                <h2 class="section-title">ক্যাটাগরি সমূহ</h2>
                <button class="btn-primary" onclick="Pages.showAddCategory()">
                    <i class="fas fa-plus"></i> নতুন ক্যাটাগরি
                </button>
            </div>
            <div class="categories-list">
                ${categories.map(category => `
                    <div class="category-list-item">
                        <div class="category-info">
                            <img src="${category.icon}" alt="${category.name}">
                            <h3>${category.name}</h3>
                        </div>
                        <div class="category-actions">
                            <button onclick="Pages.editCategory('${category.id}')">
                                <i class="fas fa-edit"></i> সম্পাদনা
                            </button>
                            <button onclick="Pages.deleteCategory('${category.id}')">
                                <i class="fas fa-trash"></i> মুছুন
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
