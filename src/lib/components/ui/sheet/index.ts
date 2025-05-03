import { Dialog as SheetPrimitive } from 'bits-ui'

import Content from './sheet-content.svelte'
import Description from './sheet-description.svelte'
import Footer from './sheet-footer.svelte'
import Header from './sheet-header.svelte'
import Overlay from './sheet-overlay.svelte'
import Title from './sheet-title.svelte'

const Root = SheetPrimitive.Root
const Close = SheetPrimitive.Close
const Trigger = SheetPrimitive.Trigger
const Portal = SheetPrimitive.Portal

export {
	Root,
	Close,
	Trigger,
	Portal,
	Overlay,
	Content,
	Header,
	Footer,
	Title,
	Description,
	//
	Root as Sheet,
	Close as SheetClose,
	Trigger as SheetTrigger,
	Portal as SheetPortal,
	Overlay as SheetOverlay,
	Content as SheetContent,
	Header as SheetHeader,
	Footer as SheetFooter,
	Title as SheetTitle,
	Description as SheetDescription
}
