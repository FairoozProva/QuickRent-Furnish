import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const port = 5000;

// Add MIME type handling middleware
app.use((req, res, next) => {
  const reqPath = req.path;
  
  if (reqPath.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (reqPath.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (reqPath.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  } else if (reqPath.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  } else if (reqPath.endsWith('.png')) {
    res.setHeader('Content-Type', 'image/png');
  } else if (reqPath.endsWith('.jpg') || reqPath.endsWith('.jpeg')) {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (reqPath.endsWith('.svg')) {
    res.setHeader('Content-Type', 'image/svg+xml');
  }
  
  next();
});

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// Basic API endpoints for testing
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Living Room', slug: 'living-room', description: 'Furniture for your living room', imageUrl: 'https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
    { id: 2, name: 'Bedroom', slug: 'bedroom', description: 'Furniture for your bedroom', imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
    { id: 3, name: 'Dining Room', slug: 'dining-room', description: 'Furniture for your dining room', imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
    { id: 4, name: 'Office', slug: 'office', description: 'Furniture for your home office', imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
  ];
  res.json(categories);
});

// Serve test.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/test.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${port}`);
});
