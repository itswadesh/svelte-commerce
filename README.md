## The elastic search is down. Hence you may receive product not found error. Trying to get it up as early as possible

<a href="https://www.litekart.in/">
<img src="https://github.com/itswadesh/sapper-ecommerce/blob/master/static/litekart-banner.png?raw=true" alt/>
</a>

On sapper/svelte version bump do the following else it will show error while navigating on home page with carousel

Whos knows whether this will work out of the box!

`node_modules/svelte/internal/index.mjs`

https://github.com/sveltejs/svelte/issues/2086

```
function detach(node) {
    if(node.parentNode){
        node.parentNode.removeChild(node);
    }
}
```

# Svelte Commerce - Attach Svelte store front to any ecommerce API (e.g. <a href="https://www.litekart.in/"> Litekart</a>, <a href="https://magento.com/">Magento</a>, <a href="https://www.moltin.com/">Moltin</a>, <a href="https://www.shopify.com/">Shopify</a> ...)

![version](https://img.shields.io/badge/node-v12.x-blue.svg)
![Branch stable](https://img.shields.io/badge/stable%20branch-master-blue.svg)
![Branch Develop](https://img.shields.io/badge/dev%20branch-dev-blue.svg)
<a href="https://codenx.slack.com" target="blank">![Branch Develop](https://img.shields.io/badge/community%20chat-slack-FF1493.svg)</a>

|                                                                                                                     |                                                                                                                  |                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ![Home Page](https://github.com/itswadesh/sapper-ecommerce/blob/master/static/screenshots/home.png?raw=true)        | ![Detail Page](https://github.com/itswadesh/sapper-ecommerce/blob/master/static/screenshots/detail.png?raw=true) | ![Search Page](https://github.com/itswadesh/sapper-ecommerce/blob/master/static/screenshots/search.png?raw=true) |  |
| ![Empty Cart](https://github.com/itswadesh/sapper-ecommerce/blob/master/static/screenshots/empty-cart.png?raw=true) | ![Login Page](https://github.com/itswadesh/sapper-ecommerce/blob/master/static/screenshots/login.png?raw=true)   | ![Filters](https://github.com/itswadesh/sapper-ecommerce/blob/master/static/screenshots/filters.png?raw=true)    |
|                                                                                                                     |                                                                                                                  |                                                                                                                  |

# Built for speed

> Following are the test results when all servers (Elasticsearch, Node, Static Server, Client) give a ping response <100 ms. The demo app hopyshopy.com is hosted at Mumbai (India), If you are testing from another country, the results my vary.

> Solution to the above issue is to use a CDN. I am trying to find sponcers to migrate all to a CDN in near future.

## Google Lighthouse/Pagespeed Audit Score (Search Page)

  <img src="https://github.com/itswadesh/sapper-ecommerce/blob/master/static/light-house-search.jpg?raw=true" alt />
  
  ## Google Lighthouse/Pagespeed Audit Score (Detail Page)
  <img src="https://github.com/itswadesh/sapper-ecommerce/blob/master/static/light-house-detail.jpg?raw=true" alt />

# What is Litekart?

- Litekart is a storefront for your existing eCommerce.
- It is possible to connect with any eCommerce backend
- No need to make a big leap or invest huge amount. Just take this opend source project and attach to existing backend.

# Installation

Install - [NodeJS](https://nodejs.org/en/) - [Yarn](https://yarnpkg.com/en/) - [Git](https://git-scm.com/)

```
git clone https://github.com/itswadesh/sapper-ecommerce.git
cd sapper-ecommerce
yarn
yarn dev
```

Thats all !

Open http://localhost:4400 on chrome. Your app should be live

# Deployment

### Deploy to Netlify

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/itswadesh/sapper-ecommerce"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a>

### Setup devops/live.js (Change according to your hosting envirnoment)

```
const PM2_NAME = 'h'
const REMOTE_DIR = '/var/www/hopyshopy/www'
const REMOTE_host = '165.22.222.60'
const REMOTE_USER = 'root'
```

Rename sample.env to .env and enter your server private key

Next

```
yarn live
```

<img src="https://github.com/itswadesh/sapper-ecommerce/blob/master/static/deployed.jpg?raw=true" alt />

# Configurations

If required change `src/config.js` according to your requirement

# Features

- TailwindCSS Integrated
- Server Rendered
- Proxy + API integrated
- Lazy loading images
- Animations (Page transition)
- Login
- Cart & Checkout
- Settings from database
- Stores
- SEO optimized pages
- Carousel (Slider)
- Loading Indicators
- Componentized Checkbox, Radio, Textbox
- Instant Search
- Faceted filters
- 1 click deploy to live server
- API calls
- Skeletons
- Responsive
- Fontawesome
- PWA
- `>90` PWA score
- filters: First, Date, Truncate, Currency
- Generate production version files with css minified
- PUT, POST, DELETE calls with Bearer Authorization
- Storing tokens into cookie
- Loader on route change with 100ms delay
- Integrated Google Analytics

If you like my work, please consider supporting me with your kind contribution. Thank you!!!

[Paypal](https://paypal.me/itswadesh)
