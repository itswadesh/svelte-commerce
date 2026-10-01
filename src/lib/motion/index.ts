import { cubicIn, cubicOut } from 'svelte/easing'
import type { EasingFunction, TransitionConfig } from 'svelte/transition'

// Drop-in replacements for svelte/transition that read the motion tokens and honour reduced
// motion. Under `prefers-reduced-motion: reduce` every moving transition becomes a fade of the
// same length: the movement goes, the feedback stays. See
// docs/superpowers/specs/2026-10-01-motion-layer-design.md §2.

export type MotionToken = 'fast' | 'panel' | 'emphasis' | 'exit'

/** The `--motion-*` values in src/app.css, for when the stylesheet cannot be read (SSR, jsdom).
 *  tests/motion.test.ts fails if the two drift apart. */
export const FALLBACK_MS: Readonly<Record<MotionToken, number>> = { fast: 150, panel: 220, emphasis: 300, exit: 160 }

/** A motion token in milliseconds, read from the stylesheet so app.css stays the one source. */
export function motionMs(token: MotionToken): number {
	if (typeof document === 'undefined') return FALLBACK_MS[token]
	const raw = getComputedStyle(document.documentElement).getPropertyValue(`--motion-${token}`).trim()
	const value = parseFloat(raw)
	if (!Number.isFinite(value) || value <= 0) return FALLBACK_MS[token]
	return raw.endsWith('ms') ? value : value * 1000
}

/** Read on every call, so an OS setting flipped mid-session applies to the next transition. */
export function isReducedMotion(): boolean {
	return typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches === true
}

/** Live and SSR-safe: false on the server, the current media query in the browser. */
export const prefersReducedMotion = {
	get current() {
		return isReducedMotion()
	}
}

type Timing = { delay?: number; duration?: number; easing?: EasingFunction }
type Options = { direction?: 'in' | 'out' | 'both' }
type Resolved = { delay: number; duration: number; easing: EasingFunction }

// `out:` gets exit timing. A bidirectional `transition:` arrives as 'both' and reverses at its
// enter duration, because Svelte computes the config once for both directions.
function timing(params: Timing, token: 'fast' | 'panel' | 'emphasis', options?: Options): Resolved {
	const exiting = options?.direction === 'out'
	return {
		delay: params.delay ?? 0,
		duration: params.duration ?? motionMs(exiting && token !== 'fast' ? 'exit' : token),
		easing: params.easing ?? (exiting ? cubicIn : cubicOut)
	}
}

function opacityOf(node: Element): number {
	const value = parseFloat(getComputedStyle(node).opacity)
	return Number.isFinite(value) ? value : 1
}

// Composes with a transform the element already carries (`-translate-x-1/2` on a centred panel).
function transformOf(node: Element): string {
	const value = getComputedStyle(node).transform
	return value && value !== 'none' ? `${value} ` : ''
}

function fadeOnly(node: Element, resolved: Resolved): TransitionConfig {
	const target = opacityOf(node)
	return { ...resolved, css: (t) => `opacity: ${t * target}` }
}

export function fade(node: Element, params: Timing = {}, options?: Options): TransitionConfig {
	return fadeOnly(node, timing(params, 'fast', options))
}

export function fly(node: Element, params: Timing & { x?: number; y?: number; opacity?: number } = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'panel', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const target = opacityOf(node)
	const transform = transformOf(node)
	const { x = 0, y = 0, opacity = 0 } = params
	const delta = target * (1 - opacity)
	return { ...resolved, css: (_t, u) => `transform: ${transform}translate(${u * x}px, ${u * y}px); opacity: ${target - delta * u}` }
}

/** Not svelte's slide: no height interpolation (that is layout), a 4px rise and a fade instead. */
export function slide(node: Element, params: Timing = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'panel', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const target = opacityOf(node)
	const transform = transformOf(node)
	return { ...resolved, css: (t, u) => `transform: ${transform}translateY(${-4 * u}px); opacity: ${t * target}` }
}

export function scale(node: Element, params: Timing & { start?: number; opacity?: number } = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'fast', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const target = opacityOf(node)
	const transform = transformOf(node)
	const { start = 0.96, opacity = 0 } = params
	const opacityDelta = target * (1 - opacity)
	return { ...resolved, css: (t, u) => `transform: ${transform}scale(${start + (1 - start) * t}); opacity: ${target - opacityDelta * u}` }
}

export type DrawerEdge = 'left' | 'right' | 'bottom'

const FROM_EDGE: Record<DrawerEdge, (u: number) => string> = {
	left: (u) => `translateX(${-u * 100}%)`,
	right: (u) => `translateX(${u * 100}%)`,
	bottom: (u) => `translateY(${u * 100}%)`
}

/** An edge-anchored panel slides in from its edge; it does not squash or fade on the way. */
export function drawer(node: Element, params: Timing & { edge?: DrawerEdge } = {}, options?: Options): TransitionConfig {
	const resolved = timing(params, 'panel', options)
	if (isReducedMotion()) return fadeOnly(node, resolved)
	const move = FROM_EDGE[params.edge ?? 'right']
	return { ...resolved, css: (_t, u) => `transform: ${move(u)}` }
}
