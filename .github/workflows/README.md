# GitHub Actions Workflows

This directory contains the CI/CD workflows for automated deployment of the Assessing Properties application.

## Workflows

### 1. Deploy to Development Environment (`deploy-dev.yml`)

**Trigger:** Automatic on push or merged pull request to `main` branch

**Behavior:**
- Detects which parts of the codebase changed (frontend or functions)
- Only rebuilds and redeploys the changed components
- Deploys to the development Firebase project

**Jobs:**
- `detect-changes`: Uses path filtering to determine what changed
- `deploy-frontend-dev`: Runs if frontend files changed
- `deploy-functions-dev`: Runs if functions files changed

### 2. Deploy to Production Environment (`deploy-prod.yml`)

**Trigger:** Manual workflow dispatch from GitHub Actions UI

**Behavior:**
- Requires typing "deploy" as confirmation
- Always rebuilds and deploys both frontend and functions
- Deploys to the production Firebase project

**Jobs:**
- `validate-input`: Confirms the deployment action
- `deploy-production`: Builds and deploys everything

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings under `Settings > Secrets and variables > Actions`.

### Development Environment Secrets

| Secret Name | Description |
|------------|-------------|
| `DEV_FRONTEND_ENV` | Environment variables for frontend (development) as multi-line string |
| `DEV_FUNCTIONS_ENV` | Environment variables for functions (development) as multi-line string |
| `FIREBASE_PROJECT_ID_DEV` | Firebase project ID for development environment |
| `FIREBASE_TOKEN_DEV` | Firebase CI token for development deployment |
| `FIREBASE_SERVICE_ACCOUNT_DEV` | Firebase service account JSON for development environment |

### Production Environment Secrets

| Secret Name | Description |
|------------|-------------|
| `PROD_FRONTEND_ENV` | Environment variables for frontend (production) as multi-line string |
| `PROD_FUNCTIONS_ENV` | Environment variables for functions (production) as multi-line string |
| `FIREBASE_PROJECT_ID_PROD` | Firebase project ID for production environment |
| `FIREBASE_TOKEN_PROD` | Firebase CI token for production deployment |
| `FIREBASE_SERVICE_ACCOUNT_PROD` | Firebase service account JSON for production environment |

### Automatic Secret (GitHub-provided)

| Secret Name | Description |
|------------|-------------|
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions (no setup needed) |

## Setting Up GitHub Environments

To enable environment-specific protections and secrets:

1. Go to your repository settings
2. Navigate to `Environments`
3. Create two environments: `test` and `production`
4. For `production`, you can add protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches (restrict to `main`)

## Environment Variable Format

The `*_FRONTEND_ENV` and `*_FUNCTIONS_ENV` secrets should contain your environment variables in the standard `.env` format:

```env
VITE_API_KEY=your_api_key_here
VITE_FIREBASE_CONFIG=your_config_here
ANOTHER_VAR=another_value
```

Store these as GitHub secrets with newlines preserved (paste the entire contents as a multi-line secret).

## Obtaining Firebase Tokens and Service Accounts

### Firebase CI Token

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login and get CI token
firebase login:ci
```

This will output a token that you can use for `FIREBASE_TOKEN_TEST` and `FIREBASE_TOKEN_PROD`.

### Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy the entire JSON contents as the `FIREBASE_SERVICE_ACCOUNT_*` secret

## Usage

### Automatic Test Deployment

Simply push to `main` or merge a pull request:

```bash
git push origin main
```

The workflow will automatically detect changes and deploy only what's needed.

### Manual Production Deployment

1. Go to the Actions tab in your GitHub repository
2. Select "Deploy to Production Environment"
3. Click "Run workflow"
4. Type "deploy" in the confirmation field
5. Click "Run workflow"

## Monitoring Deployments

- View workflow runs in the Actions tab
- Each job shows detailed logs
- Failed deployments will show error messages
- You can re-run failed workflows from the Actions UI

## Troubleshooting

### Workflow not triggering

- Ensure you're pushing to the `main` branch
- Check that the workflow files are in `.github/workflows/`
- Verify the workflow syntax is valid

### Deployment failing

- Check that all required secrets are set correctly
- Verify Firebase project IDs are correct
- Ensure service account has necessary permissions
- Review the job logs for specific error messages

### Both jobs running when only one should

- The path filter looks for changes in `frontend/**` and `functions/**`
- If files outside these directories are changed, neither job will run
- If you need to adjust the paths, edit the `filters` section in `deploy-test.yml`

## Customization

### Changing Node.js Version

Update the `node-version` field in the workflow files:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change this version
```

### Adding Additional Build Steps

Add new steps in the appropriate job, for example:

```yaml
- name: Run tests
  working-directory: ./frontend
  run: npm test

- name: Lint code
  working-directory: ./frontend
  run: npm run lint
```

### Modifying Change Detection

Edit the `filters` section in `deploy-test.yml`:

```yaml
filters: |
  frontend:
    - 'frontend/**'
    - 'shared/**'  # Add additional paths
  functions:
    - 'functions/**'
    - 'shared/**'  # Add additional paths
```

