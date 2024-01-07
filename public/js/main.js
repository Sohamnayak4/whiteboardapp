document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    
    socket = io('http://localhost:3000');

    let drawing = false;
  
    // Set canvas size
    canvas.width = window.innerWidth * 0.8;  // Adjust as needed
    canvas.height = window.innerHeight * 0.6; // Adjust as needed
  
    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
  
    function startDrawing(e) {
      drawing = true;
      draw(e);
    }
  
    function draw(e) {
      if (!drawing) return;
  
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
  
      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  
      // Emit drawing data to the server
      socket.emit('draw', {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
        drawing: drawing,
      });
    }
  
    function stopDrawing() {
      drawing = false;
      ctx.beginPath();
    }
  
    // Socket.IO event listener for receiving drawing data from other clients
    socket.on('draw', (data) => {
      if (!drawing) return;
  
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
  
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
    });
  
    // Clear the canvas on a "clear" event
    socket.on('clear', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  
    const clearButton = document.getElementById('clearButton');
  
    // Event listener for the clear button
    clearButton.addEventListener('click', () => {
      // Clear the canvas locally
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Emit a clear event to the server
      socket.emit('clear');
    });
  });
  



  