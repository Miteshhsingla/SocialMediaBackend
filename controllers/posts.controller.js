const pool = require('../config.js/db');


//tested and working fine
const createPost = async (req, res) => {
    //extract image and content from req body;
    //fetch userId from req.user through middleware;
    //Insert the post using query;
    //return response to user on successful post created
  const { picture, content } = req.body;
  const userId = req.user.userId; // Assuming JWT middleware sets req.user

  console.log('userId: ', userId);
  try {
    const newPost = await pool.query(
      'INSERT INTO posts (user_id, content, picture) VALUES ($1, $2, $3) RETURNING *',
      [userId,content,picture]
    );
    res.status(201).json(newPost.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createPost };
