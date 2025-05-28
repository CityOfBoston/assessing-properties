# Property Tax Lookup Frontend

## Development Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Project Structure

The project uses path aliases to make imports cleaner and more maintainable:

- `@src/*` - References files in the `src` directory
- `@components/*` - References components in `src/components`
- `@layouts/*` - References layout components in `src/layouts`
- `@styles/*` - References styles in `src/styles`
- `@containers/*` - References container components in `src/containers`
- `@assets/*` - References static assets in `src/assets`
- `@cob-components/*` - References USWDS components from `cob-uswds/packages`

### Path Aliases

Path aliases are configured in `vite.config.ts` and provide a way to create shorter, more maintainable import paths. They help avoid messy relative paths (../../) and make it easier to move files around without breaking imports.

#### Benefits of Using Aliases
- Cleaner import statements
- Easier to maintain and refactor code
- Better code organization
- Prevents import path issues when moving files
- Consistent import patterns across the project

#### How to Use Aliases
Instead of using relative paths, use the alias prefix followed by the path from the target directory:

```tsx
// Don't use relative paths
import { MyComponent } from '../../../components/MyComponent';
import { MainLayout } from '../../layouts/MainLayout';
import '../../../styles/components.scss';

// Use aliases instead
import { MyComponent } from '@components/MyComponent';
import { MainLayout } from '@layouts/MainLayout';
import '@styles/components.scss';
```

#### Available Aliases
| Alias | Target Directory | Use Case |
|-------|-----------------|-----------|
| `@src` | `src/` | General source files |
| `@components` | `src/components/` | Reusable UI components |
| `@layouts` | `src/layouts/` | Page layout components |
| `@styles` | `src/styles/` | SCSS/CSS files |
| `@containers` | `src/containers/` | Container components |
| `@assets` | `src/assets/` | Static assets (images, fonts) |
| `@cob-components` | `cob-uswds/packages/` | USWDS components |

#### IDE Support
To get proper TypeScript/IDE support for these aliases, make sure your IDE is configured to recognize the path aliases. Most modern IDEs (VS Code, WebStorm) will automatically pick up the configuration from `vite.config.ts`.

### Example Usage

Before:
```tsx
import { MyComponent } from '../../components/MyComponent';
import { MainLayout } from '../../layouts/MainLayout';
import '../../styles/components.scss';
```

After:
```tsx
import { MyComponent } from '@components/MyComponent';
import { MainLayout } from '@layouts/MainLayout';
import '@styles/components.scss';
```

## USWDS Integration

The City of Boston USWDS framework is integrated directly:

- USWDS scripts are loaded from HTML and kept external during bundling
- USWDS assets (fonts, images, JS) are copied to the `dist/uswds` directory
- SCSS paths are configured for easy importing of USWDS styles

### Using USWDS Components

```tsx
// Import USWDS component styles
import '@cob-components/usa-button/src/styles';

// Use in your component
function MyButton() {
  return <button className="usa-button">Click Me</button>;
}
```

## Build Configuration

The Vite configuration is optimized for:

1. Fast development feedback with HMR
2. Proper path aliasing
3. Optimized production builds with console statements removed
4. Source maps for debugging
5. Proper USWDS asset handling in both development and production

See `vite.config.ts` for detailed configuration options and comments.
