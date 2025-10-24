# GitHub Actions Setup Checklist

Follow this checklist to configure GitHub Actions for your repository.

## Prerequisites

- [ ] Firebase projects created (one for test, one for production)
- [ ] Firebase CLI installed locally (`npm install -g firebase-tools`)
- [ ] Repository pushed to GitHub
- [ ] Admin access to the GitHub repository

## Step 1: Set Up GitHub Environments

- [ ] Go to repository `Settings > Environments`
- [ ] Create environment named `test`
- [ ] Create environment named `production`
- [ ] (Optional) Add protection rules to `production`:
  - [ ] Add required reviewers
  - [ ] Set deployment branch to `main` only

## Step 2: Obtain Firebase Credentials

### For Test Environment

- [ ] Run `firebase login:ci` and save the token
- [ ] Go to Firebase Console > Test Project > Project Settings > Service Accounts
- [ ] Generate new private key and download JSON

### For Production Environment

- [ ] Run `firebase login:ci` (if using different account) and save the token
- [ ] Go to Firebase Console > Production Project > Project Settings > Service Accounts
- [ ] Generate new private key and download JSON

## Step 3: Prepare Environment Variables

### Frontend Environment Variables (Test)

- [ ] Create a file with your test frontend environment variables:
```env
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
# Add all your frontend env vars
```

### Frontend Environment Variables (Production)

- [ ] Create a file with your production frontend environment variables

### Functions Environment Variables (Test)

- [ ] Create a file with your test functions environment variables:
```env
BOSTON_DATA_API_KEY=...
# Add all your functions env vars
```

### Functions Environment Variables (Production)

- [ ] Create a file with your production functions environment variables

## Step 4: Configure GitHub Secrets

Go to `Settings > Secrets and variables > Actions > New repository secret`

### Test Environment Secrets

- [ ] `TEST_FRONTEND_ENV` - Paste entire frontend .env contents
- [ ] `TEST_FUNCTIONS_ENV` - Paste entire functions .env contents
- [ ] `FIREBASE_PROJECT_ID_TEST` - Your test Firebase project ID
- [ ] `FIREBASE_TOKEN_TEST` - Token from `firebase login:ci`
- [ ] `FIREBASE_SERVICE_ACCOUNT_TEST` - Entire JSON from service account file

### Production Environment Secrets

- [ ] `PROD_FRONTEND_ENV` - Paste entire frontend .env contents
- [ ] `PROD_FUNCTIONS_ENV` - Paste entire functions .env contents
- [ ] `FIREBASE_PROJECT_ID_PROD` - Your production Firebase project ID
- [ ] `FIREBASE_TOKEN_PROD` - Token from `firebase login:ci`
- [ ] `FIREBASE_SERVICE_ACCOUNT_PROD` - Entire JSON from service account file

## Step 5: Verify Workflow Files

- [ ] Confirm `.github/workflows/deploy-test.yml` exists
- [ ] Confirm `.github/workflows/deploy-prod.yml` exists
- [ ] Review workflow configurations match your needs

## Step 6: Test the Setup

### Test Automatic Deployment

- [ ] Make a small change in `frontend/` directory
- [ ] Commit and push to `main` branch
- [ ] Go to Actions tab and verify only frontend deployment runs
- [ ] Make a small change in `functions/` directory
- [ ] Commit and push to `main` branch
- [ ] Go to Actions tab and verify only functions deployment runs

### Test Manual Production Deployment

- [ ] Go to Actions tab
- [ ] Click "Deploy to Production Environment"
- [ ] Click "Run workflow"
- [ ] Type "deploy" in the confirmation field
- [ ] Click "Run workflow"
- [ ] Verify both frontend and functions deploy successfully

## Step 7: Update Package.json Scripts (If Needed)

Verify both `frontend/package.json` and `functions/package.json` have build scripts:

```json
{
  "scripts": {
    "build": "..."
  }
}
```

- [ ] Verify `frontend/package.json` has `build` script
- [ ] Verify `functions/package.json` has `build` script

## Troubleshooting

If deployments fail, check:

1. All secrets are correctly named (case-sensitive)
2. Service account JSON is valid
3. Firebase projects have necessary APIs enabled
4. Service accounts have deployment permissions
5. Build scripts work locally

## Notes

- The `GITHUB_TOKEN` is automatically provided by GitHub
- Environment variables in secrets should be in `.env` format with newlines
- Service account JSON should be pasted as-is (entire JSON object)
- Firebase tokens can be regenerated if compromised

## Support

For issues or questions:
1. Check workflow run logs in Actions tab
2. Review the README.md in `.github/workflows/`
3. Verify all secrets are set correctly
4. Test Firebase deployment locally first

