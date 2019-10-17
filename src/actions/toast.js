import { writable, readable, derived } from 'svelte/store';
function toaster() {
    const { subscribe, set } = writable({ show: false, msg: null, dutation: 1000, color: '' });
    return {
        subscribe,
        show: (data) => {
            let duration = 3000
            set(data)
            setTimeout(() => {
                set({});
            }, duration);
            return data
        },
        hide: () => {
            set({})
            return {}
        }
    }
}
export const toast = toaster()
