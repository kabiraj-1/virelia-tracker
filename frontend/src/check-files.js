import fs from 'fs';
import path from 'path';

const requiredFiles = [
  'App.css',
  'index.css',
  'components/landing/LandingPage.jsx',
  'components/landing/LandingPage.css',
  'components/layout/Navbar.jsx',
  'components/layout/Navbar.css',
  'components/auth/LoginForm.jsx',
  'components/auth/RegisterForm.jsx',
  'components/auth/Auth.css',
  'components/dashboard/Dashboard.jsx',
  'components/dashboard/Dashboard.css',
  'components/feed/Feed.jsx',
  'components/feed/Feed.css',
  'components/friends/Friends.jsx',
  'components/friends/Friends.css',
  'components/activities/Activities.jsx',
  'components/activities/Activities.css',
  'components/goals/Goals.jsx',
  'components/goals/Goals.css',
  'components/communities/Communities.jsx',
  'components/communities/Communities.css',
  'components/analytics/Analytics.jsx',
  'components/analytics/Analytics.css',
  'contexts/AuthContext.jsx',
  'services/authService.js',
  'services/goalService.js'
];

console.log('Ì¥ç Checking for missing files...\n');

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`‚úÖ ${file}`);
  } else {
    console.log(`‚ùå ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n' + (allFilesExist ? 'Ìæâ All files are present!' : '‚ö†Ô∏è Some files are missing.'));
