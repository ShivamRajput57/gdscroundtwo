const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

function generateRandomData() {
    return {
        kpis: {
            totalUsers: Math.floor(Math.random() * 2000) + 1000,
            revenue: Math.floor(Math.random() * 100000) + 50000,
            activeProjects: Math.floor(Math.random() * 50) + 10,
            customerSatisfaction: Math.floor(Math.random() * 20) + 80
        },
        timeSeriesData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: Array(6).fill().map(() => Math.floor(Math.random() * 100) + 50)
        },
        categoryData: {
            labels: ['Category A', 'Category B', 'Category C', 'Category D'],
            values: Array(4).fill().map(() => Math.floor(Math.random() * 100) + 20)
        },
        scatterData: Array(20).fill().map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100
        })),
        largeDataset: Array(100).fill().map((_, index) => [
            index + 1,
            `Item ${index + 1}`,
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
            ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
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