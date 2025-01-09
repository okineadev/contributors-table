import sharp from 'sharp'
import { optimize } from 'svgo'
import { SVGOConfig } from '../config.js'
import { getbase64Image } from './_api.js'

/**
 * Converts an SVG string to a PNG buffer.
 *
 * @param SVG - The SVG string to be converted.
 * @returns A promise that resolves to a buffer containing the PNG image.
 */
async function generatePNGFromSVG(SVG: string) {
	const svgBuffer = Buffer.from(SVG)
	const pngBuffer = await sharp(svgBuffer).png().toBuffer()

	return pngBuffer
}

/**
 * Generates an SVG containing table with contributor avatars with links to their GitHub profiles
 *
 * @param params - Array of contributor objects containing `login` and `avatar_url`
 * @param gap - Horizontal spacing between avatars in pixels
 * @param width - Width and height of each avatar in pixels
 * @param columns - Number of avatars per row
 * @param roundness - Border radius of avatars in pixels or `'yes'` for full roundness (width value)
 * @param borderWidth - Width of the border around avatars in pixels
 * @param ssr - Whether to use server-side rendering to fetch and embed avatars in the SVG
 * @param type - Output image type (`'svg'` or `'png'`)
 *
 * @returns Promise resolving to SVG markup string
 */
export async function generateContributorsTableImage(params: {
	contributors: { login: string; avatar_url: string }[]
	gap?: number
	width?: number
	columns?: number
	roundness?: number | string
	borderWidth?: number
	ssr?: boolean
	type?: string
}) {
	const adjustedRoundness =
		typeof params.roundness === 'string' && params.roundness === 'yes'
			? params.width
			: params.roundness

	const rows = Math.ceil(params.contributors.length / params.columns)

	// Remove gap from total width and height calculations
	let SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${params.columns * params.width + (params.columns - 1) * params.gap}" height="${rows * params.width + (rows - 1) * params.gap}">`

	const svgStyle = `
	<style>
		a {
			cursor: pointer;
		}
		a > svg {
			overflow: visible;
		}
		a > svg > rect {
			stroke: #c0c0c0;
			stroke-width: ${params.borderWidth ? `${params.borderWidth}px` : 0};
			width: ${params.width}px;
			height: ${params.width}px;
		}
	</style>
	`

	SVG += svgStyle

	// Parallel avatar loading
	const avatarPromises = params.contributors.map(async (contributor) => {
		return params.ssr || params.type === 'png'
			? await getbase64Image(`${contributor.avatar_url}&s=${params.width}`)
			: `${contributor.avatar_url}&amp;s=${params.width}`
	})

	const avatarUrls = await Promise.all(avatarPromises)

	params.contributors.forEach((contributor, index) => {
		const username = contributor.login
		const avatarUrl = avatarUrls[index]

		SVG += `
		<a href="https://github.com/${username}">
		  <svg x="${(index % params.columns) * (params.width + params.gap) + params.borderWidth}" y="${Math.floor(index / params.columns) * (params.width + params.gap) + params.borderWidth}">
			<title>${username}</title>
			<rect rx="${adjustedRoundness}" fill="url(#i${index})"></rect>

			<defs>
			  <pattern id="i${index}" patternUnits="userSpaceOnUse" width="${params.width}" height="${params.width}">
				<image href="${avatarUrl}" width="${params.width}" height="${params.width}"></image>
			  </pattern>
			</defs>
		  </svg>
		</a>`
	})

	SVG += '</svg>'

	if (params.type === 'png') {
		return await generatePNGFromSVG(SVG)
	}

	return optimize(SVG, SVGOConfig).data
}
