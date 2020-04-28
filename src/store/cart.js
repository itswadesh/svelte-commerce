import { writable } from 'svelte/store'
import { get, post } from './../lib/api'
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
    promo: null,
  })
  return {
    subscribe,
    fetch: async () => {
      // This is only to get data from saved cart
      try {
        const data = await get('cart', null)
        set(data)
        return data
      } catch (e) {}
    },
    add: async (payload) => {
      try {
        const data = await post('cart/addE', payload)
        set(data)
        return data
      } catch (e) {
        throw e
      }
    },
    setPromo: (data) => {
      set({
        promo: data.details,
        total: data.amount,
      })
    },
    showCart: () => {
      return showCart
    },
    setCart: (data) => {
      set({
        items: data.items || [],
        qty: data.qty,
        discount: data.discount || 0,
        subtotal: data.subtotal,
        total: data.total,
        offer_total: data.offer_total,
      })
    },
    toggleCart: (payload) => {
      showCart = payload
    },
    checkout: async ({ paymentMethod, address }) => {
      try {
        let order = await post('orders', {
          address,
          paymentMethod: paymentMethod || 'COD',
        })
        const data = await cart.fetch()
        set(data)
        return order
      } catch (e) {
        // console.log('err...', e.toString())
        throw e
      }
    },
  }
}
export const cart = getCart()
