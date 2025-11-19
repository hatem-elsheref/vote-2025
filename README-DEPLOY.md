# GitHub Pages Deployment

This project is set up to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Instructions

1. **Enable GitHub Pages in your repository:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

2. **Push to main branch:**
   - The workflow will automatically trigger on push to `main` branch
   - Or manually trigger it from the "Actions" tab

3. **Files needed:**
   - `index.html` - Main HTML file (standalone, no dependencies)
   - `bassem-eldeeb.jpg` - Banner image (should be in root or src/assets/)

## Manual Deployment

If you prefer to deploy manually:

1. Build/copy the files:
   ```bash
   # Ensure index.html exists
   # Ensure bassem-eldeeb.jpg is in the root directory
   ```

2. Upload to GitHub Pages:
   - Go to repository settings → Pages
   - Select the branch and folder containing your files
   - Or use the `gh-pages` branch

## File Structure

```
.
├── index.html              # Main HTML file (standalone)
├── bassem-eldeeb.jpg       # Banner image
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
└── README-DEPLOY.md        # This file
```

## Notes

- The HTML file is completely standalone (no React, no build process)
- Uses CDN for Tailwind CSS
- Direct API calls to `https://proxy.elections.eg/election`
- No CORS proxy needed (API must allow CORS)

