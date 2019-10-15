import { get, post } from "./../lib/api";
async function authenticationMiddleware(req, res, next) {
    let user = null,
        cart = null,
        settings = null
    const cookies = require('cookie-universal')(req, res)
    try {
        user = await get("users/me", null, cookies.get('token'));
    } catch (e) {
        // console.log('err at users', e.toString());
    }
    try {
        cart = await get("cart", null, cookies.get('token'), `MADid=${cookies.get('MADid')}`);
    } catch (e) {
        console.log('err at cart', e.toString());
    }
    try {
        settings = await get("settings", null, cookies.get('token'));
    } catch (e) {
        console.log('err at settings', e.toString());
    }
    req.user = user
    req.token = cookies.get('token')
    req.cart = cart
    req.settings = settings
    next();
}
export { authenticationMiddleware }