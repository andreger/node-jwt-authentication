const db = require('./database');

// Create posts table
const createPostsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(sql, (err) => {
      if (err) {
        console.error('Error creating posts table:', err.message);
        reject(err);
      } else {
        console.log('Posts table created successfully');
        resolve();
      }
    });
  });
};

// Populate posts table with sample data
const populatePosts = () => {
  return new Promise((resolve, reject) => {
    const samplePosts = [
      {
        username: 'john',
        title: 'Welcome to My Blog',
        content: 'This is my first post on this amazing platform. I am excited to share my thoughts and experiences with everyone!'
      },
      {
        username: 'john',
        title: 'Learning Node.js',
        content: 'Today I learned about Express.js and how to build REST APIs. The journey has been incredible so far.'
      },
      {
        username: 'jane',
        title: 'My Journey in Tech',
        content: 'Starting my career in technology has been both challenging and rewarding. Here are some tips for beginners.'
      },
      {
        username: 'jane',
        title: 'Best Practices for Database Design',
        content: 'Database design is crucial for application performance. Here are some key principles to follow.'
      },
      {
        username: 'alice',
        title: 'Frontend vs Backend',
        content: 'Exploring the differences between frontend and backend development, and why both are important.'
      }
    ];

    // First, check if posts already exist
    db.get('SELECT COUNT(*) as count FROM posts', (err, row) => {
      if (err) {
        console.error('Error checking posts count:', err.message);
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('Posts table already contains data, skipping population');
        resolve();
        return;
      }

      // Insert sample posts
      const stmt = db.prepare(`
        INSERT INTO posts (username, title, content)
        VALUES (?, ?, ?)
      `);

      let completed = 0;
      samplePosts.forEach((post, index) => {
        stmt.run([post.username, post.title, post.content], (err) => {
          if (err) {
            console.error(`Error inserting post ${index + 1}:`, err.message);
            reject(err);
            return;
          }
          
          completed++;
          if (completed === samplePosts.length) {
            stmt.finalize();
            console.log(`Successfully inserted ${samplePosts.length} sample posts`);
            resolve();
          }
        });
      });
    });
  });
};

// Main initialization function
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    await createPostsTable();
    await populatePosts();
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
};

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { createPostsTable, populatePosts, initializeDatabase };