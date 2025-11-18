const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    },
    message: statusCode === 201 ? 'Ìæâ Welcome to Virelia! Account created successfully' : 'Ì¥ì Login successful'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'ÔøΩÔøΩ User with this email already exists'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      bio: bio || 'Ìºü Passionate social media enthusiast'
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '‚ùå Registration failed',
      error: error.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Ì≥ß Please provide email and password'
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: '‚ùå Incorrect email or password'
      });
    }

    // 3) Update last active
    await user.updateLastActive();

    // 4) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '‚ùå Login failed',
      error: error.message
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Ì¥ê You are not logged in! Please log in to get access'
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: '‚ùå The user belonging to this token no longer exists'
      });
    }

    // 4) Check if user changed password after the token was issued
    // (We'll implement this if we add password change functionality)

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: '‚ùå Invalid token',
      error: error.message
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '‚ùå Failed to fetch user data',
      error: error.message
    });
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio, avatar, socialLinks, preferences } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        bio,
        avatar,
        socialLinks,
        preferences
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      },
      message: '‚úÖ Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '‚ùå Failed to update profile',
      error: error.message
    });
  }
};
