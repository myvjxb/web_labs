import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Підключення до локальної SQLite БД
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error("Помилка підключення до БД:", err.message);
  else console.log("Підключено до SQLite.");
});

// Створення таблиці та тестових даних
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM items", (err, row) => {
    if (err) return console.error(err.message);
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO items (name) VALUES (?)");
      const testItems = [
        "Gibson Les Paul Standard",
        "Fender Stratocaster Player",
        "Marshall MG15G Combo Amp",
        "Ernie Ball Regular Slinky Strings",
        "Boss DS-1 Distortion Pedal"
      ];
      testItems.forEach((item) => stmt.run(item));
      stmt.finalize();
      console.log("Тестові товари додано в БД.");
    }
  });
});

// Endpoint GET /items
app.get("/items", (req, res) => {
  db.all("SELECT id, name FROM items", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});