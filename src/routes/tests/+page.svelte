<style>
html,
body {
	position: relative;
	height: 100%;
	padding: 0 !important;
	margin: 0 !important;
}

.container {
	overflow: hidden;
}

.item {
	position: absolute;
	width: 100px;
	color: white;
	text-align: center;
}

.item:nth-child(6n + 1) {
	background: #f55;
	height: 200px;
}

.item:nth-child(6n + 2) {
	background: #7e7;
	height: 300px;
}

.item:nth-child(6n + 3) {
	background: #66e;
	height: 200px;
}

.item:nth-child(6n + 4) {
	background: #4af;
	height: 100px;
}

.item:nth-child(6n + 5) {
	background: #ed5;
	height: 150px;
}

.item:nth-child(6n + 6) {
	background: #d5e;
	height: 130px;
}

.result {
	text-align: center;
	padding: 10px;
	font-weight: bold;
	box-sizing: border-box;
	font-size: 14px;
}

.button {
	position: relative;
	display: block;
	margin: 10px auto;
	padding: 10px 20px;
	background: white;
	border: 1px solid #ccc;
	appearance: none;
	font-weight: bold;
	width: 150px;
	text-align: center;
	box-sizing: border-box;
	font-size: 14px;
}

.image {
	position: relative;
	width: 100%;
	font-size: 0;
}

.image img {
	width: 100%;
}

.title {
	height: 40px;
	line-height: 40px;
	text-align: center;
	font-weight: bold;
	font-size: 14px;
}

@media (prefers-color-scheme: dark) {
	.title,
	.result {
		color: white;
	}
}

@media (prefers-color-scheme: light) {
	.title,
	.result {
		color: black;
	}
}
</style>

<script>
import { JustifiedGrid } from '@egjs/svelte-grid'

const gap = 5
const defaultDirection = 'end'
const rowRange = 3
const columnRange = [1, 8]
const sizeRange = [290, 310]
const isCroppedSize = true
const displayedRow = -1
</script>

<JustifiedGrid
	class="container"
	{defaultDirection}
	{gap}
	{rowRange}
	{columnRange}
	{sizeRange}
	{isCroppedSize}
	{displayedRow}>
	<img src="https://picsum.photos/200" alt="" class="item" />
	<div class="item">2</div>
	<div class="item">3</div>
	<div class="item">4</div>
	<div class="item">5</div>
	<div class="item">6</div>
	<div class="item">7</div>
	<div class="item">8</div>
	<div class="item">9</div>
	<div class="item">10</div>
</JustifiedGrid>
