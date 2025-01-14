import { Octokit } from '@octokit/rest'
import type { Endpoints } from '@octokit/types'
import { USER_AGENT } from '../config.js'
import type { Contributor } from './_types.js'

/**
 * Fetches the list of contributors from a GitHub repository.
 *
 * @param repo - The repository path in the format "owner/repo"
 * @param max - Maximum number of contributors to fetch (default: `100`)
 * @returns A promise that resolves to the GitHub API response containing contributors list
 * @throws Will throw an error if the GitHub API request fails
 * @example
 * ```ts
 * const contributors = await getContributorsListFromGitHub('octocat/Hello-World', 5);
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
	max = 100,
): Promise<Partial<Contributor[]>> {
	const octokit = new Octokit({
		auth: process.env.GITHUB_APP_TOKEN,
		userAgent: USER_AGENT,
	})
	const [owner, repoName] = repo.split('/')
	const allContributors: Contributor[] = []
	const perPage = 100

	let needToDownload = max

	let downloaded = 0

	for await (const { data: contributors } of octokit.paginate.iterator(
		octokit.repos.listContributors,
		{
			owner: owner,
			repo: repoName,
			per_page: Math.min(needToDownload, perPage),
		},
	)) {
		allContributors.push(...contributors)
		needToDownload -= contributors.length
		downloaded += contributors.length

		if (downloaded >= needToDownload) {
			break
		}
		console.log(contributors.length)
	}

	console.log(`Downloaded ${downloaded} contributors.`)

	return allContributors
}
