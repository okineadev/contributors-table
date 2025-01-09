import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getContributorsListFromGitHub } from './_api.js'
import { generateContributorsTableImage } from './_utils.js'

export default async (
	req: VercelRequest,
	res: VercelResponse,
): Promise<VercelResponse> => {
	const { repo, max, gap, width, columns, roundness, borderWidth, ssr, type } =
		req.query

	if (!repo) {
		return res.status(400).json({ error: '`repo` parameter is required' })
	}

	const startTime = performance.now()

	const contributors = (
		await getContributorsListFromGitHub(repo as string, Number(max))
	).data

	res.setHeader('Content-Type', type === 'png' ? 'image/png' : 'image/svg+xml')

	const image = await generateContributorsTableImage({
		contributors: contributors,
		gap: gap ? Number(gap) : undefined,
		width: width ? Number(width) : undefined,
		columns: columns ? Number(columns) : undefined,
		roundness: roundness === 'yes' ? Number(width) : Number(roundness) || 6,
		borderWidth: borderWidth ? Number(borderWidth) : undefined,
		ssr: ssr !== 'false',
		// @ts-ignore
		type: type,
	})

	const endTime = performance.now()
	console.log(`${req.url} Execution time: ${(endTime - startTime) / 1000}s`)

	return res.status(200).send(image)
}
