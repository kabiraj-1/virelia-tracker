import express from 'express';

const router = express.Router();

// AUTH HEALTH CHECK
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '‚úÖ Auth routes are working!',
    timestamp: new Date().toISOString()
  });
});

// TEMPORARY REGISTER (without database - DEMO MODE)
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Ì≥ù Registration attempt:', { name, email });

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Temporary success response (no database)
    res.status(201).json({
      success: true,
      message: '‚úÖ User registered successfully! (Demo Mode)',
      data: {
        user: {
          id: 'demo-' + Date.now(),
          name: name,
          email: email,
          karmaPoints: 100
        },
        token: 'demo-jwt-token-' + Date.now()
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// TEMPORARY LOGIN (without database - DEMO MODE)
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Ì¥ê Login attempt:', { email });

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Temporary success response (no database)
    res.json({
      success: true,
      message: '‚úÖ Login successful! (Demo Mode)',
      data: {
        user: {
          id: 'demo-user-id',
          name: 'Demo User',
          email: email,
          karmaPoints: 150
        },
        token: 'demo-jwt-token-' + Date.now()
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// GET USER PROFILE (DEMO)
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'User profile (Demo Mode)',
    data: {
      user: {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@example.com',
        karmaPoints: 200
      }
    }
  });
});

export default router;
