import { setContext } from 'svelte';
import { writable } from 'svelte/store'

export const checkIsAndroidDevice = async (data) => {
    const isAndroid = writable();
    $: isAndroid.set(data)

    setContext('isAndroid', isAndroid);

    return isAndroid
}
