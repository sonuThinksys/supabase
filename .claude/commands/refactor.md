Refactor the given file to improve code quality, structure, and maintainability.

---

## Goals

- Improve readability and structure
- Reduce complexity
- Make code clean, modular, and scalable
- Do not break existing functionality

---

## Refactoring Guidelines

### 1. Code Structure
- Simplify complex logic
- Extract reusable functions/components where needed
- Improve file organization

---

### 2. React / React Native
- Use functional components
- Ensure proper hook usage
- Remove inline functions from JSX
- Avoid unnecessary re-renders

---

### 3. Styling
- Move styles to separate file: `ComponentName.styles.ts`
- Remove inline styles
- Use `StyleSheet.create`

---

### 4. String Management
- Remove hardcoded strings
- Move text to constants file

---

### 5. Performance
- Optimize rendering
- Remove unnecessary useCallback/useMemo
- Avoid redundant computations

---

### 6. Code Quality
- Remove unused imports and variables
- Improve naming
- Ensure clean formatting

---

### 7. Rules Enforcement
- Follow all rules from `.claude/rules/*`

---

## Important Instructions

- Do NOT change business logic unless necessary
- Preserve existing functionality
- Focus on structure and readability improvements

---

## Output Requirements

- Return updated code
- Include styles file if extracted
- Include constants file if created/updated
- Do not include explanations unless necessary