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
		let res: any = {}

		res = {
			page: {
				name: "Home",
				sliderBanners: {
					title: "",
					isScroll: false,
					cols: 3,
					banners: [
						{
							sort: 0,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/img/untitled-design-htiheqvawifr.png",
							link: "",
							_id: "64f75e367b63e9599d66ab8b"
						},
						{
							sort: 0,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/img/untitled-360-190px-1500-380px-vzlc6ffmy4ej.png",
							link: "",
							_id: "64f75eccc99ed399d6de7b40"
						}
					],
					bannersMobile: [
						{
							sort: 0,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/img/untitled-360-190px-1-yroheobmw0hi.png",
							_id: "64f75f1d8efd842c7290a431"
						},
						{
							sort: 0,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/img/untitled-360-190px-iip6fn8mzk71.png",
							_id: "64f75f2cab313ebe612e8ec6"
						}
					]
				},
				heroBanners: {
					title: "",
					isScroll: false,
					cols: 3,
					banners: [
						{
							sort: 0,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/2-4-nlruvcuy4k75.png",
							link: "/search?q=fashion",
							_id: "64f98ed71095d76c9b05529b"
						},
						{
							sort: 1,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/1-4-ntbiounyxssn.png",
							link: "",
							_id: "64f98edd1095d76c9b055309"
						},
						{
							sort: 2,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/1-3-ivpssc1ze8yq.png",
							link: "",
							_id: "64f98ee4b9f51d64b17f3128"
						},
						{
							sort: 2,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/2-3-vcq01eyzsd3x.png",
							link: "",
							_id: "64f98eeccc35728e414f8dfa"
						},
						{
							sort: 4,
							img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/3-3-nncpce0wjo3q.png",
							link: "",
							_id: "64f98ef32351d66a2aeb6ac5"
						}
					]
				},
				store: "6356502aca4ff28ed596cb1b",
				active: true,
				pickedBanners: [
					{
						title: "Jewellary Corner",
						isScroll: false,
						cols: 3,
						banners: [
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/1-n1vtceofdngm.png",
								link: "",
								_id: "64f75457c478959a64afb776"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/2-xbgcsoloy7jl.png",
								link: "",
								_id: "64f754618efd842c7290a1fb"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/3-jubhwq6cvqwe.png",
								link: "",
								_id: "64f75470ab313ebe612e8c91"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/4-ihzwwkfr6gnh.png",
								link: "",
								_id: "64f7547a7b63e9599d66a9a5"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/5-fqbgz6hkssad.png",
								link: "",
								_id: "64f75498c478959a64afb7bb"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/6-rnqigletjc0q.png",
								link: "",
								_id: "64f754bd8efd842c7290a242"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/7-mjwmbhdsr5jb.png",
								link: "",
								_id: "64f75538ab313ebe612e8cda"
							}
						],
						_id: "64f754447b63e9599d66a962"
					},
					{
						title: "Fashion Corner",
						isScroll: false,
						cols: 3,
						banners: [
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/8-gkcraiwxfbkq.png",
								link: "",
								_id: "64f7555ec478959a64afb808"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/9-c8gonxfzqx9a.png",
								link: "",
								_id: "64f75565c478959a64afb85a"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/rings-rnyrnzjrkxud.png",
								link: "",
								_id: "64f7559a8efd842c7290a292"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/11-qtxwvnvdkcu6.png",
								link: "",
								_id: "64f755aaab313ebe612e8d2c"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/12-bx0tkq9obdoz.png",
								link: "",
								_id: "64f755b27b63e9599d66aa3c"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/13-kt7tmwmdwtr4.png",
								link: "",
								_id: "64f755b9c478959a64afb8b1"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/14-j67hsocrfhmh.png",
								link: "",
								_id: "64f755c28efd842c7290a2eb"
							}
						],
						_id: "64f7554f7b63e9599d66a9e8"
					},
					{
						title: "Furniture Corner",
						isScroll: false,
						cols: 3,
						banners: [
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/15-dlwvfcaumo3j.png",
								link: "",
								_id: "64f755d87b63e9599d66aa99"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/16-i5mb0erny1sh.png",
								link: "",
								_id: "64f755e1c478959a64afb910"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/17-tq2jypx86mou.png",
								link: "",
								_id: "64f755eb8efd842c7290a34c"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/18-dhin9cf3tp2p.png",
								link: "",
								_id: "64f755f3ab313ebe612e8de2"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/19-8hl5svlyapal.png",
								link: "",
								_id: "64f755fc7b63e9599d66aafe"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/20-9kighyu9jbej.png",
								link: "",
								_id: "64f75604c478959a64afb977"
							},
							{
								sort: 0,
								img: "https://s3.ap-south-1.amazonaws.com/litekart.in/banner/21-0hjah3bkxbxd.png",
								link: "",
								_id: "64f7560bc478959a64afb9e3"
							}
						],
						_id: "64f755ceab313ebe612e8d7f"
					}
				],
				slug: "home",
				keywords: "",
				metaDescription: "",
				title: "",
				banners: []
			},
			cache: 'HIT'
		}

		return {
			page: res?.page
		}
	} catch (e) {
		throw error(e.status, e.message || e)
	}
}
