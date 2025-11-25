require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // e.g. mysql.railway.internal
  user: process.env.DB_USER,        // e.g. root
  password: process.env.DB_PASSWORD,// from Railway Credentials tab
  database: process.env.DB_NAME     // e.g. railway
});

// ✅ Test DB connection on startup
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ✅ Root route for health check
app.get('/', (req, res) => {
  res.send('Backend is running on Railway!');
});

// ✅ GET all todos (with logging)
app.get('/todos', (req, res) => {
  console.log("✅ GET /todos called");   // <-- Added logging line
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      console.error("❌ DB error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ✅ POST new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task is required" });

  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) {
      console.error("❌ Error inserting todo:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Added', id: result.insertId });
  });
});

// ✅ PUT update todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  db.query('UPDATE todos SET task = ? WHERE id = ?', [task, id], (err) => {
    if (err) {
      console.error("❌ Error updating todo:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Updated' });
  });
});

// ✅ DELETE todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error("❌ Error deleting todo:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Deleted' });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
