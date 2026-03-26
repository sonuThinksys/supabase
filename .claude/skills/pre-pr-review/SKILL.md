Trigger when user asks:

- review my commit
- review changes before PR
- check my branch before PR
- pre PR review
- review staged changes

---

## Step 1: Identify Changes

- Get all modified files in current branch
- Focus on staged/changed files only

---

## Step 2: Review

For each file:

- detect bugs
- detect performance issues
- detect bad practices
- check rule violations from `.claude/rules/*`

---

## Step 3: Fix (Important)

- Automatically fix all critical and medium issues
- Do not leave unresolved problems
- Ensure no functionality is broken

---

## Step 4: Refactor

- improve readability
- remove duplication
- clean structure

---

## Step 5: Final Validation

- ensure code follows:
  - no inline styles
  - no inline functions
  - separate styles file
  - constants usage
  - proper folder structure

---

## Step 6: Output

- show summary of issues found and fixed
- return updated code if changes made
- highlight any remaining risks

---

## Behavior

- act like a senior reviewer before PR
- be strict and production-focused
- do not skip edge cases