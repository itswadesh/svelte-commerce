import type { AxiosRequestConfig, AxiosError } from 'axios'
import { axiosInstance } from './axios'

export class ApiService {
	private handleError(error: AxiosError<any>) {
		if (!error.response && !navigator.onLine) {
			throw { message: 'Please check your internet connection and try again' }
		}

		if (!error.response) {
			throw { message: 'Unable to reach the server. Please try again in a moment' }
		}

		const err = (error?.response?.data?.error?.issues && error?.response?.data?.error?.issues[0]) || error?.response?.data || error

		if (err.status === 401) {
			throw { message: 'Session expired. Please login again' }
		}
		throw { message: err.message || err.error || 'Something went wrong. Please try again' }
	}

	static async get<T>(url: string, config?: AxiosRequestConfig) {
		const api = axiosInstance
		try {
			const { data } = await api.get<T>(url, config)

			// Return the full response object because ProductService is expecting the full response object with response.data.products
			return data
		} catch (e: unknown) {
			throw new ApiService().handleError(e as AxiosError<any>)
		}
	}

	static async post<T>(url: string, payload: unknown, config?: AxiosRequestConfig) {
		const api = axiosInstance
		try {
			const { data } = await api.post<T>(url, payload, config)
			return data
		} catch (e: unknown) {
			throw new ApiService().handleError(e as AxiosError<any>)
		}
	}

	static async put<T>(url: string, payload: unknown, config?: AxiosRequestConfig) {
		const api = axiosInstance
		try {
			const { data } = await api.put<T>(url, payload, config)
			return data
		} catch (e: unknown) {
			throw new ApiService().handleError(e as AxiosError<any>)
		}
	}

	static async delete<T>(url: string, config?: AxiosRequestConfig) {
		const api = axiosInstance
		try {
			const { data } = await api.delete<T>(url, config)
			return data
		} catch (e: unknown) {
			throw new ApiService().handleError(e as AxiosError<any>)
		}
	}

	static async patch<T>(url: string, payload: unknown, config?: AxiosRequestConfig) {
		const api = axiosInstance
		try {
			const { data } = await api.patch<T>(url, payload, config)
			return data
		} catch (e: unknown) {
			throw new ApiService().handleError(e as AxiosError<any>)
		}
	}
}

