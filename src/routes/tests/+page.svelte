<script>
import Fuse from 'fuse.js'
let data = [
	{
		_id: '63b8f1fee497e2c0976880f5',
		new: false,
		children: [],
		name: 'Books',
		position: 0,
		link: 'books-en',
		slug: 'books-en-en',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/category/Untitled-design-4tfbycM8DcxV.svg',
		id: '63b8f1fee497e2c0976880f5'
	},
	{
		_id: '6405e8a9d1e27517b1966598',
		new: false,
		children: [],
		name: 'Electronics',
		position: 0,
		link: 'electronics',
		slug: 'electronics',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/category/Untitled-design-3-VZTt55cFJrcS.png',
		id: '6405e8a9d1e27517b1966598'
	},
	{
		_id: '6405e37ad1e27517b19662da',
		new: false,
		children: [
			{
				_id: '63b7ecb1975b3e01c25cb591',
				new: false,
				children: [],
				img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/6-4-v8lkzIczWp4v-9Pq4vzRz9V4L.png',
				name: 'Men',
				position: 0,
				link: 'men-en',
				slug: 'fashion-men',
				id: '63b7ecb1975b3e01c25cb591'
			},
			{
				_id: '63b7ecc6975b3e01c25cb5ce',
				new: false,
				children: [
					{
						_id: '63b7ecf3975b3e01c25cb626',
						new: false,
						children: [],
						name: 'Jewellery',
						position: 0,
						link: 'jewellery',
						slug: 'women-jewellery',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/5-6-xBR7YXYepejz-dgQDoTx0XBn1.png',
						id: '63b7ecf3975b3e01c25cb626'
					},
					{
						_id: '63b8f1b0e497e2c09768808a',
						new: false,
						children: [],
						name: 'Cosmetic',
						position: 0,
						link: 'cosmetic-en',
						slug: 'women-cosmetic',
						img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/1-8-PcC4hRxUJZkN-yrAlILyQiUN2-vefTV0VRzmWl.png',
						id: '63b8f1b0e497e2c09768808a'
					}
				],
				name: 'Women',
				position: 0,
				link: 'women',
				slug: 'fashion-women',
				img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/7-4-rxgSl2HfvE6r-h4N1Z4c8f0JP.png',
				id: '63b7ecc6975b3e01c25cb5ce'
			}
		],
		name: 'Fashion',
		position: 0,
		link: 'fashion',
		slug: 'fashion',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/category/2-iKV1RH20dSyQ.png',
		id: '6405e37ad1e27517b19662da'
	},
	{
		_id: '6405e914d1e27517b19665eb',
		new: false,
		children: [],
		name: 'Grocery',
		position: 0,
		link: 'grocery',
		slug: 'grocery',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/category/Untitled-design-4-5V8arayyghpB.png',
		id: '6405e914d1e27517b19665eb'
	},
	{
		_id: '63dbe5f02dd449549fabc0a9',
		new: false,
		children: [
			{
				_id: '63b7e8bd975b3e01c25cb517',
				new: false,
				children: [
					{
						_id: '63be5b31e8fcc130e1986585',
						new: false,
						children: [],
						name: 'Chair',
						position: 0,
						link: 'chair',
						slug: 'furniture-chair',
						img: null,
						id: '63be5b31e8fcc130e1986585'
					}
				],
				name: 'Furniture',
				position: 0,
				link: 'shop/furniture',
				slug: 'home-furniture-en-en-en-en-en',
				img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/stores/6356502aca4ff28ed596cb1b/category/2-7-2Sk0zmMcpVgg-FIqCT7BOtYWf.png',
				id: '63b7e8bd975b3e01c25cb517'
			}
		],
		name: 'Home',
		position: 0,
		link: 'home',
		slug: 'home',
		img: 'https://s3.ap-south-1.amazonaws.com/litekart.in/category/Untitled-design-2-pR1QunnGAiSO.png',
		id: '63dbe5f02dd449549fabc0a9'
	}
]
let results = data

const options = {
	keys: ['name', 'children.name', 'children.children.name'], // Search name and children's names
	threshold: 0.4 // Require at least 40% match score
}

export function search(query, data) {
	const fuse = new Fuse(data, options)
	results = fuse.search(query)
	if (!results.length) {
		results = data
	}
}
</script>

<input type="text" on:input="{(event) => search(event.target.value, data)}" />
<ul>
	{#each results as result}
		<li>{result.item?.name || result?.name}</li>
		{JSON.stringify(result?.children)}
	{/each}
</ul>
