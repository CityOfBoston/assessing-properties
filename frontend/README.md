# Boston Property Lookup Frontend

A React-based web application for searching and viewing property tax assessment information for the City of Boston.

## Table of Contents
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Path Aliases](#path-aliases)
- [USWDS Integration](#uswds-integration)
- [Content Management](#content-management)
- [Testing](#testing)
- [Build Configuration](#build-configuration)

## Development Setup

### Prerequisites
- Node.js (v20 or later)
- Yarn package manager

### Installation
```bash
yarn install
```

### Available Scripts
```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build locally
yarn preview

# Run linter
yarn lint

# Start Storybook for component development
yarn storybook

# Build Storybook
yarn build-storybook
```

## Project Architecture

This application follows a layered architecture with clear separation of concerns:

### Architecture Layers

1. **Services Layer** (`src/services/`)
   - Content resolution from YAML files
   - Language string management
   - External API integrations

2. **Presenters Layer** (`src/presenters/`)
   - React element creation
   - Presentation logic
   - UI component composition

3. **Logic Hooks Layer** (`src/hooks/logic/`)
   - Business logic
   - Calculations
   - Data transformations

4. **Content Hooks Layer** (`src/hooks/content/`)
   - Coordination between services, presenters, and logic
   - State management
   - Data flow orchestration

5. **Components Layer** (`src/components/`)
   - Reusable UI components
   - Visual presentation
   - User interactions

6. **Containers Layer** (`src/containers/`)
   - Container components that connect UI to state
   - Higher-order components
   - Component composition

7. **Utilities Layer** (`src/utils/`)
   - Pure utility functions
   - Content files (YAML)
   - Helper functions
   - Type definitions

## Key Features

### Property Search
- Search by address or parcel ID
- Fuzzy search with suggestions
- Search results with property summaries
- Compressed search data stored in IndexedDB for performance

### Property Details
- Comprehensive property information display
- Property tax calculations
- Historical assessment data
- Exemption information
- Approved permits and abatements
- Interactive property value charts
- Timeline visualization

### User Feedback
- In-app feedback system
- Complex feedback forms for specific issues
- Feedback stored in Firebase

### Analytics
- Google Analytics 4 integration
- Custom event tracking
- User journey analysis

### Content Management
- YAML-based content system
- Markdown support in content
- Period-based language (fiscal year awareness)
- Easy content updates without code changes

## Technology Stack

### Core Technologies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **SASS/SCSS** - Styling

### UI & Design
- **COB-USWDS** - City of Boston US Web Design System
- **Storybook** - Component development and documentation
- **CSS Modules** - Scoped styling

### State & Data
- **React Context** - Global state management
- **IndexedDB** - Client-side data storage
- **Firebase** - Backend services (Firestore, Functions, Analytics)

### Search & Analysis
- **Fuse.js** - Fuzzy search functionality
- **Pako** - Data compression/decompression

### Developer Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Playwright** - Browser testing
- **Chromatic** - Visual regression testing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnnotatedSearchBar/
│   ├── BetaLabel/
│   ├── ComplexFeedbackSender/
│   ├── FeedbackSender/
│   ├── FieldTable/
│   ├── FormulaAccordion/
│   ├── IconButton/
│   ├── LoadingIndicator/
│   ├── MessageBox/
│   ├── PropertyDetailsCard/
│   ├── PropertyDetailsCardGroup/
│   ├── PropertyDetailsSection/
│   ├── PropertySearchHelp/
│   ├── PropertySearchPopup/
│   ├── PropertySearchResults/
│   ├── PropertyValuesBarChart/
│   ├── RecordTable/
│   ├── ResponsiveTable/
│   ├── SearchBackground/
│   ├── TimeChanger/
│   ├── Timeline/
│   ├── Tooltip/
│   └── WelcomeContent/
├── containers/          # Container components
│   ├── ComplexFeedbackSenderContainer/
│   ├── FeedbackSenderContainer/
│   └── SearchBarContainer/
├── hooks/              # Custom React hooks
│   ├── content/        # Content coordination hooks
│   │   ├── useAbatementsContent.ts
│   │   ├── useApprovedPermitsContent.ts
│   │   ├── useAttributesContent.ts
│   │   ├── useContactUsContent.ts
│   │   ├── useExemptionValues.ts
│   │   ├── useOverviewContent.ts
│   │   ├── usePropertyTaxesContent.ts
│   │   └── usePropertyValueContent.ts
│   ├── logic/          # Business logic hooks
│   │   └── useExemptionPhases.ts
│   ├── firebaseConfig.ts
│   ├── useDateContext.tsx
│   ├── useGoogleAnalytics.tsx
│   ├── useIndexedDB.ts
│   ├── useModal.ts
│   ├── useParcelPairings.ts
│   ├── useParcelPairingsContext.tsx
│   ├── usePropertyDetails.ts
│   ├── usePropertyDetailsContent.ts
│   ├── usePropertyFeedback.ts
│   ├── usePropertyTaxCalculations.ts
│   ├── useSearchResults.ts
│   └── useSearchSuggestions.ts
├── layouts/            # Page layout components
│   ├── Banner.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── PageLayout/
│   ├── PropertyDetailsLayout/
│   ├── SearchResultsLayout/
│   └── WelcomePageLayout/
├── pages/              # Page components
│   ├── MaintenancePage/
│   ├── PropertyDetailsPage/
│   ├── SearchResultsPage/
│   └── WelcomePage/
├── presenters/         # React element creation logic
│   ├── ExemptionPresenter.ts
│   └── PropertyTaxPresenter.ts
├── services/           # External integrations & content
│   ├── analytics.ts
│   └── content/
│       ├── ContentService.ts
│       └── LanguageService.ts
├── styles/             # Global styles and SCSS
│   ├── _global.scss
│   ├── _uswds-theme.scss
│   └── main.scss
├── types/              # TypeScript type definitions
│   ├── analytics.ts
│   ├── content.ts
│   ├── index.ts
│   └── yaml.d.ts
├── utils/              # Utility functions & content
│   ├── content.yaml    # Component content
│   ├── contentMapper.ts
│   ├── markdown/
│   │   ├── index.ts
│   │   └── markdownRenderer.ts
│   ├── periods.ts
│   ├── periods.yaml    # Period-based language
│   └── periodsLanguage.ts
├── App.tsx             # Root application component
└── main.tsx            # Application entry point
```

## Path Aliases

Path aliases are configured in `vite.config.ts` to enable cleaner, more maintainable imports.

### Available Aliases

| Alias | Target Directory | Use Case |
|-------|-----------------|-----------|
| `@src` | `src/` | General source files |
| `@components` | `src/components/` | Reusable UI components |
| `@layouts` | `src/layouts/` | Page layout components |
| `@pages` | `src/pages/` | Page components |
| `@hooks` | `src/hooks/` | Custom React hooks |
| `@services` | `src/services/` | Services and integrations |
| `@presenters` | `src/presenters/` | Presenter classes |
| `@styles` | `src/styles/` | SCSS/CSS files |
| `@containers` | `src/containers/` | Container components |
| `@assets` | `src/assets/` | Static assets (images, fonts) |
| `@types` | `src/types/` | TypeScript types |
| `@utils` | `src/utils/` | Utility functions |
| `@cob-uswds-components` | `node_modules/cob-uswds/packages/` | USWDS components |

### Usage Example

```tsx
// ❌ Don't use relative paths
import { MyComponent } from '../../../components/MyComponent';
import { usePropertyDetails } from '../../hooks/usePropertyDetails';
import '../../../styles/components.scss';

// ✅ Use aliases instead
import { MyComponent } from '@components/MyComponent';
import { usePropertyDetails } from '@hooks/usePropertyDetails';
import '@styles/components.scss';
```

### Benefits
- No more complex relative paths (`../../../`)
- Easier refactoring and file moves
- Consistent import patterns
- Better IDE autocomplete support
- Cleaner, more readable code

## USWDS Integration

The City of Boston US Web Design System (COB-USWDS) is fully integrated into the application.

### Configuration

- USWDS scripts are loaded from HTML and kept external during bundling
- USWDS assets (fonts, images, JS) are automatically copied to `dist/cob-uswds/`
- SCSS paths are configured for importing USWDS styles
- Custom theme variables in `src/styles/_uswds-theme.scss`

### Using USWDS Components

```tsx
// Import USWDS component styles
import '@cob-uswds-components/usa-button/src/styles';

// Use the USWDS classes
function MyButton() {
  return <button className="usa-button">Click Me</button>;
}
```

### USWDS Assets

The build process automatically copies USWDS assets:
- `/cob-uswds/fonts/` - Typography assets
- `/cob-uswds/img/` - Icons and images
- `/cob-uswds/js/` - JavaScript components

## Content Management

Content is managed through YAML files for easy updates without code changes.

### Content Files

1. **`src/utils/content.yaml`** - Component content
   - Section headings
   - Labels and descriptions
   - Help text
   - Links and references

2. **`src/utils/periods.yaml`** - Period-based language
   - Fiscal year-aware messages
   - Time-sensitive content
   - Dynamic text with variable substitution

### Content Architecture

The content system follows a service-based architecture:

```typescript
// Services resolve content from YAML
import { contentService } from '@services/content/ContentService';
import { languageService } from '@services/content/LanguageService';

// Presenters create React elements
import { PropertyTaxPresenter } from '@presenters/PropertyTaxPresenter';

// Content hooks coordinate everything
import { usePropertyTaxesContent } from '@hooks/content/usePropertyTaxesContent';
```

### Markdown Support

Content supports basic Markdown syntax:
- **Bold text**: `**text**`
- Links: `[text](url)`
- Automatically rendered to React elements

## Testing

### Component Testing with Storybook

All components have Storybook stories for:
- Visual testing
- Component documentation
- Interaction testing
- Accessibility testing

```bash
# Run Storybook
yarn storybook

# Build static Storybook
yarn build-storybook
```

### Unit Testing

Vitest is configured for unit tests:
```bash
# Run tests (when configured)
yarn test
```

### Browser Testing

Playwright is available for end-to-end testing.

## Build Configuration

### Development Mode

```bash
yarn dev
```

- Hot Module Replacement (HMR)
- Fast refresh
- Source maps enabled
- Development-friendly error messages

### Production Build

```bash
yarn build
```

Build optimizations:
- TypeScript compilation check
- Tree shaking for minimal bundle size
- Asset optimization (images, fonts)
- CSS minification
- JavaScript minification
- Source maps for debugging
- USWDS assets copied to output

### Build Output

Production builds are output to `/dist/`:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── cob-uswds/
│   ├── fonts/
│   ├── img/
│   └── js/
└── assessing_logo.svg
```

### Preview Production Build

```bash
yarn preview
```

Test the production build locally before deployment.

## Configuration Files

- **`vite.config.ts`** - Build and development server configuration
- **`tsconfig.json`** - TypeScript configuration
- **`eslint.config.js`** - Linting rules
- **`package.json`** - Dependencies and scripts
- **`firebase.json`** - Firebase hosting configuration (in project root)

## Additional Documentation

- [COB-USWDS Documentation](https://github.com/CityOfBoston/cob-uswds) - Design system docs

## Development Best Practices

1. **Use Path Aliases** - Always use `@` aliases instead of relative paths
2. **Follow Component Structure** - Each component in its own directory with styles and stories
3. **Type Everything** - Leverage TypeScript for type safety
4. **Test Components** - Create Storybook stories for visual testing
5. **Content in YAML** - Keep user-facing text in YAML files
6. **CSS Modules** - Use `.module.scss` for component-specific styles
7. **Accessibility** - Follow USWDS guidelines for accessible components
