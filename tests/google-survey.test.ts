import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/svelte'

const loadSurvey = vi.fn()
const showSurvey = vi.fn()
vi.mock('$lib/google-reviews', () => ({ loadSurvey, showSurvey }))

const { default: GoogleSurvey } = await import('$lib/components/google/google-survey.svelte')

const survey = {
	merchant_id: 1234567,
	order_id: 'GC-000049',
	email: 'a@example.com',
	delivery_country: 'IN',
	estimated_delivery_date: '2026-11-04'
}

beforeEach(() => {
	vi.useFakeTimers()
	loadSurvey.mockReset()
	showSurvey.mockReset()
})
afterEach(() => vi.useRealTimers())

describe("the confirmation page's Google Customer Reviews offer", () => {
	it('asks the engine once, after the page, and shows what it answers', async () => {
		loadSurvey.mockResolvedValue(survey)
		render(GoogleSurvey, { active: true, orderNo: 'GC-000049' })
		expect(loadSurvey).not.toHaveBeenCalled()
		await vi.runAllTimersAsync()
		expect(loadSurvey).toHaveBeenCalledTimes(1)
		expect(loadSurvey).toHaveBeenCalledWith('GC-000049')
		expect(showSurvey).toHaveBeenCalledWith(survey)
	})

	it('offers nothing when the engine has no survey for the order, after asking twice more', async () => {
		loadSurvey.mockResolvedValue(null)
		render(GoogleSurvey, { active: true, orderNo: 'GC-000049' })
		await vi.runAllTimersAsync()
		expect(loadSurvey).toHaveBeenCalledTimes(3)
		expect(showSurvey).not.toHaveBeenCalled()
	})

	it('offers the survey once a payment confirmed after the page opened', async () => {
		loadSurvey.mockResolvedValueOnce(null).mockResolvedValueOnce(survey)
		render(GoogleSurvey, { active: true, orderNo: 'GC-000049' })
		await vi.runAllTimersAsync()
		expect(loadSurvey).toHaveBeenCalledTimes(2)
		expect(showSurvey).toHaveBeenCalledWith(survey)
	})

	it('asks nothing while the survey is off or before the order is known', async () => {
		render(GoogleSurvey, { active: false, orderNo: 'GC-000049' })
		render(GoogleSurvey, { active: true, orderNo: '' })
		await vi.runAllTimersAsync()
		expect(loadSurvey).not.toHaveBeenCalled()
	})
})
