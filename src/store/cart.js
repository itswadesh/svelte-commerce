import { writable } from 'svelte/store';
import { get, post } from "./../lib/api";
import Cookie from 'cookie-universal'
const cookies = Cookie()
function getCart() {
    const { subscribe, set } = writable({
        items: [],
        qty: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        offer_total: 0,
        showCart: false,
        promo: null
    });
    return {
        subscribe,
        fetch: async () => {// This is only to get data from saved cart
            // let token = cookies.get('token')
            try {
                const data = await get('cart', null)
                // console.log('setCart', data)
                return data
            }
            catch (e) { }
        },
        add: async (payload) => {
            // let token = cookies.get('token')
            try {
                const data = await post("cart/add", payload);
                set(data)
                // console.log('setCart', data)
                return data
            }
            catch (e) {
                console.log('setErr', e)
                throw e.toString()
            }
        },
        setPromo: (data) => {
            set({
                promo: data.details,
                total: data.amount
            })
        },
        showCart: () => {
            return showCart
        },
        checkCart: ({ pid, vid }) => { // Returns true when there is item in cart
            var found = state.items.some(function (el) {
                return el.product._id === pid && el.variant._id === vid;
            });
            return found
        },
        setCart: (data) => {
            set({
                items: data.items || [],
                qty: data.qty,
                discount: data.discount || 0,
                subtotal: data.subtotal,
                total: data.total,
                offer_total: data.offer_total
            })
        },
        toggleCart: (payload) => {
            state.showCart = payload
        },
        applyDiscount: (state, amount) => {
            state.discount = amount
        },
        checkout: async ({ paymentMethod, address }) => {
            // let token = cookies.get('token')
            paymentMethod = paymentMethod || 'COD'
            switch (paymentMethod) {
                case "COD":
                    try {
                        let order = await post('electronics-orders', { address: { qrno: address }, paymentMethod: 'COD' })
                        const data = await cart.fetch();
                        set(data)
                        return order
                        // this.$router.push('/order-success?id=' + order._id + '&amount=' + order.amount.total)
                    } catch (e) {
                        console.log('setErr', e.toString())
                        throw e
                    }
                    break;
                case "Stripe":
                    console.log('setErr', 'Stripe not implemented yet. Proceed with COD')
                    break;
                default:
                    console.log('setErr', 'The checkout service ' + paymentMethod + ' not yet implemented')
                    console.log("Unknown checkout service: " + paymentMethod);
                    break;
            }
        },
    }
}
export const cart = getCart()