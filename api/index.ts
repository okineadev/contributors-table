import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getContributorsListFromGitHub } from './_api.js'
import { generateContributorsTableImage } from './_utils.js'

export default async (
	req: VercelRequest,
	res: VercelResponse,
): Promise<VercelResponse> => {
	const {
		repo,
		max = 100,
		gap = 6,
		width = 40,
		columns = 21,
		roundness = 5,
		borderWidth = 0,
		ssr = 'true',
		type = 'svg',
	} = req.query

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
		gap: Number(gap),
		width: Number(width),
		columns: Number(columns),
		roundness: roundness === 'yes' ? Number(width) : Number(roundness) || 10,
		borderWidth: Number(borderWidth),
		ssr: ssr === 'true',
		// @ts-ignore
		type: type,
	})

	const endTime = performance.now()
	console.log(`${req.url} Execution time: ${(endTime - startTime) / 1000}s`)

	return res.status(200).send(image)
}
