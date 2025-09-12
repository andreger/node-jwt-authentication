require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const db = require("./database");

app.use(express.json());

app.get("/posts", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM posts WHERE username = ? ORDER BY created_at DESC";
  
  db.all(sql, [req.user.name], (err, rows) => {
    if (err) {
      console.error("Error fetching posts:", err.message);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
    res.json(rows);
  });
});

// Add endpoint to create new posts
app.post("/posts", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const sql = "INSERT INTO posts (username, title, content) VALUES (?, ?, ?)";
  
  db.run(sql, [req.user.name, title, content || ""], function(err) {
    if (err) {
      console.error("Error creating post:", err.message);
      return res.status(500).json({ error: "Failed to create post" });
    }
    
    // Return the created post
    db.get("SELECT * FROM posts WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        console.error("Error fetching created post:", err.message);
        return res.status(500).json({ error: "Post created but failed to retrieve" });
      }
      res.status(201).json(row);
    });
  });
});

// Add endpoint to get all posts (for testing)
app.get("/posts/all", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM posts ORDER BY created_at DESC";
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching all posts:", err.message);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
    res.json(rows);
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
