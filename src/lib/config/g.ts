import { GFetch } from '@leveluptuts/g-query'

export const g = new GFetch({
	path: '/graphql', //whatever your api url is here
	// More config options coming, for now this is just path to your graphql api
})
