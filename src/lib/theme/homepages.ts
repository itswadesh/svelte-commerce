import type { Component } from 'svelte'
import DefaultHomepage from './default/DefaultHomepage.svelte'
import SarabHomepage from './sarab/SarabHomepage.svelte'
import OrganicHomepage from './organic/OrganicHomepage.svelte'
import LimelightHomepage from './limelight/LimelightHomepage.svelte'
import NoorHomepage from './noor/NoorHomepage.svelte'

export const themeHomepages: Record<string, Component> = {
	default: DefaultHomepage,
	sarab: SarabHomepage,
	organic: OrganicHomepage,
	limelight: LimelightHomepage,
	noor: NoorHomepage
}
