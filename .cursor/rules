# PSX Analytical Platform - Development Rules

## Source of Truth
1. **GitHub Issues and Projects are the single source of truth**
   - All features, bugs, and tasks must be tracked in GitHub Issues
   - Reference issue numbers in all code changes and commits
   - Check project board before starting any work

## Documentation and Logging
2. **Comprehensive Activity Logging**
   - Every feature, bug fix, or change must be logged in GitHub Issues
   - Update issue status as work progresses
   - Document decisions, blockers, and resolutions in issue comments
   - Link related issues and PRs

## Testing Requirements
3. **100% Test Coverage Mandate**
   - Write unit tests for all functions, components, and modules
   - Achieve and maintain 100% code coverage
   - Tests must be written before marking any feature as complete
   - Use appropriate testing frameworks (Jest, React Testing Library, etc.)
   - Mock external dependencies appropriately

4. **End-to-End Testing for Frontend**
   - Write E2E tests for all user flows and critical paths
   - Use Playwright or Cypress for E2E testing
   - Test across different browsers and viewports
   - Include accessibility testing in E2E suites

## Version Control
5. **Controlled Git Operations**
   - Agent will NOT commit or push without explicit user authorization
   - When user explicitly authorizes with phrases like "I authorize you" or "you can commit/push", agent may proceed
   - Agent must request git_write permissions before any git operations
   - User maintains full control and can revoke authorization at any time
   - Agent will prepare changes and inform user when ready to commit
   - Default behavior: Ask first, then act only with clear authorization

## Completion Criteria
6. **Definition of Done**
   - Feature is NOT complete until ALL of the following are verified:
     - Unit tests written and passing (100% coverage)
     - E2E tests written and passing (where applicable)
     - Code reviewed for security issues
     - Documentation updated
     - Manual testing performed
     - No linter errors or warnings
   - Agent must explicitly test all aspects before declaring completion

## API Standards
7. **OpenAPI Schema Compliance**
   - All APIs must follow OpenAPI 3.0+ specifications
   - Generate and maintain OpenAPI schema files
   - Use schema validation for requests and responses
   - Document all endpoints, parameters, and response types
   - Keep schemas in sync with implementation

## Working Mode
8. **Ask Mode - Collaborative Approach**
   - Agent operates in ASK mode, not BURST mode
   - Seek clarification before making assumptions
   - Confirm approach before implementing major changes
   - Present options and wait for user decision
   - Break down work into reviewable chunks
   - Request feedback at logical checkpoints

## Security Requirements
- Follow secure coding practices
- No hardcoded secrets or credentials
- Validate all inputs
- Implement proper error handling
- Use environment variables for configuration
- Follow principle of least privilege

## Code Quality Standards
- Write clean, maintainable, and well-documented code
- Follow consistent code style and formatting
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow React best practices
- Optimize for performance

## Project-Specific Context
- **Platform**: PSX (Pakistan Stock Exchange) Analytical Platform
- **Initial Scope**: 
  - Complete frontend implementation
  - Cement sector analysis
  - Company financial statements
- **Tech Stack**: (To be confirmed)
  - Frontend: React/Next.js (assumed)
  - Testing: Jest, React Testing Library, Playwright/Cypress
  - API: OpenAPI compliant

## Workflow
1. Check GitHub Issues for current task
2. Clarify requirements with user
3. Design approach and get approval
4. Implement feature with tests
5. Run all tests and verify coverage
6. Perform security review
7. Update documentation
8. Log completion in GitHub Issue
9. Inform user - ready for commit

---

**Remember**: Quality over speed. Never skip tests. Always ask before assuming.

