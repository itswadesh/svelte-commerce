import { env } from '$env/dynamic/public'
import axios from 'axios'

export const axiosInstance = axios.create({
	baseURL: env.PUBLIC_MEDUSA_API_URL,
	timeout: 15000,
	headers: { 'Content-Type': 'application/json' }
})

axiosInstance.interceptors.request.use((config) => {
	const token = env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY
	if (!config.headers['x-publishable-api-key'] && token) {
		config.headers['x-publishable-api-key'] = token
	}
	return config
})

// Error handler interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error)
	}
)

// Initialize with optional overrides
export const initializeAxios = ({ token, baseURL }: { token?: string; baseURL?: string } = {}) => {
	// Validate token
	if (!token && !env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
		console.error('Medusa publishable API Key is not defined')
		throw new Error('server-axios: Medusa publishable API Key must be provided')
	}

	// Override baseURL if provided
	if (baseURL) {
		axiosInstance.defaults.baseURL = baseURL
	} else if (!axiosInstance.defaults.baseURL && !env.PUBLIC_MEDUSA_API_URL) {
		throw new Error('server-axios: Medusa endpoint URL must be provided')
	}

	return axiosInstance
}

export const getAxiosInstance = () => {
	if (!axiosInstance) {
		throw new Error('server-axios: Axios instance not initialized')
	}
	return axiosInstance
}

