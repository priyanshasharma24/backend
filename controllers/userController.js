const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

// @desc        Register new User
// @route       POST /api/users
// @access      Public
const registerUser = asyncHandler(async (req, res) => {

    const {name,email,password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //check if user exists
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('user already Exists')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    //Create User
    const user = await User.create({
        name,
        email,
        password : hashedPassword
    })

    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid User Data')
    }
});

// @desc        Authenticate a user
// @route       POST /api/users/login
// @access      Public
const loginUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body

    //check user exists with given email or not
    const user = await User.findOne({email})

    //compare user password with hashpassword
    if(user && (await bcrypt.compare(password,user.password))){
        res.json({
            _id : user.id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
});

// @desc        Get User data
// @route       Get /api/users/me
// @access      Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
});

//Generate JWT
const generateToken = (id) =>{
    //payload -> data we putting
    //secret -> jwt_secret in .env
    //expire Time
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
