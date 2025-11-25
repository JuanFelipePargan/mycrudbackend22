require('dotenv').config();
console.log("Loaded DB_USER:", process.env.DB_USER);
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // e.g. mysql.railway.internal
  user: process.env.DB_USER,        // e.g. root
  password: process.env.DB_PASSWORD,// from Railway Credentials tab
  database: process.env.DB_NAME     // e.g. railway
});

// ✅ GET all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ POST new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Added', id: result.insertId });
  });
});

// ✅ PUT update todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  db.query('UPDATE todos SET task = ? WHERE id = ?', [task, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Updated' });
  });
});

// ✅ Root route for quick health check
app.get('/', (req, res) => {
  res.send('Backend is running on Railway!');
});




// ✅ DELETE todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

// ✅ Listen on Railway-assigned port or fallback to 8080
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


