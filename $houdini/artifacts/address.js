export default {
    name: "address",
    kind: "HoudiniQuery",
    hash: "4d424528132c951435ceb5f1441315712ec2257c0c63854d09e5ad45924260e8",

    raw: `query address($id: ID!) {
  address(id: $id) {
    id
    email
    firstName
    lastName
    address
    locality
    town
    city
    country
    state
    zip
    phone
    lat
    lng
    active
    verified
    createdAt
    updatedAt
  }
}
`,

    rootType: "Query",

    selection: {
        address: {
            type: "Address",
            keyRaw: "address(id: $id)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id"
                },

                email: {
                    type: "String",
                    keyRaw: "email",
                    nullable: true
                },

                firstName: {
                    type: "String",
                    keyRaw: "firstName",
                    nullable: true
                },

                lastName: {
                    type: "String",
                    keyRaw: "lastName",
                    nullable: true
                },

                address: {
                    type: "String",
                    keyRaw: "address",
                    nullable: true
                },

                locality: {
                    type: "String",
                    keyRaw: "locality",
                    nullable: true
                },

                town: {
                    type: "String",
                    keyRaw: "town",
                    nullable: true
                },

                city: {
                    type: "String",
                    keyRaw: "city",
                    nullable: true
                },

                country: {
                    type: "String",
                    keyRaw: "country",
                    nullable: true
                },

                state: {
                    type: "String",
                    keyRaw: "state",
                    nullable: true
                },

                zip: {
                    type: "String",
                    keyRaw: "zip",
                    nullable: true
                },

                phone: {
                    type: "String",
                    keyRaw: "phone",
                    nullable: true
                },

                lat: {
                    type: "Float",
                    keyRaw: "lat",
                    nullable: true
                },

                lng: {
                    type: "Float",
                    keyRaw: "lng",
                    nullable: true
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                },

                verified: {
                    type: "Boolean",
                    keyRaw: "verified",
                    nullable: true
                },

                createdAt: {
                    type: "String",
                    keyRaw: "createdAt"
                },

                updatedAt: {
                    type: "String",
                    keyRaw: "updatedAt"
                }
            }
        }
    },

    input: {
        fields: {
            id: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=4d424528132c951435ceb5f1441315712ec2257c0c63854d09e5ad45924260e8";