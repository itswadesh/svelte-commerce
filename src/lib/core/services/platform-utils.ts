import { PlatformServiceFactory, type Platform } from './platform-factory';
import { env } from '$env/dynamic/public';

// Platform detection utilities
export const detectPlatform = (): Platform => {
	// Use SvelteKit's env module for consistent access
	if (env.PUBLIC_WOOCOMMERCE_API_URL) return 'woocommerce';
	if (env.PUBLIC_SHOPIFY_SHOP_DOMAIN && env.PUBLIC_SHOPIFY_ACCESS_TOKEN) return 'shopify';
	if (env.PUBLIC_MEDUSA_API_URL) return 'medusa';
	
	return 'litekart'; // Default
};

// Platform-specific configuration
export const getPlatformConfig = (platform: Platform) => {
	switch (platform) {
		case 'woocommerce':
			return {
				name: 'WooCommerce',
				description: 'WordPress e-commerce platform',
				features: ['products', 'categories', 'orders', 'customers'],
				apiVersion: 'WC/v3'
			};
		case 'shopify':
			return {
				name: 'Shopify',
				description: 'Cloud-based e-commerce platform',
				features: ['products', 'collections', 'orders', 'customers', 'checkout'],
				apiVersion: '2024-01'
			};
		case 'medusa':
			return {
				name: 'MedusaJS',
				description: 'Headless commerce platform',
				features: ['products', 'categories', 'orders', 'customers', 'regions', 'carts'],
				apiVersion: 'v2'
			};
		case 'litekart':
		default:
			return {
				name: 'Litekart',
				description: 'Indian e-commerce platform',
				features: ['products', 'categories', 'orders', 'customers', 'vendors'],
				apiVersion: 'v1'
			};
	}
};

// Initialize platform services
export const initializePlatform = async () => {
	await PlatformServiceFactory.initialize();
};

// Export platform factory for advanced usage
export { PlatformServiceFactory };
