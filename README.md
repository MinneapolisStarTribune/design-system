# design-system

A React component library built with TypeScript and Tailwind CSS.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing, along with [React Testing Library](https://testing-library.com/react) for component testing.

### Running Tests

```bash
# Run all tests
yarn test

# Run a specific test
yarn test path/to/test.test.tsx

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

Component tests are colocated alongside the components in `*.test.tsx` files.