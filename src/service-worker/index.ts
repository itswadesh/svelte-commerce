import activateEvent from './activateEvent'
import fetchEvent from './fetchEvent'
import installEvent from './installEvent'
// has to be var, because we need function scope
declare var self: ServiceWorkerGlobalScope
self.addEventListener('install', installEvent)
self.addEventListener('activate', activateEvent)
self.addEventListener('fetch', fetchEvent)
