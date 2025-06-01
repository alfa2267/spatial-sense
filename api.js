// Mock API for dashboard data
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the data directory
app.use('/data', express.static(path.join(__dirname, 'data')));

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'dashboard.json'));
});

// Start the server
app.listen(port, () => {
    console.log(`Mock API server running at http://localhost:${port}`);
});

// Export for testing purposes
module.exports = app;
