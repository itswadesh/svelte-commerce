export class WooCommerceService {
	private apiUrl: string;
	private consumerKey: string;
	private consumerSecret: string;

	constructor(
		apiUrl: string,
		consumerKey: string,
		consumerSecret: string
	) {
		this.apiUrl = apiUrl;
		this.consumerKey = consumerKey;
		this.consumerSecret = consumerSecret;
	}

	private getAuthHeaders(): HeadersInit {
		const credentials = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
		return {
			'Authorization': `Basic ${credentials}`,
			'Content-Type': 'application/json'
		};
	}

	async getProducts(params: {
		page?: number;
		per_page?: number;
		category?: string;
		search?: string;
		status?: string;
	} = {}) {
		const url = new URL(`${this.apiUrl}/wp-json/wc/v3/products`);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, value.toString());
			}
		});

		const response = await fetch(url.toString(), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`WooCommerce API error: ${response.statusText}`);
		}

		return response.json();
	}

	async getProduct(id: string | number) {
		const response = await fetch(`${this.apiUrl}/wp-json/wc/v3/products/${id}`, {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`WooCommerce API error: ${response.statusText}`);
		}

		return response.json();
	}

	async getCategories(params: { per_page?: number; parent?: number } = {}) {
		const url = new URL(`${this.apiUrl}/wp-json/wc/v3/products/categories`);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, value.toString());
			}
		});

		const response = await fetch(url.toString(), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`WooCommerce API error: ${response.statusText}`);
		}

		return response.json();
	}

	async createCart() {
		// WooCommerce doesn't have a native cart API like other platforms
		// Cart is typically handled on the frontend with localStorage
		// Return a cart structure for consistency
		return {
			id: `wc_cart_${Date.now()}`,
			items: [],
			totals: {
				subtotal: 0,
				total: 0,
				currency: 'USD'
			}
		};
	}

	async addToCart(cartId: string, productId: string | number, quantity: number = 1) {
		// This would typically be handled by a custom endpoint or plugin
		// For now, return a mock response
		return {
			success: true,
			cartId,
			productId,
			quantity,
			message: 'Product added to cart'
		};
	}

	async getOrders(params: { customer_id?: string; status?: string } = {}) {
		const url = new URL(`${this.apiUrl}/wp-json/wc/v3/orders`);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, value);
			}
		});

		const response = await fetch(url.toString(), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`WooCommerce API error: ${response.statusText}`);
		}

		return response.json();
	}

	async createOrder(orderData: any) {
		const response = await fetch(`${this.apiUrl}/wp-json/wc/v3/orders`, {
			method: 'POST',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(orderData)
		});

		if (!response.ok) {
			throw new Error(`WooCommerce API error: ${response.statusText}`);
		}

		return response.json();
	}

	async getStoreInfo() {
		const response = await fetch(`${this.apiUrl}/wp-json/wc/v3/system_status`, {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`WooCommerce API error: ${response.statusText}`);
		}

		const data = await response.json();
		return {
			name: data.settings?.general?.woocommerce_store_name || 'WooCommerce Store',
			url: this.apiUrl,
			currency: data.settings?.general?.woocommerce_currency || 'USD',
			platform: 'woocommerce'
		};
	}
}
