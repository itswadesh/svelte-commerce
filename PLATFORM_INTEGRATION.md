# Multi-Platform E-Commerce Integration

This Svelte commerce project now supports four e-commerce platforms:
- **Litekart** (default)
- **MedusaJS** 
- **WooCommerce**
- **Shopify**

## Configuration

### Environment Variables

Add the appropriate environment variables to your `.env` file based on your platform:

#### Litekart (Default)
```env
PUBLIC_LITEKART_API_URL='https://api.litekart.in'
PUBLIC_LITEKART_DOMAIN="your-store.com"
PUBLIC_SITEMAP_URL='https://pub-3.r2.dev'
```

#### MedusaJS
```env
PUBLIC_MEDUSA_API_URL='https://your-medusa-store.com'
PUBLIC_MEDUSA_PUBLISHABLE_API_KEY='your_publishable_key'
PUBLIC_MEDUSA_REGION_ID='your_region_id'
```

#### WooCommerce
```env
PUBLIC_WOOCOMMERCE_API_URL='https://your-store.com'
PUBLIC_WOOCOMMERCE_CONSUMER_KEY='your_consumer_key'
PUBLIC_WOOCOMMERCE_CONSUMER_SECRET='your_consumer_secret'
```

#### Shopify
```env
PUBLIC_SHOPIFY_SHOP_DOMAIN='your-shop-name'
PUBLIC_SHOPIFY_ACCESS_TOKEN='your_access_token'
```

## Usage

### Basic Usage

The platform is automatically detected based on environment variables. You can use the unified service classes:

```typescript
import { getProductService, getCategoryService, getCartService } from '$lib/core/services';

// Get products
const productService = await getProductService();
const products = await productService.getProducts({ page: 1, per_page: 10 });

// Get categories
const categoryService = await getCategoryService();
const categories = await categoryService.getCategories();

// Cart operations
const cartService = await getCartService();
const cart = await cartService.createCart();
const updatedCart = await cartService.addToCart(cart.id, 'product-id', 2);
```

### Advanced Usage

For more control, you can use the platform factory directly:

```typescript
import { PlatformServiceFactory, getCurrentPlatform } from '$lib/core/services';

// Get current platform
const platform = await getCurrentPlatform();
console.log('Current platform:', platform);

// Get platform-specific service
const productService = await PlatformServiceFactory.getProductService();
const storeService = await PlatformServiceFactory.getStoreService();
const storeInfo = await storeService.getStoreInfo();
```

### Platform Detection

The system automatically detects the platform based on environment variables:

1. **WooCommerce** - if `PUBLIC_WOOCOMMERCE_API_URL` is set
2. **Shopify** - if `PUBLIC_SHOPIFY_SHOP_DOMAIN` and `PUBLIC_SHOPIFY_ACCESS_TOKEN` are set
3. **MedusaJS** - if `PUBLIC_MEDUSA_API_URL` is set
4. **Litekart** - default fallback

## Platform-Specific Features

### WooCommerce
- Products, Categories, Orders
- Basic cart functionality (custom implementation)
- REST API v3 integration

### Shopify
- Products, Collections, Orders
- GraphQL Storefront API for cart operations
- Admin REST API for management
- Product search functionality

### MedusaJS
- Full feature compatibility with existing connector
- Products, Categories, Orders, Regions, Carts
- Uses existing `@misiki/medusa-connector`

### Litekart
- Full feature compatibility with existing connector
- Uses existing `@misiki/litekart-connector`

## Architecture

The integration uses a unified service layer that abstracts platform differences:

```
┌─────────────────┐
│   Application   │
└─────────┬───────┘
          │
┌─────────▼───────┐
│ Unified Services│ (ProductService, CategoryService, etc.)
└─────────┬───────┘
          │
┌─────────▼───────┐
│ Platform Factory│ (Detects platform and initializes services)
└─────────┬───────┘
          │
┌─────────▼───────┐
│ Platform Services│
│ (WooCommerce,   │
│  Shopify,       │
│  MedusaJS,      │
│  Litekart)      │
└─────────────────┘
```

## Migration from Single Platform

If you're migrating from a single platform setup:

1. Update your environment variables for the new platform
2. Update service imports to use the unified services
3. The platform will be automatically detected

### Before (MedusaJS only)
```typescript
import { ProductService } from '$lib/core/services/medusa/product-service';
const service = new ProductService();
```

### After (Multi-platform)
```typescript
import { getProductService } from '$lib/core/services';
const service = await getProductService();
```

## Error Handling

The system includes proper error handling for:
- Missing environment variables
- API connection failures
- Platform-specific feature limitations

Each service will throw descriptive errors for platform-specific issues.

## Development Notes

- The system uses dynamic imports to avoid build issues with optional connectors
- Platform detection happens at runtime
- All services are async to support dynamic initialization
- Backward compatibility is maintained with existing connectors
