const pool = require('../config.js/db.js');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiErrors.js');
const ApiResponse = require('../utils/ApiResponse.js');


const registerUser = async (req,res)=>{
    //take data from frontend
    //check and show error if the user already exists
    //hash the password
    //create new user entry in db
    //return success response to frontend

    const { username, email, password } = req.body;

    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
    
        if(checkUser.rows.length > 0) return res.status(400).json({ message: 'User already exists' });
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        const newUser = await pool.query('INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING *',[username,email,hashedPassword]);
    
        return res.json(
            new ApiResponse(201,newUser.rows[0],"User Created Successfully")
        )
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
    

};

module.exports = { registerUser };
