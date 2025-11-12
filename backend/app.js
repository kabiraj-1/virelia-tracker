
// Test Database Route
app.get('/api/test-db', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Database connection test successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});
