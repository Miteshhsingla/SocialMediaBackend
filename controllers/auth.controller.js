const pool = require('../config.js/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const loginUser = async (req,res)=>{
// extract email and password from request body
// check if the user exists or not
// check if the password is correct
// generete jwt token and return it to the user


const {email, password} = req.body;

try {
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
    if(userQuery.rows.length === 0){
        return res.status(401).json({ message : 'Invalid email or password'});
    }

    const user = userQuery.rows[0];

    const isValidPass = await bcrypt.compare(password,user.password);
    if(!isValidPass){
        return res.status(401).json({ message : 'Incorrect password'});
    }

    const token = jwt.sign({userId : user.id, email : user.email},
        process.env.JWT_SECRET,
        {expiresIn : '1h'}
    );

    res.json({message:'Login Successul',token});

} catch (error) {
    console.log('error during login', error);
    res.status(500).json({message:'Server Error'});
}

};

module.exports = { registerUser, loginUser };
