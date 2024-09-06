# Contributing to SDG Innovation Commons

Thank you for your interest in contributing to **SDG Innovation Commons**! We welcome all contributions—whether you're reporting a bug, improving documentation, adding new features, or fixing existing issues. By following these guidelines, you help ensure that the project remains high quality and easy to maintain.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Setting Up the Project Locally](#setting-up-the-project-locally)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [Code Style](#code-style)
- [License](#license)

## Code of Conduct

Before contributing, please read our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure that your behavior aligns with the community standards.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on the repository by providing the following details:

- **A clear and descriptive title**.
- **Steps to reproduce**: Provide the steps needed to reproduce the issue.
- **Expected behavior**: What you expected to happen.
- **Actual behavior**: What actually happened instead.
- **Screenshots or logs** (if applicable).

Make sure to search the existing issues before opening a new one to avoid duplicates.

### Suggesting Enhancements

We are always looking for ways to improve the project! If you have an idea for a new feature or enhancement:

- Open a new issue describing the feature or enhancement.
- Explain why it would be useful.
- Describe how it might be implemented (if possible).
- Discuss potential alternatives or other approaches, if applicable.

### Pull Requests

We appreciate pull requests! If you plan to submit code, please follow these steps:

1. **Fork the repository** and clone it to your local machine.

   ```bash
    git clone https://github.com/your-username/sdg-innovation-commons.git
   ```

2. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them with clear, descriptive commit messages.
4. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request from your branch to the main branch of this repository.
   Before submitting, please ensure:

- Your code adheres to the project’s coding style.
- You have added tests for your changes, where applicable.
- You have updated any documentation affected by your changes.
  Our team will review the pull request, provide feedback, and merge it if everything looks good.

### Setting Up the Project Locally

To contribute code, you’ll need to set up the project on your local machine:

1. Fork the repository and clone it to your machine.
   ```bash
   git clone https://github.com/your-username/sdg-innovation-commons.git
   cd sdg-innovation-commons
   ```
2. Install dependencies:
   ```bash
       npm install
       # or
       yarn install
   ```
3. Run the development server:
   ```bash
       npm run dev
       # or
       yarn dev
   ```
4. Open http://localhost:3000 in your browser to view the project.

### Style Guides

### # Git Commit Messages

- Use clear, concise commit messages.
- Use the imperative mood in your commit messages (e.g., "Fix bug" instead of "Fixed bug").
- For large commits, include a description of the problem and how the solution works.

### Code Style

Please adhere to the following guidelines when writing code:

- Follow the general JavaScript/React.js/Next.js coding standards.
- Ensure your code is readable, with clear variable and function names.
- Avoid committing commented-out code.
- Use ESLint to ensure consistent coding standards across the project.

### License

By contributing to SDG Innovation Commons, you agree that your contributions will be licensed under the MIT License.
