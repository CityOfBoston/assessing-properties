# Boston Property Lookup

A comprehensive web application for searching and viewing property tax assessment information for the City of Boston. The application provides an intuitive interface for residents to look up property details, assessment values, tax calculations, exemptions, and historical data.

See the new beta site live at: [Boston Property Lookup](https://properties.boston.gov/)

## Overview

Boston Property Lookup is a modern, full-stack application that integrates with Boston's EGIS (Enterprise GIS) API to provide real-time property information. The system features a React-based frontend, serverless Firebase backend, and automated CI/CD pipelines for seamless deployment.

### Key Features

- **Smart Search**: Fuzzy search with autocomplete for addresses and parcel IDs
- **Property Details**: Comprehensive property information including assessments, taxes, and exemptions
- **Historical Data**: View property value trends over time with interactive charts
- **Map Integration**: Visual property location with static map images
- **User Feedback**: Built-in feedback system for user input and bug reports
- **Responsive Design**: Mobile-friendly interface following USWDS design standards
- **Secure**: Firebase authentication and secure API endpoints
- **Fast**: Client-side search with compressed data and IndexedDB caching

## Project Structure

```
assessing-properties/
├── frontend/              # React application (Vite + TypeScript)
├── functions/             # Firebase Cloud Functions (TypeScript)
├── cli/                   # Command-line utilities
├── .github/               # GitHub Actions workflows
│   └── workflows/         # CI/CD automation
├── firebase.json          # Firebase configuration
├── firestore.indexes.json # Firestore database indexes
├── firestore.rules        # Firestore security rules
├── storage.rules          # Cloud Storage security rules
└── storage.cors.json      # Cloud Storage CORS configuration
```

## Documentation

Each component has detailed documentation:

### Core Components

- **[Frontend Documentation](frontend/README.md)** - React application setup, architecture, and development
- **[Functions Documentation](functions/README.md)** - Firebase Cloud Functions API reference and deployment
- **[CLI Tools Documentation](cli/README.md)** - Command-line utilities for administrative tasks

### DevOps & Workflows

- **[GitHub Workflows Documentation](.github/workflows/README.md)** - CI/CD pipelines and deployment automation

## Quick Start

### Prerequisites

- **Node.js** v20 or later
- **Yarn** package manager
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** for version control

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CityOfBoston/assessing-properties.git
   cd assessing-properties
   ```

2. **Set up frontend:**
   ```bash
   cd frontend
   yarn install
   yarn dev
   ```
   See [Frontend README](frontend/README.md) for detailed setup.

3. **Set up functions:**
   ```bash
   cd functions
   yarn install
   yarn build
   ```
   See [Functions README](functions/README.md) for detailed setup.

4. **Firebase configuration:**
   ```bash
   firebase login
   firebase use <project-id>
   ```

### Development Workflow

1. **Frontend Development:**
   ```bash
   cd frontend
   yarn dev          # Start dev server
   yarn storybook    # Component development
   ```

2. **Functions Development:**
   ```bash
   cd functions
   yarn build:watch  # Watch for changes
   yarn serve        # Run local emulators
   ```

3. **Run CLI Tools:**
   ```bash
   cd cli
   ./generate_and_store_pairings.sh
   ```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **COB-USWDS** - US Web Design System for City of Boston
- **Firebase SDK** - Client-side Firebase integration
- **Fuse.js** - Fuzzy search
- **Pako** - Data compression
- **Storybook** - Component development

### Backend
- **Firebase Functions** - Serverless compute
- **Firebase Admin SDK** - Backend services
- **TypeScript** - Type-safe API development
- **Google Cloud Secret Manager** - Secure credential storage

### Infrastructure
- **Firebase Hosting** - Static site hosting
- **Cloud Firestore** - NoSQL database
- **Cloud Storage** - File storage for map images
- **Cloud Scheduler** - Automated tasks
- **GitHub Actions** - CI/CD automation

### APIs & Integrations
- **EGIS API** - Boston's Enterprise GIS for property data
- **Google Analytics 4** - Usage analytics
- **ArcGIS REST API** - Geospatial data

## Architecture

### System Overview

```
┌─────────────────┐
│   Web Browser   │
│    (Frontend)   │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────┐
│ Firebase Hosting│
└────────┬────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────┐
│ Cloud Functions │←────→│   Firestore  │
│   (Backend)     │      │   (Database) │
└────────┬────────┘      └──────────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────┐
│   EGIS API      │      │Cloud Storage │
│ (Boston Data)   │      │ (Map Images) │
└─────────────────┘      └──────────────┘
```

### Frontend Architecture

The frontend follows a layered architecture:

1. **Services Layer** - Content resolution and external integrations
2. **Presenters Layer** - React element creation
3. **Logic Hooks Layer** - Business logic and calculations
4. **Content Hooks Layer** - Coordination and state management
5. **Components Layer** - Reusable UI components
6. **Containers Layer** - Container components
7. **Utilities Layer** - Pure utility functions

See [Frontend Architecture](frontend/README.md#project-architecture) for details.

### Backend Architecture

Firebase Cloud Functions organized by trigger type:

- **Callable Functions** - Direct client invocation
- **HTTPS Functions** - HTTP endpoints
- **Scheduled Functions** - Time-based triggers

See [Functions Documentation](functions/README.md#function-types) for details.

## Deployment

### Automated Deployment (Recommended)

The project uses GitHub Actions for automated deployment:

- **Development**: Auto-deploys on push to `main` branch
- **Production**: Manual deployment via GitHub Actions UI

See [Workflows Documentation](.github/workflows/README.md) for configuration.

### Manual Deployment

```bash
# Deploy everything
firebase deploy

# Deploy frontend only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions
```

## Environment Configuration

### Firebase Projects

- **Development**: Testing and development environment
- **Production**: Live production environment

### Required Secrets

Configure in GitHub repository settings:

**Development:**
- `DEV_FRONTEND_ENV` - Frontend environment variables
- `DEV_FUNCTIONS_ENV` - Functions environment variables
- `FIREBASE_PROJECT_ID_DEV` - Firebase project ID
- `FIREBASE_TOKEN_DEV` - Deployment token

**Production:**
- `PRD_FRONTEND_ENV` - Frontend environment variables
- `PRD_FUNCTIONS_ENV` - Functions environment variables
- `FIREBASE_PROJECT_ID_PRD` - Firebase project ID
- `FIREBASE_TOKEN_PRD` - Deployment token

See [Workflows Documentation](.github/workflows/README.md#required-github-secrets) for complete list.

## Data Sources

### EGIS API

The application fetches property data from Boston's EGIS (Enterprise GIS) system:

- **Base URL**: `https://gisportal.boston.gov/arcgis/rest/services/Assessing/Assessing_Online_data/MapServer`
- **Data Layers**: Geometric data, value history, property attributes, owners, etc.
- **Updates**: Data refreshed yearly via automated scheduler

### Data Flow

1. **Initial Load**: Compressed parcel/address pairings loaded from Firestore
2. **Search**: Client-side fuzzy search using Fuse.js
3. **Details**: Cloud Function fetches from EGIS API on demand
4. **Caching**: Static map images cached in Cloud Storage
5. **Updates**: Yearly automated refresh of search data

## Development Best Practices

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Component-driven development with Storybook
- Path aliases for clean imports
- SCSS Modules for scoped styling

### Testing

- **Frontend**: Storybook for component testing
- **Functions**: Firebase emulators for local testing
- **E2E**: Playwright for browser testing

### Security

- Input validation on all functions
- Firestore security rules
- API tokens in Secret Manager
- CORS configuration for Cloud Storage
- Authentication for sensitive operations

### Performance

- Client-side search with compressed data
- IndexedDB caching for offline capability
- Static map image caching
- Code splitting and lazy loading
- Optimized production builds

## Monitoring & Logging

### Firebase Console

Monitor application health via [Firebase Console](https://console.firebase.google.com/):

- **Functions**: View logs, metrics, and errors
- **Hosting**: Traffic and bandwidth usage
- **Firestore**: Database reads/writes
- **Analytics**: User behavior and events

### Google Analytics

Track user interactions:
- Property searches
- Page views
- Feature usage
- Error tracking

### Function Logs

```bash
# View all function logs
cd functions
yarn logs

# View specific function
firebase functions:log --only fetchPropertyDetailsByParcelId
```

## Troubleshooting

### Common Issues

**Build Fails**
- Clear `node_modules` and reinstall: `rm -rf node_modules && yarn install`
- Clear dist folder: `rm -rf dist` (frontend) or `rm -rf dist` (functions)
- Verify Node.js version: `node --version` (should be v20+)

**Deployment Fails**
- Check Firebase CLI version: `firebase --version`
- Verify project selection: `firebase use`
- Check GitHub secrets are configured
- Review workflow logs in GitHub Actions

**Function Errors**
- Check function logs: `firebase functions:log`
- Test locally with emulators: `yarn serve`
- Verify environment variables are set
- Check EGIS API availability

**Search Not Working**
- Verify parcel pairings are generated
- Check IndexedDB in browser DevTools
- Run CLI tool to regenerate pairings
- Check browser console for errors

See component-specific documentation for detailed troubleshooting.

## Contributing

### Development Process

1. **Create a branch** from `main`
2. **Make changes** with clear commit messages
3. **Test locally** in both dev and prod modes
4. **Create pull request** with description
5. **Review and merge** - Auto-deploys to dev

### Code Standards

- Follow TypeScript best practices
- Use path aliases instead of relative imports
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep functions small and focused
- Test before committing

### Documentation

- Update README when adding features
- Document new functions and APIs
- Add Storybook stories for new components
- Keep type definitions up to date

## License

This project is developed and maintained by the City of Boston.

## Support & Contact

For issues, questions, or contributions:

1. **Documentation**: Check relevant README files
2. **Issues**: Create GitHub issue with details
3. **City of Boston**: Contact the Digital Team

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [USWDS Documentation](https://designsystem.digital.gov/)
- [COB-USWDS](https://github.com/CityOfBoston/cob-uswds)
- [Vite Documentation](https://vitejs.dev/)
- [Boston EGIS Portal](https://gisportal.boston.gov/)
