# Copilot Instructions

## Language and Communication Policy

- Always think, reason, and write code in English
- Always respond to user instructions and questions in **Japanese**
- Use concise, telegraphic style - minimize volume
- Avoid unnecessary explanations and emojis

## Task Execution Workflow

1. List tasks, files and what you do → **Get approval**
2. Execute implementation
3. Run tests → If fails, investigate and propose fixes → **Get approval** → Fix
4. Prepare commit message → **Get approval** → Commit

## Trigger Keywords

When user input contains these keywords → **STOP & REQUEST APPROVAL**

- commit, push, git add
- create, modify, delete, fix, refactor
- test, build, deploy

## Tools

- Use **pnpm** for all package management
- Consult Context7 MCP tools when needed

## Git Workflow

### Commit Format

`<type>: <description>`

**Types:** add, fix, remove, update, WIP

### Rules

- English, imperative mood (Add, Update, Fix)
- Lowercase description, no period
- Be specific and concise

## Reference Skills

For detailed guidelines, the following skills are available and will be loaded automatically when needed:

| Skill                    | When Used                                             |
| ------------------------ | ----------------------------------------------------- |
| `coding-standards`       | Code implementation, refactoring, testing             |
| `planning`               | Planning phase, requirement gathering, task breakdown |
| `ui-design`              | UI/UX design, styling, accessibility                  |
| `nextjs-architecture`    | Next.js App Router projects                           |
| `hono-htmx-architecture` | Hono + HTMX + Cloudflare Workers projects             |
