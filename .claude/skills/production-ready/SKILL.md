When the user asks to optimize, refactor, review, clean, or make code production-ready:

---

## Step 1: Analyze

- Review all provided files
- Identify:
  - bugs (high priority)
  - performance issues
  - code quality problems
  - rule violations from `.claude/rules/*`

---

## Step 2: Fix Issues

- Fix all bugs and logical errors
- Do not allow silent failures
- Ensure proper error handling
- Fix incorrect API usage if any

---

## Step 3: Refactor

- Improve code structure and readability
- Extract reusable components if duplication exists
- Extract shared logic into hooks or utilities
- Simplify complex logic

---

## Step 4: Enforce Rules

Strictly apply all project rules:

- No inline styles
- No inline functions in JSX
- Use separate styles file (`ComponentName.styles.ts`)
- Use constants file for all strings
- Follow feature-based folder structure

---

## Step 5: Optimize

- Remove unnecessary re-renders
- Remove unnecessary useCallback/useMemo
- Optimize expensive operations

---

## Step 6: Output

- Return final updated code only
- Include any newly created files:
  - styles file
  - constants file
  - extracted components
- Do not ask for confirmation
- Do everything in one flow

---

## Behavior

- Be strict and production-focused
- Do not leave partial fixes
- Do not break existing functionality