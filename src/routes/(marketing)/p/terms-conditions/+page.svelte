<script>
import SEO from '$lib/components/SEO/index.svelte'
import { page } from '$app/stores'
let seoProps = {
	title: `Terms and conditions`,
	description: `Terms and conditions`
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen p-3 sm:p-10">
	<div class="container mx-auto w-full max-w-6xl">
		<!-- Terms & Conditions -->

		<h1 class="mb-5 text-center font-serif text-2xl font-medium sm:mb-10 md:text-3xl lg:text-4xl">
			Terms & Conditions
		</h1>

		<ul class="flex flex-col gap-5 text-justify text-sm sm:text-base">
			<li>
				<h6 class="mb-5 font-semibold">CONDITIONS OF USE</h6>

				<p class="text-gray-500">
					Welcome to our online store! {$page.data.store?.websiteName} and its associates provide their
					services to you subject to the following conditions. If you visit or shop within this website,
					you accept these conditions. Please read them carefully.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">PRIVACY</h6>

				<p class="text-gray-500">
					Please review our Privacy Notice, which also governs your visit to our website, to
					understand our practices.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">ELECTRONIC COMMUNICATIONS</h6>

				<p class="text-gray-500">
					When you visit {$page.data.store?.websiteName} or send e-mails to us, you are communicating
					with us electronically. You consent to receive communications from us electronically. We will
					communicate with you by e-mail or by posting notices on this site. You agree that all agreements,
					notices, disclosures, and other communications that we provide to you electronically satisfy
					any legal requirement that such communications be in writing.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">COPYRIGHT</h6>

				<p class="text-gray-500">
					All content included on this site, such as text, graphics, logos, button icons, images,
					audio clips, digital downloads, data compilations, and software, is the property of {$page
						.data.store.websiteName}
					or its content suppliers and protected by international copyright laws. The compilation of
					all content on this site is the exclusive property of {$page.data.store?.websiteName},
					with copyright authorship for this collection by {$page.data.store?.websiteName}, and
					protected by international copyright laws.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">TRADE MARKS</h6>

				<p class="text-gray-500">
					{$page.data.store?.websiteName}’s trademarks and trade dress may not be used in connection
					with any product or service that is not {$page.data.store?.websiteName}’s, in any manner
					that is likely to cause confusion among customers, or in any manner that disparages or
					discredits {$page.data.store?.websiteName}. All other trademarks not owned by {$page.data
						.store.websiteName} or its subsidiaries that appear on this site are the property of their
					respective owners, who may or may not be affiliated with, connected to, or sponsored by
					{$page.data.store?.websiteName} or its subsidiaries.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">LICENSE AND SITE ACCESS</h6>

				<p class="text-gray-500">
					{$page.data.store?.websiteName} grants you a limited license to access and make personal use
					of this site and not to download (other than page caching) or modify it, or any portion of
					it, except with express written consent of {$page.data.store?.websiteName}. This license
					does not include any resale or commercial use of this site or its contents: any collection
					and use of any product listings, descriptions, or prices: any derivative use of this site
					or its contents: any downloading or copying of account information for the benefit of
					another merchant: or any use of data mining, robots, or similar data gathering and
					extraction tools. This site or any portion of this site may not be reproduced, duplicated,
					copied, sold, resold, visited, or otherwise exploited for any commercial purpose without
					express written consent of {$page.data.store?.websiteName}. You may not frame or utilize
					framing techniques to enclose any trademark, logo, or other proprietary information
					(including images, text, page layout, or form) of {$page.data.store?.websiteName} and our associates
					without express written consent. You may not use any meta tags or any other “hidden text” utilizing
					{$page.data.store?.websiteName}’s name or trademarks without the express written consent
					of {$page.data.store.websiteName}. Any unauthorized use terminates the permission or
					license granted by {$page.data.store?.websiteName}. You are granted a limited, revocable,
					and nonexclusive right to create a hyperlink to the home page of {$page.data.store
						.websiteName}
					so long as the link does not portray {$page.data.store?.websiteName}, its associates, or
					their products or services in a false, misleading, derogatory, or otherwise offensive
					matter. You may not use any
					{$page.data.store?.websiteName} logo or other proprietary graphic or trademark as part of the
					link without express written permission.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">YOUR MEMBERSHIP ACCOUNT</h6>

				<p class="text-gray-500">
					If you use this site, you are responsible for maintaining the confidentiality of your
					account and password and for restricting access to your computer, and you agree to accept
					responsibility for all activities that occur under your account or password. If you are
					under 18, you may use our website only with involvement of a parent or guardian. {$page
						.data.store.websiteName}
					and its associates reserve the right to refuse service, terminate accounts, remove or edit
					content, or cancel orders in their sole discretion.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">REVIEWS, COMMENTS, EMAILS, AND OTHER CONTENT</h6>

				<p class="text-gray-500">
					Visitors may post reviews, comments, and other content: and submit suggestions, ideas,
					comments, questions, or other information, so long as the content is not illegal, obscene,
					threatening, defamatory, invasive of privacy, infringing of intellectual property rights,
					or otherwise injurious to third parties or objectionable and does not consist of or
					contain software viruses, political campaigning, commercial solicitation, chain letters,
					mass mailings, or any form of “spam.” You may not use a false e-mail address, impersonate
					any person or entity, or otherwise mislead as to the origin of a card or other content.
					{$page.data.store?.websiteName} reserves the right (but not the obligation) to remove or edit
					such content, but does not regularly review posted content. If you do post content or submit
					material, and unless we indicate otherwise, you grant {$page.data.store?.websiteName} and its
					associates a nonexclusive, royalty-free, perpetual, irrevocable, and fully sub-license-able
					right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute,
					and display such content throughout the world in any media. You grant {$page.data.store
						.websiteName} and its associates and sub-licensees the right to use the name that you submit
					in connection with such content, if they choose. You represent and warrant that you own or
					otherwise control all of the rights to the content that you post: that the content is accurate:
					that use of the content you supply does not violate this policy and will not cause injury to
					any person or entity: and that you will indemnify {$page.data.store?.websiteName}
					or its associates for all claims resulting from content you supply. {$page.data.store
						.websiteName} has the right but not the obligation to monitor and edit or remove any activity
					or content. {$page.data.store?.websiteName}
					takes no responsibility and assumes no liability for any content posted by you or any third
					party.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">RISK OF LOSS</h6>

				<p class="text-gray-500">
					All items purchased from {$page.data.store?.websiteName} are made pursuant to a shipment contract.
					This basically means that the risk of loss and title for such items pass to you upon our delivery
					to the carrier.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">PRODUCT DESCRIPTIONS</h6>

				<p class="mb-5 text-gray-500">
					{$page.data.store?.websiteName} and its associates attempt to be as accurate as possible. However,
					{$page.data.store?.websiteName}
					does not warrant that product descriptions or other content of this site is accurate, complete,
					reliable, current, or error-free.
				</p>

				<p class="text-gray-500">
					Disclaimer of warranties and limitation of liability this site is provided by {$page.data
						.store.websiteName}
					on an “as is” and “as available” basis. {$page.data.store?.websiteName} makes no representations
					or warranties of any kind, express or implied, as to the operation of this site or the information,
					content, materials, or products included on this site. you expressly agree that your use of
					this site is at your sole risk. to the full extent permissible by applicable law, {$page
						.data.store.websiteName}
					disclaims all warranties, express or implied, including, but not limited to, implied warranties
					of merchant-ability and fitness for a particular purpose. {$page.data.store?.websiteName} does
					not warrant that this site, its servers, or e-mail sent from {$page.data.store
						.websiteName} are free of viruses or other harmful components. {$page.data.store
						.websiteName} will not be liable for any damages of any kind arising from the use of this
					site, including, but not limited to direct, indirect, incidental, punitive, and consequential
					damages. certain state laws do not allow limitations on implied warranties or the exclusion
					or limitation of certain damages. if these laws apply to you, some or all of the above disclaimers,
					exclusions, or limitations may not apply to you, and you might have additional rights.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">APPLICABLE LAW</h6>

				<p class="text-gray-500">
					By visiting {$page.data.store?.websiteName}, you agree that the laws of the state of
					GUJARAT, INDIA, without regard to principles of conflict of laws, will govern these
					Conditions of Use and any dispute of any sort that might arise between you and {$page.data
						.store.websiteName} or its associates.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">DISPUTES</h6>

				<p class="text-gray-500">
					Any dispute relating in any way to your visit to {$page.data.store?.websiteName} or to products
					you purchase through
					{$page.data.store?.websiteName} shall be submitted to confidential arbitration in Telangana,
					India, except that, to the extent you have in any manner violated or threatened to violate
					{$page.data.store?.websiteName}’s intellectual property rights, {$page.data.store
						.websiteName} may seek injunctive or other appropriate relief in any state or federal court
					in the state of Telangana, India, and you consent to exclusive jurisdiction and venue in such
					courts. Arbitration under this agreement shall be conducted under the rules then prevailing
					of the American Arbitration Association. The arbitrators award shall be binding and may be
					entered as a judgment in any court of competent jurisdiction. To the fullest extent permitted
					by applicable law, no arbitration under this Agreement shall be joined to an arbitration involving
					any other party subject to this Agreement, whether through class arbitration proceedings or
					otherwise.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">SITE POLICIES, MODIFICATION, AND SEVER-ABILITY</h6>

				<p class="text-gray-500">
					Please review our other policies, such as our Shipping and Returns policy, posted on this
					site. These policies also govern your visit to {$page.data.store?.websiteName} . We reserve
					the right to make changes to our site, policies, and these Conditions of Use at any time. If
					any of these conditions shall be deemed invalid, void, or for any reason unenforceable, that
					condition shall be deemed sever-able and shall not affect the validity and enforce-ability
					of any remaining condition.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">QUESTIONS</h6>

				<p class="text-gray-500">
					Questions regarding our Conditions of Usage, Privacy Policy, or other policy related
					material can be directed to our support staff by clicking on the “Contact Us” link in the
					side menu or in the footer. Or you can email us at: {$page.data.store?.websiteEmail}
				</p>
			</li>
		</ul>
	</div>
</section>
