import { Octokit } from '@octokit/core'
import * as dotenv from 'dotenv'
import sharp from 'sharp'

dotenv.config()

/**
 * Fetches the list of contributors from a GitHub repository.
 *
 * @param repo - The repository path in the format "owner/repo"
 * @param max - Maximum number of contributors to fetch (default: `100`)
 * @returns A promise that resolves to the GitHub API response containing contributors data
 * @throws Will throw an error if the GitHub API request fails
 * @example
 * ```ts
 * const contributors = (await getContributorsListFromGitHub('octocat/Hello-World')).data;
 * /*
 * [
 *   {
 *     login: 'octocat',
 *     id: 123456,
 *     ...
 *   },
 *  ...
 * ]
 * ```
 */
export async function getContributorsListFromGitHub(
	repo: string,
	max: number,
	// anon: boolean,
) {
	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	})
	const [owner, repoName] = repo.split('/')
	const allContributors = []

	const queryParameters = {
		owner,
		repo: repoName,
		per_page: 100, // Fixed to GitHub's maximum per_page limit
		// anon: String(anon),
		headers: {
			'User-Agent': 'Contributors Table App by @okineadev (unpublished)',
		},
	}

	let page = 1

	while (allContributors.length < max) {
		const response = await octokit.request(
			'GET /repos/{owner}/{repo}/contributors',
			{
				...queryParameters,
				page: page,
			},
		)

		if (response.data.length === 0) break

		allContributors.push(...response.data)

		if (allContributors.length >= max) {
			allContributors.length = max // Trim excess contributors
			break
		}

		page++
	}

	return { data: allContributors }
}

// /**
//  * Fetches an image from the given URL and converts it to a base64-encoded string.
//  *
//  * @param url - The URL of the image to fetch.
//  * @returns A promise that resolves to a base64-encoded string representation of the image.
//  */
// async function getbase64Image(url: string) {
// 	const response = await fetch(url)
// 	const buffer = await response.arrayBuffer()
// 	return Buffer.from(buffer).toString('base64')
// }

/**
 * Converts an SVG string to a PNG buffer.
 *
 * @param SVG - The SVG string to be converted.
 * @returns A promise that resolves to a buffer containing the PNG image.
 */
async function generatePNGFromSVG(SVG: string) {
	const svgBuffer = Buffer.from(SVG)
	const pngBuffer = await sharp(svgBuffer, { density: 300 }).png().toBuffer()

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
 *
 * @example
 * ```typescript
 * const contributors = [
 *   { login: "user1", avatar_url: "https://github.com/user1.png" },
 *   { login: "user2", avatar_url: "https://github.com/user2.png" }
 * ];
 * const svg = await generateSVG(contributors);
 * ```
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

	let SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${params.columns * (params.width + params.gap)}" height="${rows * (params.width + params.gap)}">`

	// Add styles to SVG
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
			stroke-width: ${params.borderWidth}px;
			width: ${params.width}px;
			height: ${params.width}px;
		}
	</style>
	`

	SVG += svgStyle

	// @ts-ignore
	for (const [index, contributor] of params.contributors.entries()) {
		const username = contributor.login

		const avatarUrl =
			params.ssr || params.type === 'png'
				? await fetch(`${contributor.avatar_url}&s=${params.width}`).then(
						async (response) => {
							const contentType =
								response.headers.get('content-type') || 'image/png'
							const buffer = await response.arrayBuffer()
							return `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`
						},
					)
				: `${contributor.avatar_url}&amp;s=${params.width}`

		SVG += `
		<a href="https://github.com/${username}">
		  <svg x="${(index % params.columns) * (params.width + params.gap) + params.borderWidth}" y="${Math.floor(index / params.columns) * (params.width + params.gap) + params.borderWidth}">
			<title>${username}</title>
			<rect rx="${adjustedRoundness}" fill="url(#img${index})"></rect>

			<defs>
			  <pattern id="img${index}" patternUnits="userSpaceOnUse" width="${params.width}" height="${params.width}">
				<image href="${avatarUrl}" width="${params.width}" height="${params.width}"></image>
			  </pattern>
			</defs>
		  </svg>
		</a>`
	}

	SVG += '</svg>'

	SVG = SVG.replace(/\s+/g, ' ').trim()

	if (params.type === 'png') {
		return await generatePNGFromSVG(SVG)
	}
	return SVG
}
