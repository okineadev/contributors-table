import { describe, it, expect } from 'bun:test'
import { generateContributorsTableImage } from '../api/_utils'

const sampleContributors = [
	{
		login: 'user1',
		avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
	},
	{
		login: 'user2',
		avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
	},
]

const sampleImageParams = {
	gap: 10,
	width: 50,
	columns: 2,
	roundness: 5,
	borderWidth: 1,
	ssr: false,
	type: 'svg',
}

const sampleParams = {
	contributors: sampleContributors,
	...sampleImageParams,
}

describe('generateContributorsTableImage', () => {
	it('should generate SVG with correct dimensions and attributes', async () => {
		const result = await generateContributorsTableImage(sampleParams)
		expect(result).toMatchSnapshot()
	})

	it('should generate PNG buffer when type is png', async () => {
		const result = await generateContributorsTableImage({
			...sampleParams,
			type: 'png',
		})
		expect(result).toBeInstanceOf(Buffer)
	})

	it('should handle empty contributors array', async () => {
		const params = {
			contributors: [],
			...sampleImageParams,
		}

		const result = await generateContributorsTableImage(params)
		expect(result).toMatchSnapshot()
	})

	it('should apply full roundness when roundness is "yes"', async () => {
		const result = await generateContributorsTableImage({
			...sampleParams,
			roundness: 'yes',
		})
		expect(result).toContain('rx="50"')
	})
})
