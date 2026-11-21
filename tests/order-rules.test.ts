import { describe, expect, it } from 'vitest'
import { checkoutQuestions, orderBlock, unanswered } from '../src/lib/order/rules'

describe('orderBlock (GoCommerce D271)', () => {
	it('blocks nothing while the plugins are off or missing', () => {
		expect(orderBlock(undefined, 10)).toBeNull()
		expect(orderBlock({ ordersPaused: { active: false }, minimumOrder: { active: false } }, 10)).toBeNull()
	})

	it('names how much more a bag under the minimum needs, and nothing once it reaches it', () => {
		const plugins = { minimumOrder: { active: true, amount: 200 } }
		expect(orderBlock(plugins, 150.5)).toEqual({ minimum: 200, short: 49.5 })
		expect(orderBlock(plugins, 200)).toBeNull()
	})

	it('puts the pause before the minimum', () => {
		const plugins = { ordersPaused: { active: true, message: 'Closed for Diwali' }, minimumOrder: { active: true, amount: 200 } }
		expect(orderBlock(plugins, 0)).toEqual({ paused: 'Closed for Diwali' })
	})
})

describe('checkout questions', () => {
	it('are asked only while the plugin is on, and a required one must have words in it', () => {
		const questions = [
			{ text: 'Gift message', required: false },
			{ text: 'Delivery date', required: true }
		]
		expect(checkoutQuestions({ checkoutQuestions: { active: false, questions } })).toEqual([])
		expect(checkoutQuestions({ checkoutQuestions: { active: true, questions } })).toEqual(questions)
		expect(unanswered(questions, { 'Delivery date': '  ' })?.text).toBe('Delivery date')
		expect(unanswered(questions, { 'Delivery date': 'Friday' })).toBeUndefined()
	})
})
