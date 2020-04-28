import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'
import { authenticationMiddleware } from './lib/auth'
import { api_url } from './config'
require('dotenv').config()
const { PORT, NODE_ENV, API_URL } = process.env

const { createProxyMiddleware } = require('http-proxy-middleware')
const apiProxy = createProxyMiddleware('/api', {
  target: API_URL || api_url,
  changeOrigin: true,
})
const imgProxy = createProxyMiddleware('/images', {
  target: API_URL || api_url,
  changeOrigin: true,
})
const sitemapProxy = createProxyMiddleware('/sitemap-hs.xml', {
  target: API_URL || api_url,
  changeOrigin: true,
})

const dev = NODE_ENV === 'development'
polka()
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    apiProxy,
    imgProxy,
    sitemapProxy,
    authenticationMiddleware,
    sapper.middleware({
      session: (req, res) => ({
        user: req.user || {},
        token: req.token,
        cart: req.cart || {},
        settings: req.settings || {},
      }),
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err)
  })
