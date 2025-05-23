const express = require('express');
const cors = require('cors');
const auth = require('basic-auth');

const app = express();
const PORT = process.env.PORT || 4000;

const USERNAME = 'admin';
const PASSWORD = 'password123';

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // Update if your frontend URL differs
}));

function basicAuth(req, res, next) {
  const user = auth(req);
  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="HairCollection"');
    return res.status(401).json({ message: 'Authentication required.' });
  }
  next();
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hair Collection API' });
});

app.get('/products', basicAuth, (req, res) => {
  const products = [
    { id: 1, name: 'Body Wave Bundle', price: 120 },
    { id: 2, name: 'Straight Lace Wig', price: 250 },
    { id: 3, name: 'Curly Closure', price: 90 }
  ];
  res.json(products);
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  console.log(`Contact form submitted: ${name} (${email}) - ${message}`);
  res.json({ status: 'Message received. Thank you!' });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
