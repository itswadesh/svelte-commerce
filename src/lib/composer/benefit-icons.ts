import {
	Award,
	BadgeCheck,
	Clock,
	Gift,
	HandCoins,
	Headset,
	Heart,
	Leaf,
	Lock,
	MapPin,
	Package,
	Percent,
	Phone,
	RefreshCw,
	RotateCcw,
	ShieldCheck,
	Sparkles,
	Star,
	Truck,
	Wallet
} from '@lucide/svelte'

/**
 * The engine's benefit icon names (D139) drawn in this theme's line icons: the
 * same four the built-in home page draws beside its promises, and sixteen more.
 * The engine sends a name, never a picture, so the look stays this theme's.
 */
const ICONS = {
	truck: Truck,
	return: RotateCcw,
	exchange: RefreshCw,
	shield: ShieldCheck,
	lock: Lock,
	headset: Headset,
	phone: Phone,
	cash: HandCoins,
	wallet: Wallet,
	percent: Percent,
	gift: Gift,
	package: Package,
	clock: Clock,
	star: Star,
	award: Award,
	verified: BadgeCheck,
	sparkle: Sparkles,
	leaf: Leaf,
	heart: Heart,
	'map-pin': MapPin
}

/** The icon for a name, or null for none or one this storefront does not know. */
export function benefitIcon(name: unknown) {
	return typeof name === 'string' && Object.hasOwn(ICONS, name) ? ICONS[name as keyof typeof ICONS] : null
}
