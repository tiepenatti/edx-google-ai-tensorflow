# Coding Guidelines

This document outlines the coding standards and best practices that should be followed by all contributors, including AI agents, when working on this project.

## General Guidelines

1. **Code Formatting**
   - Follow .editorconfig and .prettierrc
   - Use consistent indentation (2 spaces)
   - Keep lines under 100 characters when possible
   - Use meaningful variable and function names
   - Add blank lines to separate logical blocks of code

2. **Documentation**
   - All functions should have JSDoc comments explaining their purpose, parameters, and return values
   - Include inline comments for complex logic
   - Keep documentation up-to-date with code changes

3. **File Organization**
   - One class/component per file
   - Use meaningful file names that reflect their contents
   - Group related files in appropriate directories

4. **Naming Conventions**
   - Use camelCase for variables and functions
   - Use PascalCase for class names
   - Use UPPER_SNAKE_CASE for constants
   - Prefix private properties with underscore (_)

5. **TypeScript/JavaScript Specific**
   - Always use strict equality (`===` and `!==`)
   - Prefer `const` over `let`, avoid `var`
   - Use template literals instead of string concatenation
   - Use arrow functions for callbacks
   - Use async/await instead of raw promises when possible

6. **Error Handling**
   - Use try-catch blocks for error-prone operations
   - Provide meaningful error messages
   - Never silently catch errors without proper handling

7. **Testing**
   - Write unit tests for all new functionality
   - Maintain test coverage above 80%
   - Test both success and error cases
   - Use meaningful test descriptions

8. **Performance**
   - Minimize DOM manipulations
   - Use appropriate data structures
   - Consider memory usage and clean up resources
   - Optimize loops and expensive operations

9. **Security**
   - Validate all inputs
   - Sanitize data before displaying
   - Never store sensitive information in client-side code
   - Use proper authentication and authorization

10. **Version Control**
    - Write clear, descriptive commit messages
    - Keep commits atomic and focused
    - Follow conventional commit format (feat:, fix:, docs:, etc.)
    - Create feature branches for new development

11. **TensorFlow.js Specific**
    - Properly dispose of tensors using tf.dispose() or tf.tidy()
    - Use appropriate data types for tensors
    - Consider memory management in training loops
    - Implement proper model cleanup

12. **Code Review Checklist**
    - Does the code follow these guidelines?
    - Is the code well-documented?
    - Are there appropriate tests?
    - Is error handling implemented?
    - Is the code performant?
    - Are there any security concerns?

## Best Practices for AI Development

1. **Model Management**
   - Document model architecture and parameters
   - Version control model files
   - Include model performance metrics
   - Document training data requirements

2. **Data Processing**
   - Document data preprocessing steps
   - Include data validation
   - Handle missing or invalid data gracefully
   - Consider data privacy implications

3. **Resource Management**
   - Implement proper cleanup of resources
   - Monitor memory usage
   - Use appropriate batch sizes
   - Implement progress indicators for long operations

## Maintenance

These guidelines should be reviewed and updated regularly to ensure they remain relevant and effective. All contributors, including AI agents, should follow these guidelines when making changes to the codebase.

Remember: Code is read more often than it is written. Always strive for clarity and maintainability over clever solutions.