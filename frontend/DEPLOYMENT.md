# Virelia Tracker - Deployment Guide

## SPA Routing Configuration

For this React SPA to work properly, your hosting must be configured to serve `index.html` for all routes.

### Vercel
- Already configured with `vercel.json`
- Deploy with: `vercel --prod`

### Netlify
- Already configured with `netlify.toml`
- Deploy by connecting GitHub repo

### Render (Static Site)
1. Go to Render Dashboard → Static Site
2. Settings → Redirects/Rewrites
3. Add: `Source: /*` → `Destination: /index.html` → `Status: 200`

### Other Hosting
- Ensure your server serves `index.html` for all routes
- Add `_redirects` file to build output

## Build Command
\`\`\`bash
npm run build
\`\`\`

## Build Output
The built files are in the `dist/` folder
