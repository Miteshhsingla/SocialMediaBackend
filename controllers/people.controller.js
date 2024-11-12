const pool = require('../config.js/db');

const followUser = async(req,res)=>{

    //Step1 : fetch the logged user's userId and the id of user to follow from his username
    //Step2 : Check if the follow relation already exists b/w both users
    //Step3 : Return meesage if they already follow each other
    //Step4 : Query to establish relation b/w both users
    //Step5 : return success status

    const userId = req.user.userId;
    const { followname } = req.query;

    try {
        const followIdResult = await pool.query("Select id from users WHERE username = $1",[followname]);

        if(followIdResult.rowCount === 0){
            return res.status(404).json({message:'User to follow not found'});
        }

        const followId = followIdResult.rows[0].id;

        const existing = await pool.query('SELECT * FROM followers where follower_id = $1 AND following_id = $2',[userId,followId]);

        if(existing.rowCount > 0){
            return res.status(400).json({ message: 'Already following this user' });
        }

        await pool.query(
            'INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)',
            [userId, followId]
        );

        res.status(201).json({ message: 'Followed successfully' });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const unfollowUser = async (req, res) => {
    const { userId } = req.user.userId;
    const unfollowId = await pool.query("Select (user_id)from users WHERE username LIKE $1||'%'",[req.query.unfollowname]);

    try {
        // Delete follow relationship
        const result = await pool.query(
            'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2',
            [userId, unfollowId]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Not following this user' });
        }

        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {followUser,unfollowUser};