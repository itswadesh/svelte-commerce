import { env } from '$env/dynamic/public'
const token = env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY

export class StoreService {
	static async getStore(id: string) {
		return { id }
	}

	static async fetchExpensiveStoreData({ request }: any) {
		request.headers.set('x-publishable-api-key', token)
		return { token }
	}
}
