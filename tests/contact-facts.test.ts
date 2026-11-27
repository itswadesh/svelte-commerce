import { describe, expect, it } from 'vitest'
import {
	addressLines,
	contactPageSchema,
	hoursRows,
	inIndia,
	mapFor,
	parseMapLocation,
	phoneLink,
	twelveHour,
	whatsappLink
} from '../src/lib/components/contact/contact-facts'

// Made-up shop; nothing here is a real business.
const address = { street: '12 Market Road, Unit 4', city: 'Pune', state: 'Maharashtra', pincode: '411001', country: 'IN' }

describe('inIndia', () => {
	it('is the store saying it is in India, and nothing guessed', () => {
		expect(inIndia('IN')).toBe(true)
		expect(inIndia('in')).toBe(true)
		expect(inIndia('GB')).toBe(false)
		expect(inIndia('')).toBe(false)
		expect(inIndia(undefined)).toBe(false)
	})
})

describe('phoneLink', () => {
	it('writes an Indian mobile as +91 98765 43210 and dials it in E.164', () => {
		expect(phoneLink('9800000000', true)).toEqual({ label: '+91 98000 00000', href: 'tel:+919800000000' })
		expect(phoneLink('098000 00000', true)).toEqual({ label: '+91 98000 00000', href: 'tel:+919800000000' })
		expect(phoneLink('+91 98000 00000', true)).toEqual({ label: '+91 98000 00000', href: 'tel:+919800000000' })
	})
	it('keeps a landline as typed, dialled with the country code', () => {
		expect(phoneLink('020 2612 3456', true)).toEqual({ label: '020 2612 3456', href: 'tel:+912026123456' })
	})
	it('never guesses a country for a number without one', () => {
		expect(phoneLink('020 7946 0000', false)).toEqual({ label: '020 7946 0000', href: 'tel:02079460000' })
		expect(phoneLink('+44 20 7946 0000', false)).toEqual({ label: '+44 20 7946 0000', href: 'tel:+442079460000' })
	})
	it('draws nothing for nothing', () => {
		expect(phoneLink('', true)).toBeNull()
		expect(phoneLink(null, true)).toBeNull()
		expect(phoneLink('n/a', true)).toBeNull()
	})
})

describe('whatsappLink', () => {
	it('links wa.me with the country code and the store’s own opening line', () => {
		expect(whatsappLink('919800000000', true, 'Hi, a question')).toEqual({
			label: '+91 98000 00000',
			href: 'https://wa.me/919800000000?text=Hi%2C%20a%20question'
		})
		expect(whatsappLink('9800000000', true)?.href).toBe('https://wa.me/919800000000')
	})
	it('reads digits as international, as the plugin asks them to be typed, even on an Indian store', () => {
		expect(whatsappLink('447911123456', false)?.href).toBe('https://wa.me/447911123456')
		expect(whatsappLink('447911123456', true)?.href).toBe('https://wa.me/447911123456')
	})
	it('draws nothing without a number', () => {
		expect(whatsappLink('', true)).toBeNull()
	})
})

describe('addressLines', () => {
	it('is the envelope, with the country named', () => {
		expect(addressLines(address)).toEqual(['12 Market Road, Unit 4', 'Pune, Maharashtra 411001', 'India'])
	})
	it('skips empty parts, and a country alone is no address', () => {
		expect(addressLines({ city: 'Pune', country: 'IN' })).toEqual(['Pune', 'India'])
		expect(addressLines({ country: 'IN' })).toEqual([])
		expect(addressLines(null)).toEqual([])
	})
})

