# Performance Rules

- Avoid unnecessary re-renders
- Use useMemo and useCallback where needed
- Debounce API calls
- Use FlatList instead of map for large lists
- Do not use inline functions inside render methods or JSX
- Avoid arrow functions in props (e.g., onPress, onChange)
- Use useCallback for event handlers
- Define handlers outside JSX