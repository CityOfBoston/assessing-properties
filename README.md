# Project Configuration and Architecture Overview

## Vite Configuration

The project uses Vite as the bundler, which provides fast development and optimized production builds. Looking at the `vite.config.ts` file:

### Alias Setup
```javascript
resolve: {
  alias: {
    '@uswds-components': path.resolve(__dirname, USWDS_PACKAGES_PATH),
    '@uswds-assets': path.resolve(__dirname, USWDS_DIST_PATH),
  },
}
```

These aliases enable:
- `@uswds-components` points to `node_modules/cob-uswds/packages` for importing USWDS components
- `@uswds-assets` points to `node_modules/cob-uswds/dist` for accessing compiled assets

### Static Asset Handling
```javascript
viteStaticCopy({
  targets: [
    {
      src: `${USWDS_DIST_PATH}/fonts`,
      dest: 'assets/uswds',
    },
    {
      src: `${USWDS_DIST_PATH}/img`,
      dest: 'assets/uswds',
    },
  ],
})
```

This copies USWDS fonts and images to the `assets/uswds` directory in the build output, making them available at runtime.

### SCSS Configuration
```javascript
css: {
  preprocessorOptions: {
    scss: {
      includePaths: [
        path.resolve(__dirname, USWDS_PACKAGES_PATH),
      ],
    },
  },
}
```

This configuration allows SCSS files to import from USWDS packages without specifying the full path.

### Build Optimization
The build is configured with sourcemaps for debugging and terser minification for production, with console logs being removed in production builds.

## Storybook Setup

Storybook is configured in the `.storybook` directory with:

1. `main.ts` - Configures addons, webpack/vite, and static assets
2. `preview.ts` - Sets up global decorators and parameters
3. Static dirs that mirror the same USWDS asset path structure as the main application

The setup ensures assets and styles are available in both the app and Storybook environments. Proper aliases are established to make imports work seamlessly.

## Styling Solution

The project uses a hybrid approach to styling:

### Directly Imported SCSS
Components use CSS Modules with the naming convention `[filename].module.scss`, which:

1. Provides style encapsulation through locally scoped class names
2. Allows direct access to design tokens through forwarded SCSS functions
3. Prevents style conflicts across components

This approach works because:
- Vite handles CSS modules automatically, generating unique class names
- The forwarded USWDS token functions provide access to the design system
- It maintains component independence while still following design standards

### Global SCSS
The project uses `main.scss` as the global style entry point which:

1. Imports theme configuration from `_uswds-theme.scss`
2. Imports core USWDS styles and components
3. Forwards design tokens and mixins for component-level use
4. Sets minimal global styles for the document

The global styles provide a consistent base, while component-specific styles handle the rest.

## Project Structure

The codebase follows a hierarchical component architecture:

### Components (`src/components/`)
Reusable UI elements that:
- Handle a single responsibility
- Are stateless or have minimal internal state
- Can be composed into larger components
- Have their own scoped styles via `[ComponentName].module.scss`
- Include Storybook stories for isolated development and testing

### Layouts (`src/layouts/`)
Structural components that:
- Define page structure but not content
- Handle responsive behavior across viewports
- Manage layout-specific behaviors (like sticky headers)
- Typically contain slots for content via props.children
- Have their own scoped styles via `[LayoutName].module.scss`
- Include Storybook stories that demonstrate different content arrangements

### Pages (`src/pages/`)
Complete views composed of layouts and components that:
- Represent entire application routes
- Handle data fetching and state management
- Coordinate between multiple components
- May have page-specific styles via `[PageName].module.scss`
- Include Storybook stories that demonstrate the fully assembled page

## File Organization Conventions

Each component, layout, or page follows a consistent file structure:

```
ComponentName/
  ├── index.ts
  ├── ComponentName.tsx          # React component
  ├── ComponentName.module.scss  # Scoped styles
  └── ComponentName.stories.tsx  # Storybook stories
```

This organization:
1. Keeps related files together
2. Makes it easy to locate all aspects of a component
3. Simplifies importing and refactoring
4. Provides a consistent pattern for the team to follow
