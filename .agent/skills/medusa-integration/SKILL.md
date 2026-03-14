---
name: medusa-integration
description: Guidelines for interacting with the Medusa API in Litekart Admin.
---

# Medusa Integration Skill

Litekart Admin integrates with Medusa for e-commerce functionality. This skill documents the patterns for API interaction.

## Service Layer
API services are located in `src/lib/core/services/medusa/`.

### Service Pattern
Services are classes or modules that encapsulate API calls.
```typescript
import { apiService } from './api-service';

export const productService = {
  getProducts: async () => {
    return await apiService.get('/store/products');
  }
};
```

### Authentication
Authentication is handled by `auth-service.ts`. Ensure tokens are correctly managed and included in headers for authenticated requests.

## Data Fetching
- Use Svelte 5 runes (`$state`) to manage data fetched from services.
- Use SvelteKit `load` functions for server-side data fetching when possible.

## Best Practices
- **Encapsulate logic**: Keep API-specific logic (e.g., URL construction, data transformation) within the service layer.
- **Error Handling**: Implement robust error handling (using `try/catch` and appropriate user feedback) for all API calls.
- **Type Safety**: Use Zod or TypeScript types to define the structure of API responses.
- **Axios Configuration**: Use the shared `axios.ts` instance for consistent request configuration (interceptors, base URL, etc.).
