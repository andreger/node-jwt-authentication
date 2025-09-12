const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const jwt = require("jsonwebtoken");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Get all posts for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { username: req.user.name },
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const post = await Post.create({
      username: req.user.name,
      title,
      content: content || "",
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a post
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findOne({
      where: { id, username: req.user.name },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.update({ title, content });
    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id, username: req.user.name },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
