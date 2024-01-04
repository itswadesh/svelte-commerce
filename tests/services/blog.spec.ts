import { test, expect } from '@playwright/test'
import { storeId, API_URL } from './config'

test('Test: fetch all blogs', async ({ request }) => {
	const blogs = await request.get(`${API_URL}blogs?store=${storeId}`)

	expect(blogs.status()).toBe(200)
})

test('Test: fetch all latest blogs', async ({ request }) => {
	const blogs = await request.get(`${API_URL}blogs?sort=-updatedAt&limit=10&store=${storeId}`)

	expect(blogs.status()).toBe(200)
})

test('Test: fetch single post from blogs', async ({ request }) => {
	const blogId = '63c44f967ddc9e60e126c3e6'

	const blogbyId = await request.get(`${API_URL}blogs/${blogId}?store=${storeId}`)

	expect(blogbyId.status()).toBe(200)
})
