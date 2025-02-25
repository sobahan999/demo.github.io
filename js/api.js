const API = {
    async fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products?limit=50');
            const products = await response.json();
            
            // Transform products to include Bangla properties
            return products.map(product => ({
                ...product,
                banglaTitle: this.convertToBangla(product.title),
                banglaDescription: this.convertToBangla(product.description),
                banglaPrice: `৳${product.price * 100}` // Converting to BDT
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    convertToBangla(text) {
        // Simple function to simulate Bangla text
        // In a real app, you'd use proper translation
        return text + ' (বাংলা)';
    },

    async getOrders() {
        // Simulated orders data
        return [
            {
                id: 1,
                customer: 'কামাল হোসেন',
                items: 3,
                total: '৳4,500',
                status: 'pending'
            },
            // ... more orders
        ];
    },

    categoryData: {
        "electronics": {
            name: "ইলেকট্রনিক্স",
            icon: "https://i.ibb.co/0JKpmgd/electronics.png",
            gradient: "linear-gradient(135deg, #4a90e2, #357abd)",
            borderColor: "#4a90e2"
        },
        "jewelry": {
            name: "জুয়েলারি",
            icon: "https://i.ibb.co/TPbZ5QK/jewelry.png",
            gradient: "linear-gradient(135deg, #f1c40f, #f39c12)",
            borderColor: "#f1c40f"
        },
        "men's clothing": {
            name: "পুরুষদের পোশাক",
            icon: "https://i.ibb.co/8XwF0SD/mens-fashion.png",
            gradient: "linear-gradient(135deg, #2c3e50, #34495e)",
            borderColor: "#2c3e50"
        },
        "women's clothing": {
            name: "মহিলাদের পোশাক",
            icon: "https://i.ibb.co/VxJvGkt/womens-fashion.png",
            gradient: "linear-gradient(135deg, #e74c3c, #c0392b)",
            borderColor: "#e74c3c"
        }
    },

    async getCategories() {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        
        return categories.map(category => ({
            id: category,
            ...this.categoryData[category],
            defaultIcon: "https://i.ibb.co/K7JbzY0/default-category.png"
        }));
    },

    async getStatistics() {
        // Simulated statistics data
        return {
            salesGrowth: 15.8,
            customerGrowth: 12.3,
            productGrowth: 5.7,
            monthlyRevenue: '450,000',
            monthlyGrowth: 8.9,
            activeCustomers: 1234,
            dailyOrders: 45,
            avgOrderValue: '3,500',
            returnRate: 2.5,
            satisfaction: 98,
            salesData: [
                { date: '১লা জুন', sales: 25000 },
                { date: '২রা জুন', sales: 35000 },
                { date: '৩রা জুন', sales: 28000 },
                // Add more data points...
            ]
        };
    }
};
