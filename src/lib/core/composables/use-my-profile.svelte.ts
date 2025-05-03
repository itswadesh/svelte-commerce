import { browser } from '$app/environment'
import { profileService } from '$lib/core/services'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { toast } from 'svelte-sonner'

export class MyProfileModule {
	userState = getUserState()

	isLoading = $state(false)
	profileExists = false
	detailsChanged = $state(false)
	profile: any = $state({
		firstName: '',
		lastName: '',
		avatar: '',
		// description: '',
		// logo: '',
		// address_1: '',
		// address_2: '',
		// city: '',
		// state: '',
		// country: '',
		phone: ''
		// email: '',
		// zipCode: '',
		// currency: ' ',
		// language: '',
		// commission: 0,
		// paymentProvider: '',
		// shippingProvider: '',
		// weightUnit: '',
		// dimensionUnit: ''
	})

	constructor() {
		$effect(() => {
			if (browser) {
				document.onkeydown = (e) => {
					e = e || window.event
					if (e.ctrlKey || e.metaKey) {
						// Check for both Ctrl and Command key
						let c = e.which || e.keyCode // Get key code
						switch (c) {
							case 83: // Block Ctrl/Cmd + S
								e.preventDefault()
								e.stopPropagation()
								this.saveProfile()
								break
						}
					}
				}
			}

			this.loadProfile()
		})
	}

	saveProfile = async () => {
		// e.preventDefault()
		try {
			this.isLoading = true
			// profile.id = page.params.id
			// if (profileExists) await profileService.saveProfiles(profile)
			// else
			await profileService.save(this.profile)
			toast.success('Profile Updated Successfully!')
			//goto('/dash/profile')
		} catch (e: any) {
			toast.error(e.message || e.toString())
		} finally {
			this.detailsChanged = false
			this.isLoading = false
		}
	}

	onUploadComplete = (urls: string[]) => {
		this.profile.logo = urls[0]
	}

	handleDetailsChange = () => {
		this.detailsChanged = true
	}

	loadProfile = async () => {
		try {
			const user = this.userState?.retrieveUserId()
			const me = user?.me
			let data = await profileService.getOne()
			if (data) {
				this.profile = data
				this.profileExists = true
			}
		} catch (e: any) {
			toast.error(e.message || e.toString())
		}
	}
}

