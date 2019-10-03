import { writable } from 'svelte/store';
import { get, post, put } from "./../lib/api";
import Cookie from 'cookie-universal'
const cookies = Cookie()
function authenticate() {
    const { subscribe, set } = writable({});
    return {
        subscribe,
        me: async () => {
            try {
                let data = await get("users/me");
                set(data)
                // cookies.set('Authorization', data.token, { path: '/', maxAge: tokenExpiry })
                return data
            } catch (e) {
                set({})
                throw e.toString()
            }
        },
        login: async ({ phone, password }) => {
            try {
                let data = await post("auth/local", { phone, password });
                set(data)
                cookies.set('token', data.token)
                // cookies.set('Authorization', data.token, { path: '/', maxAge: tokenExpiry })
                return data
            } catch (e) {
                cookies.remove('token')
                set({})
                throw e.toString()
            }
        },
        signup: async (credentials) => {
            try {
                const data = await post('users', credentials);
                set(data)
                cookies.set('token', data.token)
                return data;
            } catch (e) {
                set({})
                throw e.toString()
            }
        },
        logout: async () => {
            try {
                cookies.remove('token')
                set({});
                return response;
            } catch (e) {
                set({})
                throw e.toString()
            }
        },
        forgotPassword: async (payload) => {
            try {
                return await post('/users/forgot', payload)
            } catch (e) {
                throw e.toString()
            }
        },
        async changePassword(payload) {
            try {
                const data = await put('/users/password', payload)
                console.log('info', data.message, { root: true })
                // router.push('/my') // Push does not work from here. It stay at the same page without natigating. Rather it should be done from callee page
                return data
            } catch (e) {
                throw e.toString()
            }
        },
        async resetPassword(payload) {
            try {
                const data = await post('/users/reset/' + payload.id, payload)
                if (data) {
                    console.log('info', data, { root: true })
                    // router.push('/')
                }
                return data
            } catch (e) {
                throw e.toString()
            }
        },
        async updateProfile({ firstName, lastName, state, city, zip, avatar, gender, dob, language }) {
            try {
                const data = await put('/users/profile', { firstName, lastName, state, city, zip, avatar, gender, dob, language })
                if (data) {
                    // console.log('setUser', { email: data.email, firstName: data.firstName, lastName: data.lastName, avatar: data.avatar, dob: data.dob, gender: data.gender, language: data.language })
                    // this.$cookies.set('Authorization', data.token, { path: '/', maxAge: tokenExpiry })
                    // console.log('info', 'Profile updated.', { root: true })
                    return data
                }
            } catch (e) {
                throw e.toString()
            }
        },
    }
}
export const auth = authenticate()