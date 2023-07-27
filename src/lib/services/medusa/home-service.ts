import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import { getBySid } from '$lib/utils/server'

const isServer = import.meta.env.SSR

export const fetchHome = async ({
	origin,
	storeId,
	pageId = 'home',
	server = false,
	sid = null
}: any) => {
	try {
		let banners = []
		let categories = {}
		let groupByBanner = {}
		let heroBanners = []
		let res: any = {}

		res = {
			categories: {
				data: [
					{
						_id: '63b8f1fee497e2c0976880f5',
						name: 'Books',
						link: 'books-en-en',
						slug: 'books-en-en',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/category/Untitled-design-4tfbycM8DcxV.svg'
					},
					{
						_id: '63b7ecb1975b3e01c25cb591',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/6-4-v8lkzIczWp4v-9Pq4vzRz9V4L.png',
						name: 'Men',
						link: 'fashion-men',
						slug: 'fashion-men'
					},
					{
						_id: '63b7ecc6975b3e01c25cb5ce',
						name: 'Women',
						link: 'fashion-women',
						slug: 'fashion-women',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/7-4-rxgSl2HfvE6r-h4N1Z4c8f0JP.png'
					},
					{
						_id: '63b7e8bd975b3e01c25cb517',
						name: 'Furniture',
						link: 'shop/furniture',
						slug: 'home-furniture-en-en-en-en-en',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/2-7-2Sk0zmMcpVgg-FIqCT7BOtYWf.png'
					},
					{
						_id: '63b8f1b0e497e2c09768808a',
						name: 'Cosmetic',
						link: 'women-cosmetic',
						slug: 'women-cosmetic',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/1-8-PcC4hRxUJZkN-yrAlILyQiUN2-vefTV0VRzmWl.png'
					},
					{
						_id: '63b7ecf3975b3e01c25cb626',
						name: 'Jewellery',
						link: 'women-jewellery',
						slug: 'women-jewellery',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/5-6-xBR7YXYepejz-dgQDoTx0XBn1.png'
					}
				],
				count: 6,
				pageSize: 40,
				noOfPage: 1,
				page: 1,
				active: 6,
				inactive: 0
			},
			banners: {
				data: [
					{
						_id: '63b810ce975b3e01c25cbf43',
						groupTitle: 'Jewellery Collections',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/2-6-ZwqWrAA63F2s.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/2-6-ZwqWrAA63F2s.png',
						link: '/search'
					},
					{
						_id: '63b81101975b3e01c25cbf9a',
						groupTitle: 'Fashion Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/13-cA83zY8GN6oa.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/13-cA83zY8GN6oa.png',
						link: '/search'
					},
					{
						_id: '63b81132975b3e01c25cbfea',
						groupTitle: 'Fashion Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/11-5RGI5f8EZrfy.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/11-5RGI5f8EZrfy.png',
						link: '/search'
					},
					{
						_id: '63b8115c975b3e01c25cc064',
						groupTitle: 'Fashion Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/12-yjli6f9uwPTT.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/12-yjli6f9uwPTT.png',
						link: '/search'
					},
					{
						_id: '63b811cc975b3e01c25cc17c',
						groupTitle: 'Furniture Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/21-VDVYyBSYm5fp.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/21-VDVYyBSYm5fp.png',
						link: '/search'
					},
					{
						_id: '63b8109c975b3e01c25cbee1',
						groupTitle: 'Jewellery Collections',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/6-2-Z7cjt5zCpzf8.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/6-2-Z7cjt5zCpzf8.png',
						link: '/search'
					},
					{
						_id: '63b81121975b3e01c25cbfc2',
						groupTitle: 'Fashion Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/8-TxcWFGTK4PoC.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/8-TxcWFGTK4PoC.png',
						link: '/search'
					},
					{
						_id: '63b8116a975b3e01c25cc08c',
						groupTitle: 'Fashion Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/14-IAgmAbOYU7Qa.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/14-IAgmAbOYU7Qa.png',
						link: '/search'
					},
					{
						_id: '63b811bd975b3e01c25cc154',
						groupTitle: 'Furniture Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/19-CLIw4GVgGkP2.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/19-CLIw4GVgGkP2.png',
						link: '/search'
					},
					{
						_id: '63b810ad975b3e01c25cbf09',
						groupTitle: 'Jewellery Collections',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/5-4-Aa9hspzW5VII.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/5-4-Aa9hspzW5VII.png',
						link: '/search'
					},
					{
						_id: '63b81140975b3e01c25cc012',
						groupTitle: 'Fashion Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/9-bOdR2TGPKICT.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/9-bOdR2TGPKICT.png',
						link: '/search'
					},
					{
						_id: '63b81194975b3e01c25cc0dc',
						groupTitle: 'Furniture Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/16-zqUK1kLoKYVX.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/16-zqUK1kLoKYVX.png',
						link: '/search'
					},
					{
						_id: '63b811a5975b3e01c25cc104',
						groupTitle: 'Furniture Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/17-aZfxia9WFlOh.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/17-aZfxia9WFlOh.png',
						link: '/search'
					},
					{
						_id: '63b811db975b3e01c25cc1a4',
						groupTitle: 'Furniture Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/20-zWih2IJQFbWB.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/20-zWih2IJQFbWB.png',
						link: '/search'
					},
					{
						_id: '642fded4ae6c41017373db8e',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/7-E6OOTDh4axQv.png',
						sort: 0,
						type: 'slider',
						isMobile: true,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/7-E6OOTDh4axQv.png',
						link: '/search'
					},
					{
						_id: '63b81072975b3e01c25cbe68',
						groupTitle: 'Jewellery Collections',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/4-4-Qas5vIa5yPfQ.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/4-4-Qas5vIa5yPfQ.png',
						link: '/search'
					},
					{
						_id: '63b81083975b3e01c25cbe90',
						groupTitle: 'Jewellery Collections',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/1-7-XlSB1kZyDLeA.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/1-7-XlSB1kZyDLeA.png',
						link: '/search'
					},
					{
						_id: '63b81090975b3e01c25cbeb9',
						groupTitle: 'Jewellery Collections',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/7-2-ZoTSqyKNSzW6.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/7-2-ZoTSqyKNSzW6.png',
						link: '/search'
					},
					{
						_id: '63b810e6975b3e01c25cbf6b',
						groupTitle: 'Jewellery Collections',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/3-6-MBkwKIkUz8eR.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/3-6-MBkwKIkUz8eR.png',
						link: '/search'
					},
					{
						_id: '63b8114e975b3e01c25cc03a',
						groupTitle: 'Fashion Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/10-hIUh7mGXLaZn.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/10-hIUh7mGXLaZn.png',
						link: '/search'
					},
					{
						_id: '63b81180975b3e01c25cc0b4',
						groupTitle: 'Furniture Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/15-X7stLTeOvK85.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/15-X7stLTeOvK85.png',
						link: '/search'
					},
					{
						_id: '63b811b1975b3e01c25cc12c',
						groupTitle: 'Furniture Collection',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/18-tjsCWZYCKLBa.png',
						sort: 0,
						type: 'picked',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/img/18-tjsCWZYCKLBa.png',
						link: '/search'
					},
					{
						_id: '642fdec5ae6c41017373db70',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/6-xlm239wEDwn8.png',
						sort: 0,
						type: 'slider',
						isMobile: true,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/6-xlm239wEDwn8.png',
						link: '/search'
					},
					{
						_id: '642ff569ae6c41017373e7d1',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/banner/4-1wcj44RJdKXt.png',
						sort: 1,
						type: 'hero',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/banner/4-1wcj44RJdKXt.png',
						link: '/search'
					},
					{
						_id: '642fdcd7ae6c41017373da22',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/6-2-pFmQD0zPiNmt.png',
						sort: 1,
						type: 'slider',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/6-2-pFmQD0zPiNmt.png',
						link: '/home-furniture-en-en-en-en-en'
					},
					{
						_id: '63b7d9a4975b3e01c25c983f',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/2-2-94PRteGV7eUV.png',
						sort: 1,
						type: 'slider',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/2-2-94PRteGV7eUV.png',
						link: '/shop/furniture'
					},
					{
						_id: '63b7d99e975b3e01c25c982b',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/5-2-nQU0nhhQ0ilW.png',
						sort: 2,
						type: 'slider',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/5-2-nQU0nhhQ0ilW.png',
						link: '/women-cosmetic'
					},
					{
						_id: '63b7e1ca975b3e01c25c9c75',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/2-3-oBtIyFba8txz.png',
						sort: 2,
						type: 'slider',
						isMobile: true,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/2-3-oBtIyFba8txz.png',
						link: '/search'
					},
					{
						_id: '63b7f878975b3e01c25cbb70',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/banner/2-4-XZWKsZvPxQCf.png',
						sort: 2,
						type: 'hero',
						isMobile: false,
						imgCdn: 'https://ik.imagekit.io/3wzatecz51w3i/litekart.in/banner/2-4-XZWKsZvPxQCf.png',
						link: '/search'
					},
					{
						_id: '642fdcf3ae6c41017373da5f',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/7-2-voOfdRpxzUfA.png',
						sort: 2,
						type: 'slider',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/7-2-voOfdRpxzUfA.png',
						link: '/home-furniture-en-en-en-en-en'
					},
					{
						_id: '642ff57dae6c41017373e7e0',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/banner/6-3-Zll2ngNTPGJC.png',
						sort: 2,
						type: 'hero',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/banner/6-3-Zll2ngNTPGJC.png',
						link: '/search'
					},
					{
						_id: '63b7e1d4975b3e01c25c9c89',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/img/5-3-Wv0JehGIbVCS.png',
						sort: 3,
						type: 'slider',
						isMobile: true,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/img/5-3-Wv0JehGIbVCS.png',
						link: '/search'
					},
					{
						_id: '642ff586ae6c41017373e7ef',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/banner/4-2-Qe9LJlN2RMXc.png',
						sort: 3,
						type: 'hero',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/banner/4-2-Qe9LJlN2RMXc.png',
						link: '/search'
					},
					{
						_id: '642ff5a0ae6c41017373e81d',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/banner/3-K6nmGOYoPRME.png',
						sort: 4,
						type: 'hero',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/banner/3-K6nmGOYoPRME.png',
						link: '/search'
					},
					{
						_id: '642ff5a9ae6c41017373e82c',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/banner/5-HoYVttbM7ZZj.png',
						sort: 5,
						type: 'hero',
						isMobile: false,
						imgCdn:
							'https://litekart.in.s3.ap-south-1.amazonaws.com/litekart.in/banner/5-HoYVttbM7ZZj.png',
						link: '/search'
					}
				],
				count: 41,
				pageSize: 40,
				noOfPage: 2,
				page: 1,
				active: 35,
				inactive: 6
			},
			groupByBanner: [],
			cache: 'HIT'
		}

		if (res?.banners?.data?.length) {
			banners = res?.banners?.data

			heroBanners =
				res?.banners?.data &&
				res?.banners?.data.filter((b) => {
					return b.type === 'hero'
				})
		}

		if (res?.groupByBanner?.length) {
			groupByBanner = res?.groupByBanner
		}

		if (res?.categories?.data?.length) {
			categories = res?.categories?.data
		}

		return {
			banners,
			brands: res?.brands,
			categories,
			html: res?.html,
			groupByBanner,
			heroBanners,
			trending: res?.trending,
			youMayLike: res?.youMayLike
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message || e)
	}
}
