import Logo from './prodexa-logo.png'
import { IMAGE_CDN_URL } from '$lib/config'

export const fetchInit = async () => {
	return {
		storeOne: {
			id: 'prodexa',
			_id: 'prodexa',
			GOOGLE_ANALYTICS_ID: '123',
			logo: Logo,
			domain: 'prodexa.com',
			email: 'admin@prodexa.com',
			websiteLegalName: 'prodexa Gmbh',
			websiteName: 'prodexa',
			saasName: 'prodexa',
			saasDomain: 'https://prodexa.com',
			IMAGE_CDN_URL,
			imageCdn: {
				url: { val: IMAGE_CDN_URL },
				provider: { val: 'thumbor' }
			}
		}
	}
}
