import { error } from '@sveltejs/kit'
import { post } from '$lib/utils/api'
import type { Error } from '$lib/types'
import { postBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const updatePopulatiry = async ({
    pid,
    storeId,
    origin,
    isCors = false,
    sid = null
}: any) => {
    return
}