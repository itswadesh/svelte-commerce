import { Tooltip } from 'bits-ui'
import Content from './tooltip-content.svelte'

const Root = Tooltip.Root
const Trigger = Tooltip.Trigger
const Provider = Tooltip.Provider

export {
	Root,
	Trigger,
	Content,
	Provider,
	//
	Root as Tooltip,
	Content as TooltipContent,
	Trigger as TooltipTrigger,
	Provider as TooltipProvider
}
