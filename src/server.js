import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { authenticationMiddleware } from './lib/auth'
import { apiUrl } from './config'
const proxy = require('http-proxy-middleware');
const apiProxy = proxy('/api', { target: apiUrl, changeOrigin: true });
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
polka()
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		apiProxy,
		authenticationMiddleware,
		sapper.middleware({
			session: (req, res) => ({
				user: req.user || {},
				token: req.token,
				cart: req.cart || {}
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
