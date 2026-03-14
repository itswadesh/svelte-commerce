---
name: shadcn-svelte
description: Guidelines for using and extending ShadCN Svelte components in Litekart Admin.
---

# ShadCN Svelte Skill

Litekart Admin uses `shadcn-svelte` for its UI components. These components are built on top of `bits-ui` and `tailwind-merge`.

## Component Usage
Components are located in `src/lib/components/ui/`.

### Importing Components
Always import components from their specific directory:
```typescript
import { Button } from '$lib/components/ui/button';
import * as Dialog from '$lib/components/ui/dialog';
```

### Customizing Styles
Use the `classes` or `class` prop (depending on the component version) and `tailwind-merge` (`cn` utility) for styling overrides.
```svelte
<Button class={cn('w-full bg-primary', className)}>Click Me</Button>
```

## Adding New Components
To add a new shadcn component, use the CLI:
```bash
npx shadcn-svelte@latest add [component-name]
```
Note: Ensure the component is added to `src/lib/components/ui/`.

## Best Practices
- **Prefer Composition**: Use the provided sub-components (e.g., `Dialog.Content`, `Dialog.Header`) instead of creating large, monolithic wrapper components.
- **Maintain Accessibility**: ShadCN components are accessible by default. Ensure that any customizations do not break ARIA attributes or keyboard navigation provided by `bits-ui`.
- **Consistency**: Follow the existing patterns in `src/lib/components/ui/` when adding or modifying components.
- **Theming**: Use CSS variables defined in `src/app.css` for consistent theming across components.
