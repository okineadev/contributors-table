import type { VercelRequest, VercelResponse } from '@vercel/node'
import { waitUntil } from '@vercel/functions'

import { getContributorsListFromGitHub } from './_api.js'
import { generateContributorsTable } from 'contributors-table'

export default async (
	req: VercelRequest,
	res: VercelResponse,
): Promise<VercelResponse> => {
	const {
		repo,
		max,
		gap,
		width,
		columns,
		roundness,
		strokeWidth = req.query?.borderWidth,
		ssr,
		format = req.query?.type ?? 'svg',
	} = req.query

	if (!repo) {
		return res.status(400).json({ error: '`repo` parameter is required' })
	}

	const contributorsPromise = getContributorsListFromGitHub(
		repo as string,
		Number(max),
	)

	waitUntil(contributorsPromise)

	const contributors = await contributorsPromise

	const imagePromise = generateContributorsTable(contributors, {
		gap: gap ? Number(gap) : undefined,
		width: width ? Number(width) : undefined,
		columns: columns ? Number(columns) : undefined,
		roundness: roundness === 'yes' ? Number(width) : Number(roundness) || 6,
		strokeWidth: strokeWidth ? Number(strokeWidth) : undefined,
		ssr: ssr !== 'false',
		format: format as string,
	})

	waitUntil(imagePromise)

	const image = await imagePromise

	res.setHeader(
		'Content-Type',
		format === 'png' ? 'image/png' : 'image/svg+xml',
	)

	return res.status(200).send(image)
}
