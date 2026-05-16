import { Collapsible } from 'bits-ui'

const Root: typeof Collapsible.Root = Collapsible.Root
const Trigger: typeof Collapsible.Trigger = Collapsible.Trigger
const Content: typeof Collapsible.Content = Collapsible.Content

export {
	Root,
	Content,
	Trigger,
	//
	Root as Collapsible,
	Content as CollapsibleContent,
	Trigger as CollapsibleTrigger
}
