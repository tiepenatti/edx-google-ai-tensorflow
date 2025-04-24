## Code Style Guidelines

### General
- Use consistent formatting defined in .editorconfig and .prettierrc
- Maximum line length: 100 characters
- Use 2 spaces for indentation
- Keep README.md and CHANGELOG.md updated with major updates
- Use consistent and high-quality code
- Use clear, descriptive names for variables and methods
- Add comments only for complex logic, avoid over-commenting
- Keep functions small and focused (max 50 lines)
- Favour reusability, readability and maintainability
- Add blank lines to separate logical blocks of code

### Version Control
- Make atomic commits with clear messages
- Follow semantic versioning (MAJOR.MINOR.PATCH)

### Node/NPM
- Do not allow packages on version with vulnerabilities

### React
- Follow React functional component patterns with hooks
- Break long pages or components into smaller components
- Use functional components with hooks
- One component per file
- Use .tsx extension for React components
- Keep components pure and side-effect free
- Use destructuring for props
- Prefer composition over inheritance
- Add .scss file along component for component specific styles. Use general scss for common / reusable styles

### Typescript
- Use TypeScript with strict type checking
- Prefer const over let, avoid var
- Use explicit return types for functions
- Avoid any type unless absolutely necessary
- Always use strict equality (`===` and `!==`)
- Variables and properties: Use camelCase.
- Constants: Use UPPER_SNAKE_CASE.
- Classes and interfaces: Use PascalCase.
- Functions: Use camelCase.
- Boolean variables: Use names that clearly indicate a boolean value (e.g., isActive, isEnabled).
- Always use explicit semicolons (;) at the end of statements
- Use K&R style braces (opening brace on the same line)
- Use template literals instead of string concatenation
- Use arrow functions for callbacks
- Use async/await instead of raw promises when possible
- Never silently catch errors without proper handling
  
### Tensorflow
- Always clean up tensors to prevent memory leaks
- Use tf.tidy() whenever possible, check for cleanup of returned tensors
- Implement proper error handling for tensor operations
- Consider browser memory limitations
- Add performance monitoring where relevant
- Use appropriate data types for tensors
- Consider memory management in training loops
- Implement proper model cleanup

### Documentation Requirements
- Include JSDoc comments for functions and components
- Document tensor shapes and data types
- Add inline comments for complex tensor operations

### Styles
- Use SASS for styling following BEM methodology
- Keep selectors shallow (max 3 levels)
- Use variables for colors and breakpoints
- Mobile-first responsive design
- Avoid px styles in favor of rem based on default 16px font size

### Testing
- Write unit tests for all new features
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent
- Mock external dependencies

### Performance 
- Minimize DOM manipulations
- Use appropriate data structures
- Consider memory usage and clean up resources
- Optimize loops and expensive operations

### Security
- Validate all inputs
- Sanitize data before displaying
- Never store sensitive information in client-side code

### Code Review Checklist
- Does the code follow these guidelines?
- Is the code well-documented?
- Are there appropriate tests?
- Is error handling implemented?
- Is the code performant?
- Are there any security concerns?

### Refactoring
- Before refactoring a function, component, interface or class, take note of it's usages
- Update all references after the refactor and cleanup after
- After refactor, check for any unused variables, methods, imports and references