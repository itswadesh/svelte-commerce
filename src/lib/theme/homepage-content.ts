import { defaultContent } from './default/homepage-content.js'
import { sarabContent } from './sarab/homepage-content.js'
import { organicContent } from './organic/homepage-content.js'
import { limelightContent } from './limelight/homepage-content.js'
import { noorContent } from './noor/homepage-content.js'
import type { ThemeHomepageContent } from './types.js'
const CONTENT_BY_THEME: Record<string, ThemeHomepageContent> = {
	default: defaultContent,
	sarab: sarabContent,
	organic: organicContent,
	limelight: limelightContent,
	noor: noorContent
}
export type { ThemeHomepageContent } from './types.js'
export function getThemeHomepageContent(themeName = 'default') {
	return CONTENT_BY_THEME[themeName] || defaultContent
}