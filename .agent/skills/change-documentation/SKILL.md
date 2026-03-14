---
name: change-documentation
description: Documentation guidelines for tracking project modifications in Litekart Admin.
---

# Change Documentation Skill

This skill ensures that every significant change to the Litekart Admin project is properly documented in the `CHANGELOG.md` file.

## Documentation Process

### 1. Identify the Change Type
Categorize your changes using the following tags:
- `🚀 New Features`: New functionality or significant improvements.
- `🐛 Bug Fixes`: Bug fixes and patches.
- `🔄 Improvements`: Non-breaking changes that enhance existing features.
- `⚠️ Breaking Changes`: Incompatible API changes that require user action.
- `🛠️ Maintenance`: Code refactoring, documentation, and other internal changes.
- `📦 Dependencies`: Dependency updates and changes.

### 2. Update `CHANGELOG.md`
Add a new entry under the `[Unreleased]` section (or create it if it doesn't exist) at the top of the file, or under the current active version.

Format:
```markdown
### [Category]
- [Description of change] ([PR/Issue Number] if applicable)
```

Example:
```markdown
### 🚀 New Features
- Added "Sales Dashboard" for real-time order tracking (#452)
```

## Guidelines
- **Be Concise**: Use clear, concise descriptions.
- **Use Imperative Mood**: E.g., "Add feature" instead of "Added feature".
- **Focus on User Impact**: Document changes that affect the user or developers consuming the API/code.
- **Keep it Updated**: Update the changelog as soon as the change is implemented or tested.

## Automation
When working as an AI agent, always check if a `CHANGELOG.md` update is required after completing a task. If so, proactively propose the change.
