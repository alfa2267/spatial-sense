const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure CORS
app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure static file serving with proper caching
const staticOptions = {
    etag: true,
    lastModified: true,
    maxAge: '1h',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
};

// Serve static files with proper caching headers
app.use(express.static(__dirname, staticOptions));
app.use('/css', express.static(path.join(__dirname, 'css'), staticOptions));
app.use('/js', express.static(path.join(__dirname, 'js'), staticOptions));
app.use('/sections', express.static(path.join(__dirname, 'sections'), staticOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(path.join(DATA_DIR, 'clients'), { recursive: true });
    await fs.mkdir(path.join(DATA_DIR, 'invoices'), { recursive: true });
    await fs.mkdir(path.join(DATA_DIR, 'projects'), { recursive: true });
  } catch (err) {
    console.error('Error creating data directories:', err);
  }
};

// Initialize sample data
const ensureSampleData = async () => {
  try {
    console.log('Checking for sample data...');
    const clients = await readData('clients');
    console.log(`Found ${clients.length} existing clients`);
    
    if (clients.length === 0) {
      console.log('No clients found. Creating sample data...');
      console.log('No sample data found. Initializing...');
      // Add sample clients if none exist
      const sampleClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+44 7123 456789',
        address: '123 Smart Street, London, UK',
        company: 'Johnson & Co',
        notes: 'Interested in full home automation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await writeData('clients', [sampleClient]);
      console.log('Sample client created successfully');
    } else {
      console.log('Using existing client data');
    }
  } catch (err) {
    console.error('Error initializing sample data:', err);
  }
};

// Initialize data storage
const initStorage = async () => {
  await ensureDataDir();
  
  // Create initial data files if they don't exist
  const initialData = {
    clients: [],
    invoices: [],
    projects: []
  };

  for (const [key, value] of Object.entries(initialData)) {
    try {
      const filePath = path.join(DATA_DIR, `${key}.json`);
      await fs.access(filePath);
    } catch (err) {
      await fs.writeFile(
        path.join(DATA_DIR, `${key}.json`),
        JSON.stringify(value, null, 2)
      );
    }
  }
};

// Generic CRUD operations
const readData = async (collection) => {
  try {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    console.log(`Reading data from ${filePath}`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      console.log(`File ${filePath} does not exist, returning empty array`);
      return [];
    }
    
    const data = await fs.readFile(filePath, 'utf-8');
    const parsedData = data ? JSON.parse(data) : [];
    console.log(`Read ${parsedData.length} ${collection} records`);
    return parsedData;
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    throw err;
  }
};

const writeData = async (collection, data) => {
  try {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    console.log(`Writing ${data.length} records to ${filePath}`);
    
    // Ensure data directory exists
    await ensureDataDir();
    
    await fs.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    console.log(`Successfully wrote to ${filePath}`);
  } catch (err) {
    console.error(`Error writing ${collection}:`, err);
    throw err;
  }
};

// API Routes

// Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await readData('tasks');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;
    let tasks = await readData('tasks');
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task with new data
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    
    // Save updated tasks
    await writeData('tasks', tasks);
    
    res.json(tasks[taskIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    let tasks = await readData('tasks');
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Remove task
    tasks = tasks.filter(t => t.id !== taskId);
    
    // Save updated tasks
    await writeData('tasks', tasks);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const dashboardData = await fs.readFile(path.join(DATA_DIR, 'dashboard.json'), 'utf8');
        res.json(JSON.parse(dashboardData));
    } catch (error) {
        console.error('Error reading dashboard data:', error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

// Clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await readData('clients');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readData('clients');
    const client = clients.find(c => c.id === req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const clients = await readData('clients');
    const newClient = { 
      id: uuidv4(), 
      ...req.body, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    clients.push(newClient);
    await writeData('clients', clients);
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readData('clients');
    const index = clients.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Client not found' });
    
    const updatedClient = { 
      ...clients[index], 
      ...req.body,
      updatedAt: new Date().toISOString() 
    };
    
    clients[index] = updatedClient;
    await writeData('clients', clients);
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readData('clients');
    const filteredClients = clients.filter(c => c.id !== req.params.id);
    
    if (clients.length === filteredClients.length) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    await writeData('clients', filteredClients);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await readData('invoices');
    if (req.query.clientId) {
      return res.json(invoices.filter(i => i.clientId === req.query.clientId));
    }
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoices = await readData('invoices');
    const invoice = invoices.find(i => i.id === req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const invoices = await readData('invoices');
    const newInvoice = { 
      id: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...req.body, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: req.body.status || 'draft',
      items: req.body.items || [],
      total: req.body.total || 0,
      tax: req.body.tax || 0,
      amountDue: req.body.amountDue || 0
    };
    
    invoices.push(newInvoice);
    await writeData('invoices', invoices);
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  try {
    const invoices = await readData('invoices');
    const index = invoices.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Invoice not found' });
    
    const updatedInvoice = { 
      ...invoices[index], 
      ...req.body,
      updatedAt: new Date().toISOString() 
    };
    
    invoices[index] = updatedInvoice;
    await writeData('invoices', invoices);
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const invoices = await readData('invoices');
    const filteredInvoices = invoices.filter(i => i.id !== req.params.id);
    
    if (invoices.length === filteredInvoices.length) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    await writeData('invoices', filteredInvoices);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects
app.get('/api/timelines', async (req, res) => {
  try {
    const projects = await readData('projects');
    if (req.query.clientId) {
      return res.json(projects.filter(p => p.clientId === req.query.clientId));
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/timelines/:id', async (req, res) => {
  try {
    const projects = await readData('projects');
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/timelines', async (req, res) => {
  try {
    const projects = await readData('projects');
    const newProject = { 
      id: `PRJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...req.body, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: req.body.status || 'planning',
      progress: req.body.progress || 0
    };
    
    projects.push(newProject);
    await writeData('projects', projects);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/timelines/:id', async (req, res) => {
  try {
    const projects = await readData('projects');
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    
    const updatedProject = { 
      ...projects[index], 
      ...req.body,
      updatedAt: new Date().toISOString() 
    };
    
    projects[index] = updatedProject;
    await writeData('projects', projects);
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/timelines/:id', async (req, res) => {
  try {
    const projects = await readData('projects');
    const filteredProjects = projects.filter(p => p.id !== req.params.id);
    
    if (projects.length === filteredProjects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await writeData('projects', filteredProjects);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API routes would go here...

// Serve the main HTML file for any other GET requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize and start server
const startServer = async () => {
  try {
    await initStorage();
    await ensureSampleData();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Serving static files from: ${__dirname}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
