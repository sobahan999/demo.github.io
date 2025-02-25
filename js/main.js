document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    loadDashboard();
    
    // Setup navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            loadPage(page);
            
            // Update active state
            document.querySelector('.menu-item.active')?.classList.remove('active');
            e.currentTarget.classList.add('active');
        });
    });

    // Add transition styles to mainContainer
    document.getElementById('main-container').style.transition = 'all 0.3s ease-out';

    initializeMobileMenu();
    handleResponsiveLayout();
});

async function loadDashboard() {
    const mainContainer = document.getElementById('main-container');
    const products = await API.fetchProducts();
    const orders = await API.getOrders();
    const categories = await API.getCategories();
    const stats = await API.getStatistics();
    
    mainContainer.innerHTML = `
        <div class="dashboard-stats">
            <div class="stat-card" style="--card-start-color: #4a90e2; --card-end-color: #357abd">
                <i class="fas fa-shopping-cart icon"></i>
                <h3>মোট বিক্রয়</h3>
                <p>৳${calculateTotalSales(orders)}</p>
                <span class="trend up">
                    <i class="fas fa-arrow-up"></i> ${stats.salesGrowth}%
                </span>
            </div>
            <div class="stat-card" style="--card-start-color: #2ecc71; --card-end-color: #27ae60">
                <i class="fas fa-users icon"></i>
                <h3>সক্রিয় গ্রাহক</h3>
                <p>${stats.activeCustomers}</p>
                <span class="trend up">
                    <i class="fas fa-arrow-up"></i> ${stats.customerGrowth}%
                </span>
            </div>
            <div class="stat-card" style="--card-start-color: #e74c3c; --card-end-color: #c0392b">
                <i class="fas fa-box icon"></i>
                <h3>মোট প্রোডাক্ট</h3>
                <p>${products.length}</p>
                <span class="trend ${stats.productGrowth >= 0 ? 'up' : 'down'}">
                    <i class="fas fa-arrow-${stats.productGrowth >= 0 ? 'up' : 'down'}"></i> 
                    ${Math.abs(stats.productGrowth)}%
                </span>
            </div>
            <div class="stat-card" style="--card-start-color: #f1c40f; --card-end-color: #f39c12">
                <i class="fas fa-chart-line icon"></i>
                <h3>এই মাসের বিক্রয়</h3>
                <p>৳${stats.monthlyRevenue}</p>
                <span class="trend up">
                    <i class="fas fa-arrow-up"></i> ${stats.monthlyGrowth}%
                </span>
            </div>
        </div>

        <div class="analytics-section">
            <h2 class="section-title">বিক্রয় পরিসংখ্যান</h2>
            <div class="chart-container" id="salesChart"></div>
            <div class="stat-grid">
                <div class="mini-stat">
                    <h4>দৈনিক অর্ডার</h4>
                    <div class="value">${stats.dailyOrders}</div>
                </div>
                <div class="mini-stat">
                    <h4>গড় অর্ডার মূল্য</h4>
                    <div class="value">৳${stats.avgOrderValue}</div>
                </div>
                <div class="mini-stat">
                    <h4>রিটার্ন রেট</h4>
                    <div class="value">${stats.returnRate}%</div>
                </div>
                <div class="mini-stat">
                    <h4>গ্রাহক সন্তুষ্টি</h4>
                    <div class="value">${stats.satisfaction}%</div>
                </div>
            </div>
        </div>

        <h2 class="section-title">ক্যাটাগরি সমূহ</h2>
        <div class="categories-grid">
            ${renderCategories(categories, products)}
        </div>
        
        <div class="recent-orders">
            <h2 class="section-title">সাম্প্রতিক অর্ডার</h2>
            <div class="orders-table">
                ${renderRecentOrders(orders)}
            </div>
        </div>
    `;

    // Initialize chart
    initializeSalesChart();

    // Initialize animations after content is loaded
    initializeAnimations();
}

