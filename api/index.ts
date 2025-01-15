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
		rows,
		roundness,
		strokeWidth = req.query?.borderWidth,
		ssr,
		format = req.query?.type ?? 'svg',
	} = req.query

	if (!repo) {
		return res.status(400).json({ error: '`repo` parameter is required' })
	}

	// sorry pretty bad code but fell free to refactor

	const columnsNumber = columns ? Number(columns) : 21
	const rowsNumber = rows ? Number(rows) : 7

	const avatarsCount = columnsNumber * rowsNumber

	const contributorsPromise = getContributorsListFromGitHub(
		repo as string,
		Math.min(max ? Number(max) : avatarsCount, avatarsCount),
	)

	waitUntil(contributorsPromise)

	const contributors = await contributorsPromise

	const imagePromise = generateContributorsTable(contributors, {
		gap: gap ? Number(gap) : undefined,
		width: width ? Number(width) : undefined,
		columns: columnsNumber,
		rows: rowsNumber,
		roundness: roundness === 'yes' ? Number(width) : Number(roundness) || 6,
		strokeWidth: strokeWidth ? Number(strokeWidth) : undefined,
		ssr: ssr !== 'false',
		format: format as 'png' | 'svg',
	})

	waitUntil(imagePromise)

	const image = await imagePromise

	res.setHeader(
		'Content-Type',
		format === 'png' ? 'image/png' : 'image/svg+xml',
	)

	return res.status(200).send(image)
}
