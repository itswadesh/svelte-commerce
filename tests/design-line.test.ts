import { describe, expect, it } from 'vitest'
import { linePicture } from '$lib/customizer/line'

describe('a basket line’s picture', () => {
	it('is the shopper’s design where the line was made to one', () => {
		expect(linePicture({ title: 'Soft case', thumbnail: '/p.png', designPreview: '/backend/media/d.png' })).toEqual({
			src: '/backend/media/d.png',
			alt: 'Your design on Soft case',
			designed: true
		})
		expect(linePicture({ title: 'Soft case', thumbnail: '/p.png', designPreview: null })).toEqual({
			src: '/p.png',
			alt: 'Soft case',
			designed: false
		})
		expect(linePicture({ title: 'Name ring', isCustomized: true, customizedImg: '/c.png', thumbnail: '/p.png' })).toEqual({
			src: '/c.png',
			alt: 'Your design on Name ring',
			designed: true
		})
	})
})
