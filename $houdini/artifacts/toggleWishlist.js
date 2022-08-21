export default {
    name: "toggleWishlist",
    kind: "HoudiniMutation",
    hash: "a2f466c65a059eeb456a0790ad472be5e40e62605f63c8abd960ad91f257c424",

    raw: `mutation toggleWishlist($product: ID!, $variant: ID!) {
  toggleWishlist(product: $product, variant: $variant)
}
`,

    rootType: "Mutation",

    selection: {
        toggleWishlist: {
            type: "Boolean",
            keyRaw: "toggleWishlist(product: $product, variant: $variant)",
            nullable: true
        }
    },

    input: {
        fields: {
            product: "ID",
            variant: "ID"
        },

        types: {}
    }
};

"HoudiniHash=a2f466c65a059eeb456a0790ad472be5e40e62605f63c8abd960ad91f257c424";