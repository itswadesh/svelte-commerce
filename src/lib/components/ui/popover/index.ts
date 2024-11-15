import { Popover } from 'bits-ui'
import Content from './popover-content.svelte'
const Root = Popover.Root
const Trigger = Popover.Trigger
const Close = Popover.Close

export {
	Root,
	Content,
	Trigger,
	Close,
	//
	Root as Popover,
	Content as PopoverContent,
	Trigger as PopoverTrigger,
	Close as PopoverClose
}
