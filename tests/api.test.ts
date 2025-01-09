import { describe, it, expect } from 'bun:test'
import { getbase64Image } from '../api/_api'

describe('getbase64Image', () => {
	it('should fetch an image and return a base64-encoded string', async () => {
		const url = `file://${__dirname}/images/stapler-cat.png`
		const base64String = await getbase64Image(url)
		expect(base64String).toMatch('data:image/png;base64,')
	})
})
