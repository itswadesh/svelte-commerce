export class ProductService {
	private platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify';
	private service: any;

	constructor(
		platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify',
		service: any
	) {
		this.platform = platform;
		this.service = service;
	}

	async getProducts(params: any = {}) {
		switch (this.platform) {
			case 'litekart':
				return this.service.getProducts(params);
			case 'medusa':
				return this.service.listProducts(params);
			case 'woocommerce':
				return this.service.getProducts(params);
			case 'shopify':
				const result = await this.service.getProducts(params);
				return result.products || result;
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}

	async getProduct(id: string | number) {
		switch (this.platform) {
			case 'litekart':
				return this.service.getProduct(id);
			case 'medusa':
				return this.service.retrieveProduct(id);
			case 'woocommerce':
				return this.service.getProduct(id);
			case 'shopify':
				const result = await this.service.getProduct(id);
				return result.product || result;
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}

	async searchProducts(query: string, params: any = {}) {
		switch (this.platform) {
			case 'litekart':
				return this.service.searchProducts(query, params);
			case 'medusa':
				return this.service.searchProducts(query, params);
			case 'woocommerce':
				return this.service.getProducts({ search: query, ...params });
			case 'shopify':
				return this.service.searchProducts(query, params.limit || 10);
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}
}

export class CategoryService {
	private platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify';
	private service: any;

	constructor(
		platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify',
		service: any
	) {
		this.platform = platform;
		this.service = service;
	}

	async getCategories(params: any = {}) {
		switch (this.platform) {
			case 'litekart':
				return this.service.getCategories(params);
			case 'medusa':
				return this.service.listProductCategories(params);
			case 'woocommerce':
				return this.service.getCategories(params);
			case 'shopify':
				const result = await this.service.getCollections(params);
				return result.custom_collections || result.collections || result;
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}

	async getCategory(id: string | number) {
		switch (this.platform) {
			case 'litekart':
				return this.service.getCategory(id);
			case 'medusa':
				return this.service.retrieveProductCategory(id);
			case 'woocommerce':
				return this.service.getCategory(id);
			case 'shopify':
				return this.service.getCollection(id);
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}
}

export class CartService {
	private platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify';
	private service: any;

	constructor(
		platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify',
		service: any
	) {
		this.platform = platform;
		this.service = service;
	}

	async createCart() {
		switch (this.platform) {
			case 'litekart':
				return this.service.createCart();
			case 'medusa':
				return this.service.createCart();
			case 'woocommerce':
				return this.service.createCart();
			case 'shopify':
				return this.service.createCart();
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}

	async addToCart(cartId: string, productId: string | number, quantity: number = 1) {
		switch (this.platform) {
			case 'litekart':
				return this.service.addToCart(cartId, productId, quantity);
			case 'medusa':
				return this.service.addToCart(cartId, { variant_id: productId, quantity });
			case 'woocommerce':
				return this.service.addToCart(cartId, productId, quantity);
			case 'shopify':
				return this.service.addToCart(cartId, productId, quantity);
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}

	async getCart(cartId: string) {
		switch (this.platform) {
			case 'litekart':
				return this.service.getCart(cartId);
			case 'medusa':
				return this.service.retrieveCart(cartId);
			case 'woocommerce':
				// WooCommerce typically handles cart on frontend
				return { id: cartId, items: [] };
			case 'shopify':
				return this.service.getCart(cartId);
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}
}

export class OrderService {
	private platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify';
	private service: any;

	constructor(
		platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify',
		service: any
	) {
		this.platform = platform;
		this.service = service;
	}

	async getOrders(params: any = {}) {
		switch (this.platform) {
			case 'litekart':
				return this.service.getOrders(params);
			case 'medusa':
				return this.service.listOrders(params);
			case 'woocommerce':
				return this.service.getOrders(params);
			case 'shopify':
				const result = await this.service.getOrders(params);
				return result.orders || result;
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}

	async createOrder(orderData: any) {
		switch (this.platform) {
			case 'litekart':
				return this.service.createOrder(orderData);
			case 'medusa':
				return this.service.createOrder(orderData);
			case 'woocommerce':
				return this.service.createOrder(orderData);
			case 'shopify':
				const result = await this.service.createOrder(orderData);
				return result.order || result;
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}
}

export class StoreService {
	private platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify';
	private service: any;

	constructor(
		platform: 'litekart' | 'medusa' | 'woocommerce' | 'shopify',
		service: any
	) {
		this.platform = platform;
		this.service = service;
	}

	async getStoreInfo() {
		switch (this.platform) {
			case 'litekart':
				return this.service.getStoreInfo();
			case 'medusa':
				return this.service.getStore();
			case 'woocommerce':
				return this.service.getStoreInfo();
			case 'shopify':
				return this.service.getStoreInfo();
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}

	async getStoreByIdOrDomain(params: { storeId?: string; domain?: string }) {
		switch (this.platform) {
			case 'litekart':
				return this.service.getStoreByIdOrDomain(params);
			case 'medusa':
				return this.service.getStore(params.storeId);
			case 'woocommerce':
				return this.service.getStoreInfo();
			case 'shopify':
				return this.service.getStoreInfo();
			default:
				throw new Error(`Unsupported platform: ${this.platform}`);
		}
	}
}
