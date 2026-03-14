---
name: svelte-5-runes
description: Documentation and best practices for Svelte 5 Runes in the Litekart Admin project.
---

# Svelte 5 Runes Skill

This skill provides guidelines for working with Svelte 5 Runes in the Litekart Admin codebase. Svelte 5 introduces a new reactivity model based on runes.

## Core Runes

### `$state`
Use `$state` for declaring reactive state.
```typescript
let count = $state(0);
let user = $state({ name: 'John Doe' });
```

### `$derived`
Use `$derived` for state that depends on other state.
```typescript
let doubleCount = $derived(count * 2);
```

### `$props`
Use `$props` to receive props in components.
```svelte
<script>
  let { title, items = [] } = $props();
</script>
```

### `$effect`
Use `$effect` for side effects. Avoid using it for state synchronization; use `$derived` instead.
```typescript
$effect(() => {
  console.log('Count changed:', count);
});
```

## Migration Patterns (from Svelte 4)
- Replace `export let` with `$props()`.
- Replace `$: label` with `$derived()` for computed values.
- Replace `$: { ... }` with `$effect()` for side effects.
- Use callback props (e.g., `onchange`) instead of `createEventDispatcher` or `on:click` syntax for custom events.

## Best Practices
- Keep state local whenever possible.
- Use `$state.raw` for large arrays or objects where you don't need deep reactivity.
- Avoid referencing state locally in a way that causes "state_referenced_locally" warnings.
- Use SvelteKit 2 `$app/state` for workspace/page state.
