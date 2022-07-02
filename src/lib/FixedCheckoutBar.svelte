<style>
.navbar-item img {
	max-height: 2.3rem;
}
.navbar-brand1 {
	box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
	align-items: stretch;
	display: flex;
	flex-shrink: 0;
	min-height: 3.25rem;
}
.navbar.has-shadow {
	box-shadow: 0 2px 0 0 #f5f5f5;
}
.navbar.is-primary {
	background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
}
.navbar {
	background-color: #fff;
	min-height: 3.25rem;
	z-index: 30;
}
.navbar.is-primary .navbar-brand > a.navbar-item:hover {
	background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
}
img {
	height: auto;
	max-width: 100%;
}
.navbar-item img {
	max-height: 1.75rem;
}
a {
	color: #3273dc;
	cursor: pointer;
	text-decoration: none;
}
.navbar-menu {
	background-color: #fff;
	box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
	padding: 0.5rem 0;
	display: none;
}
.navbar-link,
a.navbar-item {
	cursor: pointer;
}
.navbar-item1,
.navbar-link {
	color: #4a4a4a;
	display: block;
	line-height: 1.5;
	padding: 0.5rem 0.75rem;
	flex-grow: 0;
	flex-shrink: 0;
}
/* .section {
  padding: 3rem 1.5rem;
} */
.hero.is-primary .subtitle {
	color: hsla(0, 0%, 100%, 0.9);
}
.title:not(.is-spaced) + .subtitle {
	margin-top: -1.25rem;
}
article,
aside,
figure,
footer,
header,
hgroup {
	display: block;
}
profile .card-profile-image img {
	-webkit-box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
	box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
}
/* .imgsize {
  width: 128px;
  height: 90px;
  margin-left: -20px;
} */
.shadow,
.profile-page .card-profile .card-profile-image img {
	-webkit-box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
	box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
}
.a1 {
	display: flex;
	align-items: center;
}
.headeralign1 {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	text-align: center;
}
.cart-icon1 {
	padding-right: 6px;
	margin-top: 5px;
}
.center {
	display: flex;
	flex-direction: row;
	align-items: center;
}
</style>

<script>
import { KQL_Cart } from './graphql/_kitql/graphqlStores'
import { currency } from './util'
$: cart = $KQL_Cart.data?.cart || {}
</script>

<div>
	{#if cart.qty != 0}
		<footer class="footer">
			<nav class="navbar header has-shadow is-primary">
				<div class="headeralign1 shadow" style="color:white;">
					<div style="padding-left: 13px;">
						<span>
							{cart.qty} item{#if cart.qty > 1}s{/if} | {currency(cart.total)}
						</span>
					</div>
					<div class="navbar-brand1 ">
						<a class="navbar-item1 a1 " style="color:white" href="/cart">
							<div class="center">
								<div class="cart-icon1">
									<img src="/carticon.svg" alt="" />
								</div>
								<div>VIEW CART</div>
							</div>
						</a>
					</div>
				</div>
			</nav>
		</footer>
	{/if}
</div>
