// ... other imports ...

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://virelia-tracker-frontend.vercel.app',  // NEW DOMAIN
      process.env.CLIENT_URL,
      'https://virelia-tracker.com',
      'https://www.virelia-tracker.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// ... rest of the file ...
