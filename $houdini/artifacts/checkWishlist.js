export default {
    name: "checkWishlist",
    kind: "HoudiniQuery",
    hash: "f83d42d40e7e18bdbc028593661b7b67f6c523bcc944523af419ae8ddbb0019d",

    raw: `query checkWishlist($product: ID!, $variant: ID!) {
  checkWishlist(product: $product, variant: $variant)
}
`,

    rootType: "Query",

    selection: {
        checkWishlist: {
            type: "Boolean",
            keyRaw: "checkWishlist(product: $product, variant: $variant)",
            nullable: true
        }
    },

    input: {
        fields: {
            product: "ID",
            variant: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=f83d42d40e7e18bdbc028593661b7b67f6c523bcc944523af419ae8ddbb0019d";