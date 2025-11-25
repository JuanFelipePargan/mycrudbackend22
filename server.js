const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // ← replace with your actual MySQL root password
  database: 'todo_db'
});

// ✅ GET all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ✅ POST new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Added' });
  });
});

// ✅ DELETE todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});

// ✅ UPDATE todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  db.query('UPDATE todos SET task = ? WHERE id = ?', [task, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Updated' });
  });
});

// ✅ Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
