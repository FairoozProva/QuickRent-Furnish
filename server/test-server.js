import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Serve test.html at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/test.html'));
});

// Catch-all route to redirect to test.html for any route
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${port}`);
});
