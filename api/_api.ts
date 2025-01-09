import { Octokit } from '@octokit/core'
import { USER_AGENT } from '../config.js'

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
export async function getContributorsListFromGitHub(repo: string, max: number) {
	const octokit = new Octokit({ auth: process.env.GITHUB_APP_TOKEN })
	const [owner, repoName] = repo.split('/')
	const allContributors = []

	const queryParameters = {
		owner,
		repo: repoName,
		per_page: 100,
		headers: {
			'User-Agent': USER_AGENT,
		},
	}

	// First request to get total count
	const firstPage = await octokit.request(
		'GET /repos/{owner}/{repo}/contributors',
		{
			...queryParameters,
			page: 1,
		},
	)

	if (firstPage.data.length === 0) {
		return { data: [] }
	}

	allContributors.push(...firstPage.data)

	// Calculate required pages
	const remainingCount = max - firstPage.data.length
	const additionalPages = Math.ceil(remainingCount / 100)

	if (additionalPages > 0) {
		const pagePromises = Array.from({ length: additionalPages }, (_, i) =>
			octokit.request('GET /repos/{owner}/{repo}/contributors', {
				...queryParameters,
				page: i + 2,
			}),
		)

		const responses = await Promise.all(pagePromises)

		for (const response of responses) {
			if (response.data.length === 0) break
			allContributors.push(...response.data)
		}
	}

	// Trim to max length
	if (allContributors.length > max) {
		allContributors.length = max
	}

	return { data: allContributors }
}

/**
 * Fetches an image from the given URL and converts it to a base64-encoded string.
 *
 * @param url - The URL of the image to fetch.
 * @returns A promise that resolves to a base64-encoded string representation of the image.
 */
export async function getbase64Image(url: string) {
	const response = await fetch(url, {
		headers: {
			'User-Agent': USER_AGENT,
		},
	})
	const contentType = response.headers.get('content-type') || 'image/png'
	const buffer = await response.arrayBuffer()
	return `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`
}