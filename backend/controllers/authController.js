const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto=require('crypto');
const sendEmail=require('../utils/sendEmail');

// Function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        isSetupComplete: user.isSetupComplete,
        defaultCurrency: user.defaultCurrency,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // The user is already available in req.user
  res.status(200).json(req.user);
};

// @desc    Complete user setup
// @route   PUT /api/auth/setup
// @access  Private
const completeSetup = async (req, res) => {
  const { defaultCurrency } = req.body;

  if (!defaultCurrency) {
    return res.status(400).json({ message: 'Default currency is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        defaultCurrency,
        isSetupComplete: true 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      defaultCurrency: user.defaultCurrency,
      isSetupComplete: user.isSetupComplete,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const forgotPassword=async (req,res)=>{
  const {email}=req.body;
  try {
    const user=await User.findOne({email})
    if(!user){
      return res.status(404).json({message:'User not found'});
    }
    const resetToken=crypto.randomBytes(32).toString('hex');
    const hashedToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken=hashedToken;
    user.resetPasswordExpires=Date.now()+15*60*1000;
    await user.save();
    const resetUrl=`${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to:user.email,
      subject:'Password Reset Request',
      text:`You requested a password reset. Please click the link to reset your password: ${resetUrl}`
    })
    res.status(200).json({message:'Password reset email sent'});  
  } catch (error) {
    res.status(500).json({message:'Server Error',error:error.message});    
  }
}

const resetPassword=async (req,res)=>{
  const {token,newPassword}=req.body;
  const user='';
  try{
    const hashedToken=crypto.createHash('sha256').update(token).digest('hex');
     user=await User.findOne({
      resetPasswordToken:hashedToken,
      resetPasswordExpires:{$gt:Date.now()}
    })
  }
  catch(error){
    res.status(500).json({message:'Server Error',error:error.message});
  }
  if(!user){
    return res.status(400).json({message:'Invalid or expired token'})
  }
  user.password=newPassword;
  user.resetPasswordToken=null;
  user.resetPasswordExpires=null;
  await user.save();
  res.status(200).json({message:'Password reset successful'});
}

module.exports = {
  signup,
  login,
  getMe,
  completeSetup,
  forgotPassword,
  resetPassword
};