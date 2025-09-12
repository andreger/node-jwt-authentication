require("dotenv").config();

const express = require("express");
const app = express();
const sequelize = require("./config/database");
const Post = require("./models/Post");
const postRoutes = require("./routes/PostRoutes");

app.use(express.json());

// Initialize database and create tables
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync the database (create tables if they don't exist)
    await sequelize.sync();
    console.log("Database synchronized successfully.");

    // Create some sample posts if the table is empty
    const postCount = await Post.count();
    if (postCount === 0) {
      await Post.bulkCreate([
        {
          username: "john",
          title: "Post 1",
          content: "This is the content of post 1",
        },
        {
          username: "jane",
          title: "Post 2",
          content: "This is the content of post 2",
        },
      ]);
      console.log("Sample posts created.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Mount post routes
app.use("/posts", postRoutes);

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
