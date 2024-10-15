const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

function generateRandomData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports & Outdoors'];
    const products = ['Smartphone', 'Laptop', 'T-shirt', 'Jeans', 'Sofa', 'Lamp', 'Tennis Racket', 'Running Shoes'];

    return {
        kpis: {
            totalUsers: Math.floor(Math.random() * 2000) + 1000,
            revenue: Math.floor(Math.random() * 100000) + 50000,
            activeProjects: Math.floor(Math.random() * 50) + 10,
            customerSatisfaction: Math.floor(Math.random() * 20) + 80
        },
        timeSeriesData: {
            labels: months,
            values: months.map(() => Math.floor(Math.random() * 10000) + 5000)
        },
        categoryData: {
            labels: categories,
            values: categories.map(() => Math.floor(Math.random() * 20000) + 10000)
        },
        scatterData: Array(50).fill().map(() => ({
            x: Math.random() * 10, // Customer satisfaction score (0-10)
            y: Math.random() * 30  // Purchase frequency per month (0-30)
        })),
        largeDataset: Array(100).fill().map((_, index) => [
            `ORD-${1000 + index}`,
            products[Math.floor(Math.random() * products.length)],
            Math.floor(Math.random() * 50) + 1,
            Math.floor(Math.random() * 1000) + 100,
            categories[Math.floor(Math.random() * categories.length)]
        ])
    };
}

app.get('/', (req, res) => {
    const initialData = generateRandomData();
    res.render('dashboard', { initialData: initialData });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Simulate real-time updates
    setInterval(() => {
        const newData = generateRandomData();
        console.log('Emitting data:', newData);
        socket.emit('data-update', newData);
    }, 5000); // Update every 5 seconds

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});