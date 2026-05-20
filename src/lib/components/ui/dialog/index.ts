import { Dialog } from 'bits-ui'

import Content from './dialog-content.svelte'
import Description from './dialog-description.svelte'
import Footer from './dialog-footer.svelte'
import Header from './dialog-header.svelte'
import Overlay from './dialog-overlay.svelte'
import Title from './dialog-title.svelte'

const Root: typeof Dialog.Root = Dialog.Root
const Trigger: typeof Dialog.Trigger = Dialog.Trigger
const Close: typeof Dialog.Close = Dialog.Close
const Portal: typeof Dialog.Portal = Dialog.Portal

export {
	Root,
	Title,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	Close,
	//
	Root as Dialog,
	Title as DialogTitle,
	Portal as DialogPortal,
	Footer as DialogFooter,
	Header as DialogHeader,
	Trigger as DialogTrigger,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Description as DialogDescription,
	Close as DialogClose
}
