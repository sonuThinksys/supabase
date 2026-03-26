Fix all issues in the provided file and make it production-ready.

Focus on:

## 1. Bugs
- Fix all runtime and logical errors
- Do not swallow errors (handle properly with try/catch)
- Ensure proper error messages and handling

## 2. TypeScript
- Resolve all TypeScript errors
- Add proper types where missing
- Avoid using `any`

## 3. Code Quality
- Remove unused variables, imports, and dead code
- Improve readability and structure
- Use meaningful naming

## 4. Performance
- Avoid unnecessary re-renders
- Remove unnecessary useCallback/useMemo
- Avoid inline functions in JSX
- Optimize expensive operations

## 5. Styling
- Move styles to separate file if required (e.g., Component.styles.ts)
- Remove inline styles
- Follow spacing and design rules from .claude/rules

## 6. Best Practices
- Follow all rules from .claude/rules/*
- Use project conventions consistently
- Reuse existing components if applicable

## 7. Refactoring
- Refactor code if needed to improve maintainability
- Keep code clean, modular, and scalable

---

### Output Requirements:
- Return updated code
- If styles are extracted, include the new styles file
- Do not break existing functionality