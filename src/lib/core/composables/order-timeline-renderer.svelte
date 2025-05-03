<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		timeline: any
		content: Snippet<[SnippetParams]>
	}

	const { content, timeline }: Props = $props()

	interface SnippetParams {
		comments: TimelineComment[]
		systemGeneratedMessages: TimelineEntry[]
		showEmailPreviewFromTimeline: boolean
		selectedEmailFromTimeline: string

		showEmailPreview: () => void
		hideEmailPreview: () => void
	}

	type TimelineComment = {
		id: string
		author: string
		avatar: string
		content: string
		timestamp: string
	}

	type TimelineEntry = {
		id: string
		message: string
		comment?: string
		timestamp: string
		action?: {
			label: string
			onClick: () => void
		}
	}

	let comments: TimelineComment[] = $state([])
	let systemGeneratedMessages: TimelineEntry[] = $state([])
	let showEmailPreviewFromTimeline = $state(false)
	let selectedEmailFromTimeline = $state('')

	$effect(() => {
		if (timeline) {
			const tempSystemEntries: TimelineEntry[] = []
			const tempUserEntries: TimelineComment[] = []

			for (const item of timeline) {
				if (item.user_id) {
					const entry: TimelineComment = {} as TimelineComment

					entry.author = `${item.first_name} ${item.last_name}`
					entry.content = item.message
					entry.timestamp = item.created_at || item.createdAt
					entry.avatar = item.first_name[0].toUpperCase()

					tempUserEntries.push(entry)
				} else {
					const entry: TimelineEntry = {} as TimelineEntry

					const formattedDate = new Intl.DateTimeFormat('en-GB', {
						dateStyle: 'medium',
						timeStyle: 'short'
					}).format(new Date(item.created_at || item.createdAt))

					entry.message = item.message
					entry.comment = item.comment
					entry.timestamp = formattedDate

					if (item.email && item.data) {
						entry.action = {
							label: 'View email',
							onClick: () => {
								showEmailPreviewFromTimeline = true
								selectedEmailFromTimeline = item.data
							}
						}
					}

					tempSystemEntries.push(entry)
				}
			}

			systemGeneratedMessages = tempSystemEntries
			comments = tempUserEntries
		}
	})

	function showEmailPreview() {
		showEmailPreviewFromTimeline = true
	}
	function hideEmailPreview() {
		showEmailPreviewFromTimeline = false
	}
</script>

{@render content({
	comments,
	systemGeneratedMessages,
	showEmailPreviewFromTimeline,
	selectedEmailFromTimeline,
	showEmailPreview,
	hideEmailPreview
})}
