# Fix GitHub Pages Environment Protection Rules

If you're getting the error: "Branch 'main' is not allowed to deploy to github-pages due to environment protection rules"

## Solution 1: Remove Environment Protection (Recommended)

1. Go to your repository → **Settings**
2. Click on **Environments** in the left sidebar
3. Click on **github-pages** environment
4. Under **Deployment branches**, make sure **All branches** is selected, OR
5. Add **main** branch to the allowed branches list
6. Save the changes

## Solution 2: Use Alternative Workflow (No Environment Required)

I've created an alternative workflow file `deploy-simple.yml` that doesn't require environment protection:

1. **Rename the workflows:**
   ```bash
   # Disable the current workflow
   mv .github/workflows/deploy.yml .github/workflows/deploy.yml.bak
   
   # Use the simple one
   mv .github/workflows/deploy-simple.yml .github/workflows/deploy.yml
   ```

2. **Or manually:** Delete `.github/workflows/deploy.yml` and rename `deploy-simple.yml` to `deploy.yml`

3. This workflow deploys to `gh-pages` branch automatically
4. In repository Settings → Pages, select **gh-pages** branch as source

## Solution 3: Use gh-pages Branch Instead

If you prefer to keep protection rules, you can deploy to a `gh-pages` branch:

1. The workflow will automatically create and deploy to `gh-pages` branch
2. In repository Settings → Pages, select **gh-pages** branch as source

## Solution 4: Manual Deployment (No GitHub Actions)

If GitHub Actions continues to have issues:

1. Build locally:
   ```bash
   # Files are already ready:
   # - index.html
   # - bassem-eldeeb.jpg
   ```

2. Deploy manually:
   - Create a `gh-pages` branch
   - Push `index.html` and `bassem-eldeeb.jpg` to that branch
   - In Settings → Pages, select `gh-pages` branch

## Quick Fix

The easiest solution is **Solution 1** - just allow all branches or specifically the main branch in the environment settings.

