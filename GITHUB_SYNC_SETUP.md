# GitHub Sync Setup Guide

## Problem Solved
This update fixes two critical issues:
1. **Cross-device synchronization**: Products and orders now sync across all devices (phone, computer, etc.)
2. **Unlimited storage**: No more posting limits - GitHub provides much higher storage capacity than localStorage

## How It Works
The app now stores your products and orders in your GitHub repository instead of just on your device. This means:
- When you add a product on your phone, it appears on everyone else's device
- When customers place orders, you can see them from any device
- Data persists even if you clear your browser cache

## Setup Instructions

### Step 1: Create a GitHub Personal Access Token

1. Go to GitHub.com and sign in
2. Click your profile picture → **Settings**
3. Scroll down to **Developer settings** (left sidebar, bottom)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token (classic)**
6. Fill in:
   - **Note**: Enter "Bellestride Sync" or any name you prefer
   - **Expiration**: Choose "No expiration" or a long period
   - **Scopes**: ✅ Check the **repo** checkbox (this is required!)
7. Click **Generate token**
8. **IMPORTANT**: Copy the token immediately - you won't see it again!

### Step 2: Configure GitHub Sync in Your App

1. Open your Bellestride website
2. Click the **shield icon** (admin panel) in the top right
3. Enter admin password: `Jillian`
4. In the Admin Panel, find the **GitHub Sync Configuration** section (green box)
5. Paste your GitHub token in the **GitHub Personal Access Token** field
6. Click **Save Configuration**
7. Click **Test Connection** to verify it works

### Step 3: Deploy to GitHub Pages (if not already done)

If your site isn't already on GitHub Pages:

1. Create a GitHub repository for your site
2. Upload your files (index.html, script.js, etc.)
3. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Select **Source**: Deploy from a branch
   - Select **Branch**: main
   - Click **Save**
4. Your site will be available at: `https://yourusername.github.io/your-repo-name/`

### Step 4: Share Your Link

Share your GitHub Pages link with customers and collaborators:
- Example: `https://yourusername.github.io/bellestride/`
- Anyone with this link can view your products
- Only you (with admin password) can add/edit products

## Important Notes

### Security
- **Never share your GitHub token** - it's like a password
- The token is stored in your browser's localStorage, not on the server
- Each device needs the token configured separately

### How Sync Works
- **Products**: Stored in `data/products.json` in your GitHub repo
- **Orders**: Stored in `data/orders.json` in your GitHub repo
- **Automatic sync**: Changes sync immediately when you add/edit/delete products or orders
- **GitHub Pages rebuild**: Takes 1-2 minutes for changes to appear on the live site

### Troubleshooting

#### "Connection failed" error
- Verify your token has the `repo` scope
- Make sure the token hasn't expired
- Check that you're connected to the internet

#### Changes not appearing on other devices
- Wait 1-2 minutes for GitHub Pages to rebuild
- Refresh the page on other devices
- Check that GitHub sync is configured on those devices too

#### "Invalid token" error
- Regenerate your token (it may have been revoked)
- Make sure you copied the entire token (no extra spaces)

### Benefits Over Local Storage

| Feature | Before (localStorage) | After (GitHub Sync) |
|---------|---------------------|-------------------|
| Device sync | ❌ No | ✅ Yes |
| Storage limit | 5-10MB | ~100MB per file |
| Data persistence | Lost on cache clear | Permanent in GitHub |
| Multi-user support | ❌ No | ✅ Yes |
| Backup | ❌ No | ✅ Git history |

## Admin Panel Features

With GitHub sync enabled, you can:
- Add products from any device - they appear everywhere
- Manage orders from phone or computer
- Track order status changes across devices
- Never lose data due to browser issues

## Support

If you encounter issues:
1. Check your GitHub token is valid and has `repo` scope
2. Verify your repository name is correct (auto-detected on GitHub Pages)
3. Test the connection in the admin panel
4. Check browser console for error messages

## Next Steps

After setup:
1. Add your first product from your phone
2. Check it appears on your computer
3. Have a customer place a test order
4. Verify the order appears in your admin panel

Your Bellestride store is now fully synchronized across all devices! 🎉
