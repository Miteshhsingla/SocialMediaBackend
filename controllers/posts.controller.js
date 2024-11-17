const pool = require('../config.js/db');

//tested and working fine
const createPost = async (req, res) => {
    
    //extract image and content from req body;
    //fetch userId from req.user through middleware;
    //Insert the post using query;
    //return response to user on successful post created

  const { picture, content } = req.body;
  const userId = req.user.userId; // Assuming JWT middleware sets req.user

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

const getFeed = async (req,res) => {
    //get userId
    const userId = req.user.userId;

    try {
        const postsData = await pool.query(`SELECT posts.*,users.username FROM posts JOIN users ON
            users.id = posts.user_id
            WHERE posts.user_id IN
            ( SELECT following_id FROM followers WHERE follower_id = $1 )
            ORDER BY posts.created_at DESC`
            ,[userId]);

        if (postsData.rows.length === 0) {
            res.send("Nothing to show");
        } else {
            res.status(200).json(postsData.rows);
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

module.exports = { createPost, getFeed };
