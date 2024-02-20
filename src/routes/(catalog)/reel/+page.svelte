<script lang="ts">
import { page } from '$app/stores'
import dayjs from 'dayjs'
import SEO from '$lib/components/SEO/index.svelte'
import ReelSlider from './ReelSlider.svelte'

export let data

// let videosData = [
// 	{
// 		video:
// 			'https://res.cloudinary.com/dlcocq59y/video/upload/v1695031468/SaveInsta.App_-_3178698677076312509_yx7e7k.mp4',
// 		id: '5cdd0ab8fa390463fb588912',
// 		description:
// 			'<p>White New Fashion Women Casual Loose Comft Fit V-Neck Short Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
// 		discount: 27,
// 		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/e5c3c0dd1bc7f2e2ee14034c6b2b1ca1-1168527488612.JPEG',
// 		mrp: 4606,
// 		name: 'White New Fashion Women Casual Loose Comft Fit V-Neck Short',
// 		new: false,
// 		price: 3324,
// 		reviews: 0,
// 		sku: '21425967430585000549686-pastel-pink',
// 		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
// 		tags: [],
// 		muted: false
// 	},
// 	{
// 		video:
// 			'https://res.cloudinary.com/dlcocq59y/video/upload/v1695031473/SaveInsta.App_-_3179840065257076687_vl7jng.mp4',
// 		id: '5cdd030cfa390463fb5887f5',
// 		description:
// 			'<p>100% Brand New. Material: Cotton, Spandex 4 Colors: Pastel Pink, Khaki, Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
// 		discount: 27,
// 		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/aa205a913239583243b298f27ab8470f-638979953173.JPEG',
// 		mrp: 4606,
// 		name: 'Army Green Women Casual Round Neck Raglan Short',
// 		new: false,
// 		price: 3324,
// 		reviews: 0,
// 		sku: '21425967430585000549686-pastel-pink',
// 		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
// 		tags: [],
// 		muted: false
// 	},
// 	{
// 		video:
// 			'https://res.cloudinary.com/dlcocq59y/video/upload/v1695031478/SaveInsta.App_-_3188587924966606527_cko4b0.mp4',
// 		id: '64ad6dc6630d275555972fd8',
// 		description:
// 			'<p>100% Brand New. Material: Cotton, Spandex 4 Colors: Pastel Pink, Khaki, Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
// 		discount: 27,
// 		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/aa205a913239583243b298f27ab8470f-638979953173.JPEG',
// 		mrp: 4606,
// 		name: 'Pastel Pink Women Casual Long Sleeve V Neck Patchwork Slim Pullover T Shirt',
// 		new: false,
// 		price: 3324,
// 		reviews: 0,
// 		sku: '21425967430585000549686-pastel-pink',
// 		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
// 		tags: [],
// 		muted: false
// 	},
// 	{
// 		video:
// 			'https://res.cloudinary.com/dlcocq59y/video/upload/v1695031480/SaveInsta.App_-_3183496008931710118_1284421765_oyvlic.mp4',
// 		id: '63d89121e2e352d94b80980c',
// 		description:
// 			'<p>100% Brand New. Material: Cotton, Spandex 4 Colors: Pastel Pink, Khaki, Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
// 		discount: 27,
// 		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/aa205a913239583243b298f27ab8470f-638979953173.JPEG',
// 		mrp: 4606,
// 		name: 'Pastel Pink Women Casual Long Sleeve V Neck Patchwork Slim Pullover T Shirt',
// 		new: false,
// 		price: 3324,
// 		reviews: 0,
// 		sku: '21425967430585000549686-pastel-pink',
// 		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
// 		tags: [],
// 		muted: false
// 	}
// ]

// console.log(videosData)

// data.data = videosData

let today = dayjs(new Date()).toISOString()

let seoProps = {
	brand: $page.data.store?.title,
	caption: $page.data.store?.title,
	category: data.searchData,
	contentUrl: $page.data.store?.logo,
	createdAt: today,
	email: `${$page?.data?.store?.email}`,

	id: $page?.url?.href,
	image: $page.data.store?.logo,
	logo: $page.data.store?.logo,
	ogSquareImage: { url: '', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	timeToRead: 0,
	updatedAt: today,
	metaDescription: $page.data.store?.metaDescription,
	datePublished: today,
	description: $page.data.store?.description,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	featuredImage: {
		url: $page.data.store?.logo,
		width: 675,
		height: 380,
		caption: $page.data.store?.title
	},
	keywords: $page.data.store?.keywords,
	lastUpdated: today,
	msapplicationTileImage: $page.data.store?.logo,
	ogImage: { url: $page.data.store?.logo, width: 128, height: 56 },
	ogImageSecureUrl: `${$page?.data?.store?.logo}`,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	productBrand: data.searchData,
	productName: data.searchData,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `/`,
	title: data.searchData || 'Buy online',
	twitterImage: { url: $page.data.store?.logo }
}
</script>

<SEO {...seoProps} />

<div class="min-h-screen flex items-center justify-center text-center">
	<ReelSlider products="{data.data}" />
</div>
