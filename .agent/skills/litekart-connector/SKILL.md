---
name: litekart-connector
description: Guidelines for interacting with the Litekart API via litekart-connector in Litekart Admin.
---

# Litekart Connector Skill

Litekart Admin uses `@misiki/litekart-connector` to interact with the Litekart backend. This package provides standardized services and types.

## Usage in Project
The connector is re-exported from:
- `src/lib/core/services/index.ts` (Services)
- `src/lib/core/types/index.ts` (Types)

### Importing
Prefer importing from the local re-exports:
```typescript
import { ProductService, Product } from '$lib/core';
```

## Core Features
The connector typically provides:
- **Services**: `ProductService`, `CategoryService`, `StoreService`, `CartService`, etc.
- **Types**: Interfaces for `Product`, `Category`, `Order`, `CartItem`, etc.

## Best Practices
- **Type Safety**: Always use the types provided by the connector for local variable declarations and function signatures.
- **Service Patterns**: Use the static methods provided by the services for data fetching and mutations.
- **Consistency**: Maintain consistency with the Medusa integration patterns where applicable, but prioritize the Litekart-specific services for Litekart-related data.
- **Error Handling**: Standardize error handling when calling connector services to ensure consistent user feedback across the admin panel.

## Common Operations
- `ProductService.getProducts()`: Fetch a list of products.
- `CategoryService.getCategories()`: Fetch project categories.
- `StoreService.getStore()`: Retrieve store configuration.
