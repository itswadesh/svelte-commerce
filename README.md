# Installation

Install following
- [NodeJS](https://nodejs.org/en/) - [Yarn](https://yarnpkg.com/en/) - [Git](https://git-scm.com/)

```
git clone https://github.com/itswadesh/sapper-ecommerce.git
cd sapper-ecommerce
yarn
yarn dev
```

Thats all !

Open http://localhost:4400 on chrome. Your app should be live

# Deployment

### Setup devops/live.js (Change according to your hosting envirnoment)

```
const PM2_NAME = 'h'
const REMOTE_DIR = '/var/www/hopyshopy/www'
const REMOTE_HOST = '165.22.222.60'
const REMOTE_USER = 'root'
```

Rename sample.env to .env and enter your server private key

Next
```
yarn live
```

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

