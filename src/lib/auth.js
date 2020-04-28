import { get, post } from './../lib/api'
async function authenticationMiddleware(req, res, next) {
  let user = null,
    cart = null,
    settings = null
  const cookies = require('cookie-universal')(req, res)
  if (cookies.get('token')) {
    try {
      user = await get('users/me', null, cookies.get('token'))
    } catch (e) {
      console.log('err at users', e.toString())
    }
    req.user = user
    req.token = cookies.get('token')
  } else {
    req.user = {}
    req.token = null
    cookies.set('token', null)
  }
  try {
    cart = await get(
      'cart',
      null,
      cookies.get('token'),
      `guest=${cookies.get('guest')}`
    )
  } catch (e) {
    req.user = {}
    req.token = null
    cookies.set('token', null)
    console.log('err at cart', e.toString())
  }
  req.cart = cart
  try {
    settings = (await get('settings', null, cookies.get('token'))).data
  } catch (e) {
    console.log('err at settings', e.toString())
  }
  req.settings = settings
  next()
}
export { authenticationMiddleware }
