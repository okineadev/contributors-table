import type { Endpoints } from '@octokit/types'

export type Contributor = Omit<
	Endpoints['GET /repos/{owner}/{repo}/contributors']['response']['data'][number],
	'login' | 'url' | 'type' | 'contributions'
> & {
	login: string
	avatar_url: string
}
