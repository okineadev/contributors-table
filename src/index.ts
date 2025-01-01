import { Elysia, t } from 'elysia'
// import { compression } from '@chneau/elysia-compression'
import { elysiaXSS } from 'elysia-xss'
import {
	generateContributorsTableImage,
	getContributorsListFromGitHub,
} from './utils'

new Elysia()
	.use(elysiaXSS({}))
	// .use(compression())
	.get(
		'/',
		async ({ set, query }) => {
			/* GitHub Repo */
			const repo = query.repo
			const contributors = (
				await getContributorsListFromGitHub(
					repo,
					query.max || 100,
					// query.anon ?? false,
				)
			).data
			console.log(contributors.length)

			set.headers['Content-Type'] =
				query.type === 'png' ? 'image/png' : 'image/svg+xml'
			set.headers['Cache-Control'] = 'public, max-age=3600'
			// set.headers['X-Recruiting'] =
			// 	'Looking for awesome unpaid open-source job? Join us! -> https://github.com/ZGalera/invite/issues/new?labels=join-request&projects=&template=join-organization.yml&title=Request+to+Join%3A+%5BYour+Name%5D'
			return generateContributorsTableImage({
				// @ts-ignore
				contributors: contributors,
				gap: Number.parseInt(query.gap) || 6,
				width: Number.parseInt(query.width) || 48,
				columns: query.columns ?? 12,
				roundness: query.roundness ?? 10,
				borderWidth: Number.parseInt(query.borderWidth) || 1.5,
				ssr: query.ssr ?? false,
				type: query.type ?? 'svg',
			})
		},
		{
			query: t.Object({
				repo: t.String(),
				gap: t.Optional(t.Numeric()),
				width: t.Optional(t.Numeric()),
				columns: t.Optional(t.Numeric()),
				roundness: t.Optional(t.Union([t.Literal('yes'), t.Numeric()])),
				borderWidth: t.Optional(t.Numeric()),
				max: t.Optional(t.Numeric()),
				ssr: t.Optional(t.Boolean()),
				type: t.Optional(t.Union([t.Literal('svg'), t.Literal('png')])),
				// anon: t.Optional(t.Boolean()),
			}),
		},
	)
	.listen(3000)

console.log('🦊 App running')
