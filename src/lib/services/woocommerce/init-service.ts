export const fetchInit = async () => {
	// This is called once during hard reload + everytime footer is hit through /server/store/server.ts
	return { storeOne: { _id: 'Woocommerce' } }
}
