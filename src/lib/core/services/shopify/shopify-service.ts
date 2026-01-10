export class ShopifyService {
	private shopDomain: string;
	private accessToken: string;

	constructor(shopDomain: string, accessToken: string) {
		this.shopDomain = shopDomain;
		this.accessToken = accessToken;
	}

	private getHeaders(): HeadersInit {
		return {
			'X-Shopify-Access-Token': this.accessToken,
			'Content-Type': 'application/json'
		};
	}

	private async makeRequest(endpoint: string, options: RequestInit = {}) {
		const url = `https://${this.shopDomain}.myshopify.com/admin/api/2024-01${endpoint}`;
		
		const response = await fetch(url, {
			...options,
			headers: {
				...this.getHeaders(),
				...options.headers
			}
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		return response.json();
	}

	async getProducts(params: {
		limit?: number;
		page_info?: string;
		product_type?: string;
		status?: 'active' | 'archived' | 'draft';
	} = {}) {
		const url = new URL('/products.json', `https://${this.shopDomain}.myshopify.com/admin/api/2024-01`);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, value.toString());
			}
		});

		const response = await fetch(url.toString(), {
			headers: this.getHeaders()
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		return response.json();
	}

	async getProduct(id: string | number) {
		return this.makeRequest(`/products/${id}.json`);
	}

	async getProductsByCollection(collectionId: string | number, params: { limit?: number } = {}) {
		const url = new URL(`/collections/${collectionId}/products.json`, `https://${this.shopDomain}.myshopify.com/admin/api/2024-01`);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, value.toString());
			}
		});

		const response = await fetch(url.toString(), {
			headers: this.getHeaders()
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		return response.json();
	}

	async getCollections(params: { limit?: number } = {}) {
		const url = new URL('/custom_collections.json', `https://${this.shopDomain}.myshopify.com/admin/api/2024-01`);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, value.toString());
			}
		});

		const response = await fetch(url.toString(), {
			headers: this.getHeaders()
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		return response.json();
	}

	async createCart() {
		const response = await fetch(`https://${this.shopDomain}.myshopify.com/api/2024-01/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': this.accessToken
			},
			body: JSON.stringify({
				query: `
					mutation {
						cartCreate {
							cart {
								id
								checkoutUrl
								lines(first: 10) {
									edges {
										node {
											id
											quantity
											merchandise {
												... on ProductVariant {
													id
													title
											}
										}
									}
								}
								cost {
									totalAmount {
										amount
										currencyCode
									}
									subtotalAmount {
										amount
										currencyCode
									}
								}
							}
						}
					}
				`
			})
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data.cartCreate.cart;
	}

	async addToCart(cartId: string, merchandiseId: string, quantity: number = 1) {
		const response = await fetch(`https://${this.shopDomain}.myshopify.com/api/2024-01/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': this.accessToken
			},
			body: JSON.stringify({
				query: `
					mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
						cartLinesAdd(cartId: $cartId, lines: $lines) {
							cart {
								id
								lines(first: 10) {
									edges {
										node {
											id
											quantity
										}
									}
								}
								cost {
									totalAmount {
										amount
										currencyCode
									}
								}
							}
							userErrors {
								field
								message
							}
						}
					}
				`,
				variables: {
					cartId,
					lines: [{
						merchandiseId,
						quantity
					}]
				}
			})
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data.cartLinesAdd.cart;
	}

	async getOrders(params: { status?: string; limit?: number } = {}) {
		const url = new URL('/orders.json', `https://${this.shopDomain}.myshopify.com/admin/api/2024-01`);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, value.toString());
			}
		});

		const response = await fetch(url.toString(), {
			headers: this.getHeaders()
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		return response.json();
	}

	async createOrder(orderData: any) {
		return this.makeRequest('/orders.json', {
			method: 'POST',
			body: JSON.stringify({ order: orderData })
		});
	}

	async getStoreInfo() {
		const response = await fetch(`https://${this.shopDomain}.myshopify.com/admin/api/2024-01/shop.json`, {
			headers: this.getHeaders()
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		const data = await response.json();
		return {
			name: data.shop.name,
			url: `https://${this.shopDomain}.myshopify.com`,
			currency: data.shop.currency,
			platform: 'shopify'
		};
	}

	async searchProducts(query: string, limit: number = 10) {
		const response = await fetch(`https://${this.shopDomain}.myshopify.com/api/2024-01/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': this.accessToken
			},
			body: JSON.stringify({
				query: `
					query searchProducts($query: String!, $limit: Int!) {
						products(first: $limit, query: $query) {
							edges {
								node {
									id
									title
									handle
									description
									priceRangeV2 {
										minVariantPrice {
											amount
											currencyCode
										}
									}
									featuredImage {
										url
									}
								}
							}
						}
					}
				`,
				variables: { query, limit }
			})
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data.products;
	}
}
