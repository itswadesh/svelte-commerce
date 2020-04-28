import * as sapper from '@sapper/app'
import { cart } from './store/cart.js'
import { googleAnalytics } from './actions/ga.js'
import { ANALYTICS_TRACKING_ID } from './config.js'
sapper.start({
  target: document.querySelector('#sapper'),
})
cart.fetch()

if (ANALYTICS_TRACKING_ID) googleAnalytics(ANALYTICS_TRACKING_ID)
