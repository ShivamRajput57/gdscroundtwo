const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const initialData = {
        kpis: {
            totalUsers: 1000,
            revenue: 50000,
            activeProjects: 25,
            customerSatisfaction: 92
        },
        chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            values: [65, 59, 80, 81, 56]
        }
    };
    res.render('dashboard', { initialData: initialData });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Simulate real-time updates
    setInterval(() => {
        const newData = {
            kpis: {
                totalUsers: Math.floor(Math.random() * 2000) + 1000,
                revenue: Math.floor(Math.random() * 100000) + 50000,
                activeProjects: Math.floor(Math.random() * 50) + 10,
                customerSatisfaction: Math.floor(Math.random() * 20) + 80
            },
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                values: Array(5).fill().map(() => Math.floor(Math.random() * 100) + 50)
            }
        };
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