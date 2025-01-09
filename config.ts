import type { Config } from 'svgo'

// Global configuration

/** SVGO configuration for SVG compression */
export const SVGOConfig: Config = {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					removeUnknownsAndDefaults: false,
					removeTitle: false,
				},
			},
		},
	],
}

/**
 * Application authentication that is presented
 * with each request to the GitHub API
 */
// TODO: Find out if it is necessary
export const USER_AGENT = 'Contributors Table App by @okineadev (unpublished)'
