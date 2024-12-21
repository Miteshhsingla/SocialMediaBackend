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
    
        if(checkUser.rows.length > 0) return res.status(400).json({
            statusCode: 400,
            message: 'User already exists' });
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        const newUser = await pool.query('INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING *',[username,email,hashedPassword]);
    
        return res.status(201).json({
            statusCode: 201,
            data: newUser.rows[0],
            message: 'User Created Successfully',
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
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
        return res.status(401).json({
            statusCode: 401,
            message: 'Invalid email or password',
        });
    }

    const user = userQuery.rows[0];

    const isValidPass = await bcrypt.compare(password,user.password);
    if(!isValidPass){
        return res.status(401).json({
            statusCode: 401,
            message: 'Incorrect password',
        });
    }

    const token = jwt.sign({userId : user.id, email : user.email},
        process.env.JWT_SECRET,
        {expiresIn : '1h'}
    );

    return res.status(200).json({
        statusCode: 200,
        message: 'Login Successful',
        token,
    });
} catch (error) {
    console.error('Error during login:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
}

};

module.exports = { registerUser, loginUser };
