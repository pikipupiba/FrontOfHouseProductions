# Next.js Compiler Configuration Notes

## SWC Compiler vs Babel

On March 17, 2025, we removed the `.babelrc` file from the project to resolve a conflict with Next.js's SWC compiler. This change was necessary because:

1. **Conflict with next/font**: The application was using `next/font/google` in `layout.tsx`, which specifically requires the SWC compiler.

2. **Error Message**: The presence of a custom `.babelrc` file was forcing Next.js to use Babel instead of SWC, resulting in this error:
   ```
   Syntax error: "next/font" requires SWC although Babel is being used due to a custom babel config being present.
   ```

3. **Solution**: Removing the `.babelrc` file allows Next.js to use its default SWC compiler, which is required for `next/font` to work properly.

## Jest Configuration

Jest tests will continue to work correctly because the Babel configuration for tests is already included in `jest.config.js`:

```javascript
transform: {
  '^.+\\.(ts|tsx)$': ['ts-jest', {
    tsconfig: 'tsconfig.json',
  }],
  '^.+\\.(js|jsx)$': ['babel-jest', {
    presets: ['next/babel']
  }]
}
```

This inline configuration ensures Jest will continue to use Babel for JavaScript files even without the `.babelrc`.

## Benefits of SWC

Switching to SWC provides several advantages:

1. **Performance**: SWC is significantly faster than Babel, reducing build times.
2. **Modern Features**: Better support for newer JavaScript and React features.
3. **Next.js Integration**: Full compatibility with Next.js-specific features like `next/font`.

## Future Considerations

If custom Babel transformations are needed in the future, consider:

1. Using Next.js's built-in configuration options when possible
2. Creating a separate Jest-specific Babel configuration if needed
3. Consulting the Next.js documentation on mixing SWC and Babel configurations
