const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory for views
app.use(express.static(path.join(__dirname, 'public')));

// Handle new client connections
io.on('connection', (socket) => {
    console.log('A client connected with id:', socket.id);

    // Handle location data from the client
    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
        console.log('Client disconnected with id:', socket.id);
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
