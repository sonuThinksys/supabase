# Code Style Rules

## 1. React / React Native
- Use functional components only
- Prefer hooks for state and lifecycle management
- Keep components small, reusable, and focused
- Use meaningful and descriptive names for variables and functions

---

## 2. JSX & Functions
- Do not use inline functions inside JSX
- Avoid arrow functions in props (e.g., onPress, onChange)
- Define handlers outside JSX
- Use useCallback only when necessary (avoid overuse)

❌ Bad:
<Button onPress={() => handleClick()} />

✅ Good:
const onPressHandler = useCallback(() => {
  handleClick();
}, []);

<Button onPress={onPressHandler} />

---

## 3. Styling Rules
- Each component must have a separate styles file
- Do not define styles inside the component file
- Inline styles are strictly prohibited
- Use `StyleSheet.create` in a dedicated styles file
- File naming format: `ComponentName.styles.ts`

### Folder Structure Rules

- Use feature-based folder structure for all screens and components
- Each screen/component must have its own folder
- All related files must be grouped inside the same folder

### Required Structure

Each feature folder must contain:

FolderName/
  FolderName.tsx              ✅ main component
  FolderName.styles.ts        ✅ styles
  FolderName.constants.ts     ✅ constants
  index.ts                    ✅ export only

### Example

CreateProject/
  CreateProject.tsx
  CreateProject.styles.ts
  CreateProject.constants.ts
  index.ts
---

## Additional Rules

- Do not place multiple feature files in a single flat folder
- Avoid mixing unrelated components in the same directory
- Use index.ts for clean exports

---

## 4. String Management
- Do not use hardcoded strings in components
- All user-facing text must be stored in constants files
- Import and use constants instead of inline text

❌ Bad:
<Text>Login</Text>

✅ Good:
// constants.ts
export const STRINGS = {
  LOGIN: 'Login',
};

// Component
<Text>{STRINGS.LOGIN}</Text>

---

## 5. Code Quality
- Remove unused variables, imports, and dead code
- Keep code clean and readable
- Follow consistent formatting across the project