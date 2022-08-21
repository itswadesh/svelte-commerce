export async function load({ url, params, fetch }) {
const id = +url.searchParams.get('id')
return {
	id
}
}
