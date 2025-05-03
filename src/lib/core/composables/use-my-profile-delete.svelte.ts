import { userService } from '$lib/core/services'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { toast } from 'svelte-sonner'

export class MyProfileDeleteModule {
	user = getUserState()
	iAgree = $state(false)

	deleteUser = async () => {
		if (!this.iAgree) return

		try {
			const me = this.user.retrieveUserId()?.me
			if (!me?.userId) throw 'User Id not found'
			await userService.deleteUser(me.userId)
			window.location.reload()
			toast.success('Account deleted successfully')
		} catch (e) {
			console.error(e)
			toast.error('Account deletion failed')
		}
	}
}

