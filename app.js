const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'new_password', // Replace with your actual password
  database: 'world'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL Database');
});

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Welcome to the Population Information System!' });
});

app.get('/countries', (req, res) => {
  const query = 'SELECT * FROM country ORDER BY Population DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Database query error');
      return;
    }
    res.render('countries', { title: 'Countries', countries: results || [] });
  });
});

app.get('/cities', (req, res) => {
  const query = 'SELECT * FROM city ORDER BY Population DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Database query error');
      return;
    }
    res.render('cities', { title: 'Cities', cities: results || [] });
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).render('error', { title: '404', message: 'Page Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
