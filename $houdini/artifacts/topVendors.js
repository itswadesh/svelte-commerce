export default {
    name: "topVendors",
    kind: "HoudiniQuery",
    hash: "ccae28172bcf9e786e95e3993ecb980561c3f65283bdeb88c308b0d175c7ff68",

    raw: `query topVendors($limit: Int) {
  topVendors(limit: $limit) {
    id
    businessName
    productSold
    banner
    bannerCdn
  }
}
`,

    rootType: "Query",

    selection: {
        topVendors: {
            type: "Vendor",
            keyRaw: "topVendors(limit: $limit)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                businessName: {
                    type: "String",
                    keyRaw: "businessName",
                    nullable: true
                },

                productSold: {
                    type: "Int",
                    keyRaw: "productSold",
                    nullable: true
                },

                banner: {
                    type: "String",
                    keyRaw: "banner",
                    nullable: true
                },

                bannerCdn: {
                    type: "String",
                    keyRaw: "bannerCdn",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            limit: "Int"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=ccae28172bcf9e786e95e3993ecb980561c3f65283bdeb88c308b0d175c7ff68";