export default {
    name: "updateProfile",
    kind: "HoudiniMutation",
    hash: "16ad021f67c2c7a022cf627a5d67830db1da6fe761107cb9f2cb24721bfeaae6",

    raw: `mutation updateProfile($address: AddressInput, $firstName: String, $lastName: String, $email: String, $avatar: String, $dob: String, $gender: String, $phone: String, $info: InputInfo, $shippingCharges: Int, $freeShippingOn: Int, $storeName: String, $banner: String) {
  updateProfile(
    firstName: $firstName
    lastName: $lastName
    email: $email
    avatar: $avatar
    phone: $phone
    dob: $dob
    gender: $gender
    info: $info
    address: $address
    shippingCharges: $shippingCharges
    freeShippingOn: $freeShippingOn
    storeName: $storeName
    banner: $banner
  ) {
    firstName
    lastName
    email
    phone
    avatar
    avatarCdn
    role
    gender
    city
    shippingCharges
    freeShippingOn
    storeName
    banner
    info {
      public
      store
    }
    id
  }
}
`,

    rootType: "Mutation",

    selection: {
        updateProfile: {
            type: "UserOne",
            keyRaw: "updateProfile(firstName: $firstName, lastName: $lastName, email: $email, avatar: $avatar, phone: $phone, dob: $dob, gender: $gender, info: $info, address: $address, shippingCharges: $shippingCharges, freeShippingOn: $freeShippingOn, storeName: $storeName, banner: $banner)",
            nullable: true,

            fields: {
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

                email: {
                    type: "String",
                    keyRaw: "email",
                    nullable: true
                },

                phone: {
                    type: "String",
                    keyRaw: "phone",
                    nullable: true
                },

                avatar: {
                    type: "String",
                    keyRaw: "avatar",
                    nullable: true
                },

                avatarCdn: {
                    type: "String",
                    keyRaw: "avatarCdn",
                    nullable: true
                },

                role: {
                    type: "String",
                    keyRaw: "role",
                    nullable: true
                },

                gender: {
                    type: "String",
                    keyRaw: "gender",
                    nullable: true
                },

                city: {
                    type: "String",
                    keyRaw: "city",
                    nullable: true
                },

                shippingCharges: {
                    type: "Int",
                    keyRaw: "shippingCharges",
                    nullable: true
                },

                freeShippingOn: {
                    type: "Int",
                    keyRaw: "freeShippingOn",
                    nullable: true
                },

                storeName: {
                    type: "String",
                    keyRaw: "storeName",
                    nullable: true
                },

                banner: {
                    type: "String",
                    keyRaw: "banner",
                    nullable: true
                },

                info: {
                    type: "Info",
                    keyRaw: "info",
                    nullable: true,

                    fields: {
                        public: {
                            type: "Boolean",
                            keyRaw: "public",
                            nullable: true
                        },

                        store: {
                            type: "String",
                            keyRaw: "store",
                            nullable: true
                        }
                    }
                },

                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            address: "AddressInput",
            firstName: "String",
            lastName: "String",
            email: "String",
            avatar: "String",
            dob: "String",
            gender: "String",
            phone: "String",
            info: "InputInfo",
            shippingCharges: "Int",
            freeShippingOn: "Int",
            storeName: "String",
            banner: "String"
        },

        types: {
            AddressInput: {
                id: "ID",
                email: "String",
                firstName: "String",
                lastName: "String",
                address: "String",
                town: "String",
                city: "String",
                country: "String",
                district: "String",
                state: "String",
                lat: "Float",
                lng: "Float",
                zip: "Int",
                phone: "String",
                active: "Boolean"
            },

            InputInfo: {
                public: "Boolean",
                store: "String",
                storePhotos: "String"
            }
        }
    }
};

"HoudiniHash=f345b3f708e3d7362ecf1a900b463e0f1a6c4b7ea5b6c8522d25731dc53498cc";