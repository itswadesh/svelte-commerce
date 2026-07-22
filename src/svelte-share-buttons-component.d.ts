/**
 * Ambient types for `svelte-share-buttons-component` (v3), which ships no type
 * declarations of its own. Prop names/optionality mirror the `export let`
 * declarations in `node_modules/svelte-share-buttons-component/src/*.svelte`.
 */
declare module 'svelte-share-buttons-component' {
	import type { Component } from 'svelte'

	/** Props every button forwards to its internal `ShareButton` wrapper. */
	type ShareButtonBaseProps = {
		/** Extra classes appended to the generated `.ssbc-button--*` class. */
		class?: string
		/** Accessible label for the generated anchor. Each button has its own default. */
		ariaLabel?: string
		/** Visible text rendered next to the icon. */
		label?: string
		/** Render the icon filled (`true`, default) or outlined (`false`). */
		fill?: boolean
	}

	export type EmailProps = ShareButtonBaseProps & {
		subject: string
		body: string
	}

	export type FacebookProps = ShareButtonBaseProps & {
		quote: string
		url: string
	}

	export type HackerNewsProps = ShareButtonBaseProps & {
		title: string
		url: string
	}

	export type LineProps = ShareButtonBaseProps & {
		url: string
	}

	export type LinkedInProps = ShareButtonBaseProps & {
		url: string
	}

	export type PinterestProps = ShareButtonBaseProps & {
		description: string
		url: string
		media: string
	}

	export type RedditProps = ShareButtonBaseProps & {
		title: string
		url: string
	}

	export type TelegramProps = ShareButtonBaseProps & {
		text: string
		url: string
	}

	export type TumblrProps = ShareButtonBaseProps & {
		title: string
		caption: string
		url: string
	}

	export type ViberProps = ShareButtonBaseProps & {
		text: string
	}

	export type VkProps = ShareButtonBaseProps & {
		title: string
		url: string
	}

	export type WhatsAppProps = ShareButtonBaseProps & {
		text: string
	}

	export type XProps = ShareButtonBaseProps & {
		text: string
		url: string
		hashtags?: string
		via?: string
		related?: string
	}

	export type XingProps = ShareButtonBaseProps & {
		title: string
		url: string
	}

	export const Email: Component<EmailProps>
	export const Facebook: Component<FacebookProps>
	export const HackerNews: Component<HackerNewsProps>
	export const Line: Component<LineProps>
	export const LinkedIn: Component<LinkedInProps>
	export const Pinterest: Component<PinterestProps>
	export const Reddit: Component<RedditProps>
	export const Telegram: Component<TelegramProps>
	export const Tumblr: Component<TumblrProps>
	export const Viber: Component<ViberProps>
	export const Vk: Component<VkProps>
	export const WhatsApp: Component<WhatsAppProps>
	export const X: Component<XProps>
	export const Xing: Component<XingProps>
}
