// Temporary development mode - shows password in response instead of email
export const sendPasswordReset = async (email, resetToken) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔐 Password Reset Link: https://kabirajbhatt.com.np/reset-password?token=${resetToken}`);
    return true;
  }
  // Real email sending code would go here later
  return false;
};