function renderCategories(categories, products) {
    return categories.map(category => {
        const productCount = products.filter(p => p.category === category.id).length;
        return `
            <div class="category-card" 
                 onclick="loadCategory('${category.id}')"
                 style="background: ${category.gradient}">
                <div class="category-icon">
                    <img src="${category.icon}" 
                         alt="${category.name}"
                         onerror="this.src='${category.defaultIcon}'"
                         loading="lazy">
                </div>
                <h3 class="category-name">${category.name}</h3>
                <div class="category-count">${productCount} টি প্রোডাক্ট</div>
            </div>
        `;
    }).join('');
}

function renderRecentOrders(orders) {
    if (orders.length === 0) {
        return '<div class="empty-state">কোন অর্ডার নেই</div>';
    }

    return `
        <table class="orders-list">
            <thead>
                <tr>
                    <th>অর্ডার আইডি</th>
                    <th>কাস্টমার</th>
                    <th>মোট</th>
                    <th>স্ট্যাটাস</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.total}</td>
                        <td><span class="status-badge ${order.status}">${getStatusText(order.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'অপেক্ষমান',
        'processing': 'প্রক্রিয়াধীন',
        'completed': 'সম্পন্ন',
        'cancelled': 'বাতিল'
    };
    return statusMap[status] || status;
}

function calculateTotalSales(orders) {
    return orders.reduce((total, order) => {
        const amount = parseInt(order.total.replace(/[^\d]/g, ''));
        return total + amount;
    }, 0).toLocaleString('bn-BD');
}

function loadPage(page) {
    const mainContainer = document.getElementById('main-container');
    mainContainer.style.opacity = '0';
    mainContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        mainContainer.innerHTML = '<div class="loading-animation"><div class="loading-bar"></div></div>';
        mainContainer.style.opacity = '1';
        mainContainer.style.transform = 'translateY(0)';
        
        switch(page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'products-list':
                Pages.loadProducts().then(html => {
                    mainContainer.innerHTML = html;
                });
                break;
            case 'orders-new':
                Pages.loadNewOrders().then(html => {
                    mainContainer.innerHTML = html;
                });
                break;
            case 'orders-processing':
                Pages.loadProcessingOrders().then(html => {
                    mainContainer.innerHTML = html;
                });
                break;
            case 'orders-completed':
                Pages.loadCompletedOrders().then(html => {
                    mainContainer.innerHTML = html;
                });
                break;
            case 'categories':
                Pages.loadCategories().then(html => {
                    mainContainer.innerHTML = html;
                });
                break;
            case 'products-add':
                mainContainer.innerHTML = Pages.showAddProduct();
                break;
            default:
                mainContainer.innerHTML = '<h2>পেজটি পাওয়া যায়নি</h2>';
        }
    }, 300);
}

function initializeSalesChart() {
    // Add chart initialization code here
    // You can use Chart.js or any other charting library
}

function initializeAnimations() {
    // Add animation index to stat cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.setProperty('--index', index);
    });

    // Add animation index to category cards
    document.querySelectorAll('.category-card').forEach((card, index) => {
        card.style.setProperty('--index', index);
    });

    // Add animation index to mini stats
    document.querySelectorAll('.mini-stat').forEach((stat, index) => {
        stat.style.setProperty('--index', index);
    });

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.classList.add('btn-ripple');
    });
}

function initializeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.querySelector('.top-bar').prepend(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('expanded');
        }
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        sidebar.classList.remove('expanded');
    });
}

function handleResponsiveLayout() {
    const updateLayout = () => {
        const width = window.innerWidth;
        const mainContainer = document.getElementById('main-container');
        
        if (width <= 768) {
            mainContainer.classList.add('mobile-view');
            document.body.classList.add('mobile');
        } else {
            mainContainer.classList.remove('mobile-view');
            document.body.classList.remove('mobile');
        }
    };

    window.addEventListener('resize', updateLayout);
    updateLayout();
}

// Add more functionality as needed...
