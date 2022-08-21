import { GQL_me, GQL_storeOne } from '$houdini'
import { redirect } from '@sveltejs/kit'
import fetch from 'node-fetch'

import { houdiniClient } from '$graphql/client'
houdiniClient.init()
export const load = async (event) => {
	// const res = await GQL_me.fetch({ event, fetch })
	// const store = (
	// 	await GQL_storeOne.fetch({ event, fetch, variables: { domain: 'fashion.misiki.io' } })
	// ).data.storeOne
	// console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', store)
	// const user = res.data
	// let me = user.me
	// if (!me) {
	// 	throw redirect(302, `/auth/login`)
	// }
	return { me: {}, store: {}, q: '', user: {} }
}
