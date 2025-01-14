import type { Endpoints } from '@octokit/types'

export type Contributor = Partial<
	Omit<
		Endpoints['GET /repos/{owner}/{repo}/contributors']['response']['data'][number],
		'avatar_url'
	> & {
		login: string
		avatar_url: string
	}
>
