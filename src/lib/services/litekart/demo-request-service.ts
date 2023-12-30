import { error } from '@sveltejs/kit'
import { post } from '$lib/utils/api'

export const saveScheduleDemo = async ({
	storeId,
	schedule,
	origin,
	sid = null
}: any) => {
	try {
		let res: any = {}

		res = await post(
			`saveScheduleDemo`,
			{
				schedule,
				store: storeId
			},
			origin
		)

		return res
	} catch (e) {
		error(e.status, e.data?.message || e.message);
	}
}
