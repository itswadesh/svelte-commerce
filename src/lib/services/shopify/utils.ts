import { shopifyInit } from '$lib/utils'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { description } from 'lib/config'
import Client from 'shopify-buy';

export class Shopify {
	// return store from shopify payload
	public async initStore() {
		const payload = {
			query: {
				shop: {
					id: true,
					name: true,
					description: true,
					brand: {
						shortDescription: true,
						slogan: true,
						logo: {
							id: true,
							image: {
								src: true
							}
						}
					}
				}
			}
		}

		const query = jsonToGraphQLQuery(payload, { pretty: true })

		try {
			const response = await shopifyInit({
				query: query,
				variables: {}
			})

			return {
				storeOne: {
					_id: response?.shop?.id,
					title: response?.shop?.name,
					description: response?.data?.description,
					websiteName: response?.shop?.name
				}
			}
		} catch (error) {
			console.log('error======', error)
		}
	}


	// init client using shopify sdk
	public async initClient(){
		let client: any = {};
		return client = await Client.buildClient({
			domain: import.meta.env.VITE_SHOPIFY_API_ENDPOINT,
			storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN
		  });
	}

	public async fetchMegamenuData() {
		const payload = {
			query: {
				collections: {
					__args: {
						first: 10
					},
					edges: {
						node: {
							id: true,
							title: true,
							handle: true,
							updatedAt: true
						}
					}
				}
			}
		};
	
		const query = jsonToGraphQLQuery(payload, { pretty: true });
	
		try {
			const response = await shopifyInit({
				query: query,
				variables: {}
			});
	
			const megamenuArr = response?.collections?.edges?.map((el: any) => ({
				name: el.node.title,
				slug: el.node.handle
			})) || [];
	
			return megamenuArr;
	
		} catch (error) {
			console.error("Error fetching megamenu data:", error);
			return [];
		}
	}


	public async addTocart(){
	
		const checkout  =  this.initClient().checkout.create().then((checkout) => {
			// Do something with the checkout
			console.log("checkout========", checkout);
		  });

		  console.log("checkout", checkout);
		  
		return checkout;

	}
	
}
