import { env } from '$env/dynamic/public';
import { WooCommerceService } from './woocommerce/woocommerce-service';
import { ShopifyService } from './shopify/shopify-service';
import { ProductService, CategoryService, CartService, OrderService, StoreService } from './unified/unified-services';

// Import existing services
// import * as LitekartConnector from '@misiki/litekart-connector';
// import { BaseService } from '@misiki/medusa-connector';

// For now, we'll use dynamic imports to avoid build issues
let LitekartConnector: any;
let BaseService: any;

// Dynamic imports for existing connectors
async function loadConnectors() {
	try {
		if (typeof window !== 'undefined') {
			// Browser environment - connectors should be available globally
			LitekartConnector = (window as any).LitekartConnector;
			BaseService = (window as any).MedusaConnector?.BaseService;
		} else {
			// Server environment - dynamic imports with error handling
			try {
				const litekartModule = await import('@misiki/litekart-connector');
				LitekartConnector = litekartModule;
			} catch (e) {
				console.warn('Litekart connector not available:', e);
			}
			
			try {
				const medusaModule = await import('@misiki/medusa-connector');
				BaseService = medusaModule.BaseService;
			} catch (e) {
				console.warn('Medusa connector not available:', e);
			}
		}
	} catch (error) {
		console.warn('Could not load existing connectors:', error);
	}
}

export type Platform = 'litekart' | 'medusa' | 'woocommerce' | 'shopify';

export class PlatformServiceFactory {
	private static platform: Platform;
	private static services: Record<string, any> = {};

	static async initialize() {
		// Load existing connectors first
		await loadConnectors();
		
		// Determine platform from environment variables
		if (env.PUBLIC_WOOCOMMERCE_API_URL) {
			this.platform = 'woocommerce';
		} else if (env.PUBLIC_SHOPIFY_SHOP_DOMAIN && env.PUBLIC_SHOPIFY_ACCESS_TOKEN) {
			this.platform = 'shopify';
		} else if (env.PUBLIC_MEDUSA_API_URL) {
			this.platform = 'medusa';
		} else {
			this.platform = 'litekart'; // Default platform
		}

		// Initialize platform-specific services
		this.initializePlatformServices();
	}

	private static initializePlatformServices() {
		switch (this.platform) {
			case 'woocommerce':
				this.services.woocommerce = new WooCommerceService(
					env.PUBLIC_WOOCOMMERCE_API_URL!,
					env.PUBLIC_WOOCOMMERCE_CONSUMER_KEY!,
					env.PUBLIC_WOOCOMMERCE_CONSUMER_SECRET!
				);
				break;

			case 'shopify':
				this.services.shopify = new ShopifyService(
					env.PUBLIC_SHOPIFY_SHOP_DOMAIN!,
					env.PUBLIC_SHOPIFY_ACCESS_TOKEN!
				);
				break;

			case 'medusa':
				// Medusa uses the existing connector
				this.services.medusa = BaseService || null;
				break;

			case 'litekart':
			default:
				// Litekart uses the existing connector
				this.services.litekart = LitekartConnector || null;
				break;
		}
	}

	static async getPlatform(): Promise<Platform> {
		if (!this.platform) {
			await this.initialize();
		}
		return this.platform;
	}

	static async getProductService(): Promise<ProductService> {
		if (!this.platform) {
			await this.initialize();
		}
		return new ProductService(this.platform, this.services[this.platform]);
	}

	static async getCategoryService(): Promise<CategoryService> {
		if (!this.platform) {
			await this.initialize();
		}
		return new CategoryService(this.platform, this.services[this.platform]);
	}

	static async getCartService(): Promise<CartService> {
		if (!this.platform) {
			await this.initialize();
		}
		return new CartService(this.platform, this.services[this.platform]);
	}

	static async getOrderService(): Promise<OrderService> {
		if (!this.platform) {
			await this.initialize();
		}
		return new OrderService(this.platform, this.services[this.platform]);
	}

	static async getStoreService(): Promise<StoreService> {
		if (!this.platform) {
			await this.initialize();
		}
		return new StoreService(this.platform, this.services[this.platform]);
	}

	// For backward compatibility, expose raw services
	static async getRawService() {
		if (!this.platform) {
			await this.initialize();
		}
		return this.services[this.platform];
	}
}

// Export convenience functions
export const getProductService = async () => await PlatformServiceFactory.getProductService();
export const getCategoryService = async () => await PlatformServiceFactory.getCategoryService();
export const getCartService = async () => await PlatformServiceFactory.getCartService();
export const getOrderService = async () => await PlatformServiceFactory.getOrderService();
export const getStoreService = async () => await PlatformServiceFactory.getStoreService();
export const getCurrentPlatform = async () => await PlatformServiceFactory.getPlatform();
