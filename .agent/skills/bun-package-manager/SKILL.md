---
name: bun-package-manager
description: Global instruction to always use Bun as the package manager in Litekart Admin.
---

# Bun Package Manager Skill

This project strictly uses **Bun** as its package manager and runtime. All package-related operations and script executions MUST use `bun`.

## Core Instructions
- **ALWAYS use `bun`**: Never use `npm`, `yarn`, or `pnpm`.
- **Installing Packages**: Use `bun add <package>` or `bun add -d <package>`.
- **Running Scripts**: Use `bun run <script>` (e.g., `bun run dev`, `bun run build`).
- **Executing Binaries**: Use `bunx <command>` instead of `npx`.

## Why Bun?
- **Speed**: Bun is significantly faster than Node.js and other package managers for installing dependencies and running scripts.
- **Lockfile**: The project uses `bun.lock` and `bun.lockb`. Using other package managers will create redundant or conflicting lockfiles.
- **Compatibility**: All scripts and tools in this project are configured to run optimally with Bun.

## Commands Reference
| Action | Command |
| :--- | :--- |
| Install All Dependencies | `bun install` |
| Add Dependency | `bun add <package>` |
| Add Dev Dependency | `bun add -d <package>` |
| Remove Dependency | `bun remove <package>` |
| Run Dev Server | `bun run dev` |
| Build Project | `bun run build` |
| Execute Tool | `bunx <tool>` |
