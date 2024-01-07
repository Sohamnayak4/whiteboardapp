import express from 'express';
import http from 'http';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Event listener for drawing data received from a client
  socket.on('draw', (data) => {
    // Broadcast the drawing data to all connected clients
    socket.broadcast.emit('draw', data);
  });

  // Event listener for clearing the canvas received from a client
  socket.on('clear', () => {
    // Broadcast the clear event to all connected clients
    socket.broadcast.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