describe('parseMapLocation', () => {
	it('reads typed lat,lng, with or without spaces', () => {
		expect(parseMapLocation('19.0760,72.8777')).toEqual({ lat: 19.076, lng: 72.8777 })
		expect(parseMapLocation(' -33.86 , 151.21 ')).toEqual({ lat: -33.86, lng: 151.21 })
	})
	it('reads the pin out of a Google place link and an embed link', () => {
		expect(parseMapLocation('https://www.google.com/maps/place/Shop/@18.5,73.8,17z/data=!3d18.5204!4d73.8567')).toEqual({
			lat: 18.5204,
			lng: 73.8567
		})
		expect(parseMapLocation('https://www.google.com/maps/embed?pb=!1m18!2d73.8567!3d18.5204!2m3')).toEqual({ lat: 18.5204, lng: 73.8567 })
	})
	it('ignores anything that is not a point on the globe', () => {
		for (const bad of [
			'',
			null,
			undefined,
			'the shop by the river',
			'19.07',
			'19.07,72.88,3',
			'abc,def',
			'91,10',
			'10,181',
			'https://maps.app.goo.gl/AbCdEf'
		]) {
			expect(parseMapLocation(bad)).toBeNull()
		}
	})
})

describe('mapFor', () => {
	it('frames a pin on OpenStreetMap and opens it in Google Maps', () => {
		const map = mapFor('19.0760,72.8777')
		expect(new URL(map!.embed!).origin).toBe('https://www.openstreetmap.org')
		expect(map!.embed).toContain('marker=19.076,72.8777')
		expect(map!.open).toBe('https://www.google.com/maps/search/?api=1&query=19.076,72.8777')
	})
	it('opens a share link as it is, but draws nothing', () => {
		expect(mapFor('https://maps.app.goo.gl/AbCdEf')).toEqual({ embed: null, open: 'https://maps.app.goo.gl/AbCdEf' })
	})
	it('is nothing for no location, plain words or a link off Google', () => {
		for (const bad of ['', null, 'near the bus stand', 'https://evil.example/maps', 'http://maps.app.goo.gl/x']) expect(mapFor(bad)).toBeNull()
	})
})

describe('hoursRows', () => {
	it('runs days with the same hours together, on the 12-hour clock, and names the closed ones', () => {
		const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => ({ day, opens: '10:00', closes: '19:30' }))
		expect(hoursRows(week)).toEqual([
			{ days: 'Monday to Saturday', time: '10 AM – 7:30 PM' },
			{ days: 'Sunday', time: 'Closed' }
		])
	})
	it('shows nothing when the store gave no hours', () => {
		expect(hoursRows([])).toEqual([])
		expect(hoursRows(undefined)).toEqual([])
	})
	it('reads noon and midnight the way a clock does', () => {
		expect(twelveHour('00:00')).toBe('12 AM')
		expect(twelveHour('12:00')).toBe('12 PM')
		expect(twelveHour('09:05')).toBe('9:05 AM')
	})
})

describe('contactPageSchema', () => {
	it('asserts the address and hours the store published', () => {
		const schema = contactPageSchema({
			url: 'https://shop.example/contact-us',
			origin: 'https://shop.example',
			name: 'Example Shop',
			phone: '+91 98000 00000',
			email: 'hello@shop.example',
			address,
			hours: [{ day: 'mon', opens: '10:00', closes: '19:00' }]
		})
		expect(schema['@type']).toBe('ContactPage')
		expect(schema.about).toMatchObject({
			'@type': 'Organization',
			address: { '@type': 'PostalAddress', streetAddress: '12 Market Road, Unit 4', postalCode: '411001', addressCountry: 'IN' },
			contactPoint: {
				telephone: '+91 98000 00000',
				hoursAvailable: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/Monday', opens: '10:00', closes: '19:00' }]
			}
		})
	})
	it('asserts the pin as the place the store is', () => {
		const schema = contactPageSchema({ url: 'https://shop.example/contact-us', origin: 'https://shop.example', geo: { lat: 19.076, lng: 72.8777 } })
		expect(schema.about).toMatchObject({ location: { '@type': 'Place', geo: { '@type': 'GeoCoordinates', latitude: 19.076, longitude: 72.8777 } } })
	})
	it('asserts nothing the store did not publish', () => {
		const schema = contactPageSchema({ url: 'https://shop.example/contact-us', origin: 'https://shop.example' })
		expect(schema.about).toEqual({ '@type': 'Organization', '@id': 'https://shop.example/#organization', url: 'https://shop.example' })
	})
})
