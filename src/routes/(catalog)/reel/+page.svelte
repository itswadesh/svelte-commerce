<script lang="ts">
import { page } from '$app/stores'
import { CatelogNav } from '$lib/components'
import dayjs from 'dayjs'
import SEO from '$lib/components/SEO/index.svelte'
import ReelSlider from './ReelSlider.svelte'

export let data

let videosData = [
	{
		video:
			'https://d30fs77zq6vq2v.cloudfront.net/storage/20230904/products/WL-MPS152/wl-mps152-1_1693828905.mp4',
		id: '5cdcd2fffa390463fb588n4e9',
		description:
			'<p>100% Brand New. Material: Cotton, Spandex 4 Colors: Pastel Pink, Khaki, Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
		discount: 27,
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/aa205a913239583243b298f27ab8470f-638979953173.JPEG',
		mrp: 4606,
		name: 'Pastel Pink Women Casual Long Sleeve V Neck Patchwork Slim Pullover T Shirt',
		new: false,
		price: 3324,
		reviews: 0,
		sku: '21425967430585000549686-pastel-pink',
		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
		tags: [],
		muted: false
	},
	{
		video:
			'https://d30fs77zq6vq2v.cloudfront.net/storage/20230912/products/WL-WT35/0409-33-1_1694509930.mp4',
		id: '5cdcd2fffa390463fb5b884e9',
		description:
			'<p>100% Brand New. Material: Cotton, Spandex 4 Colors: Pastel Pink, Khaki, Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
		discount: 27,
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/aa205a913239583243b298f27ab8470f-638979953173.JPEG',
		mrp: 4606,
		name: 'Pastel Pink Women Casual Long Sleeve V Neck Patchwork Slim Pullover T Shirt',
		new: false,
		price: 3324,
		reviews: 0,
		sku: '21425967430585000549686-pastel-pink',
		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
		tags: [],
		muted: false
	},
	{
		video:
			'https://d30fs77zq6vq2v.cloudfront.net/storage/20230912/products/WL-KT05/0409-26-1_1694512553.mp4',
		id: '5cdcd2fffa390463fb57884e9',
		description:
			'<p>100% Brand New. Material: Cotton, Spandex 4 Colors: Pastel Pink, Khaki, Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
		discount: 27,
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/aa205a913239583243b298f27ab8470f-638979953173.JPEG',
		mrp: 4606,
		name: 'Pastel Pink Women Casual Long Sleeve V Neck Patchwork Slim Pullover T Shirt',
		new: false,
		price: 3324,
		reviews: 0,
		sku: '21425967430585000549686-pastel-pink',
		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
		tags: [],
		muted: false
	},
	{
		video:
			'https://d30fs77zq6vq2v.cloudfront.net/storage/20230904/products/WL-MPS151/wl-mps151-1_1693828806.mp4',
		id: '5cdcd2fffa390463fb58284e9',
		description:
			'<p>100% Brand New. Material: Cotton, Spandex 4 Colors: Pastel Pink, Khaki, Black, Blue Item: T-Shirt Closure Type: Pullover Style: Casual Design: Slim, Long Sleeve, Patchwork, Bow Season: Spring, Autumn Collar: V-Neck Sleeve: Long Sleeve Decor: Bow Pattern: Patchwork Gender: Women Fit Style: Slim Opportunity: Casual Package Content: 1 x Women T-Shirt Soft and comfortable material, bodycon slim fit, suitable for a variety of occasions. Note: As different computers display colors differently, the color of the actual item may vary slightly from the above images, thanks for your understanding. Size: There are 4 sizes (S, M, L, XL) available for the following listing. please allow 1-2cm differs due to manual measurement, thanks (All measurement in cm and please note 1cm=0.39inch)</p>',
		discount: 27,
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/images/product/women/aa205a913239583243b298f27ab8470f-638979953173.JPEG',
		mrp: 4606,
		name: 'Pastel Pink Women Casual Long Sleeve V Neck Patchwork Slim Pullover T Shirt',
		new: false,
		price: 3324,
		reviews: 0,
		sku: '21425967430585000549686-pastel-pink',
		slug: 'pastel-pink-women-casual-long-sleeve-v-neck-patchwork-slim-pullover-t-shirt',
		tags: [],
		muted: false
	}
]

console.log(videosData);

data.data = videosData


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
	canonical: `${$page?.url.href}`,
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

<div class="h-full min-h-screen max-w-sm flex items-center justify-center text-center">
	<div class="flex">
		<ReelSlider products="{data.data}" />
	</div>
</div>
