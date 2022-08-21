export default {
    name: "productReviews",
    kind: "HoudiniQuery",
    hash: "d349e34830b1ec337bace0cc90cc2dd3a8bf092245580c2754b0be4c7b3ce9d0",

    raw: `query productReviews($page: Int, $search: String, $limit: Int, $pid: ID!, $active: Boolean) {
  productReviews(
    page: $page
    search: $search
    limit: $limit
    pid: $pid
    active: $active
  ) {
    count
    page
    pageSize
    data {
      id
      rating
      message
      user {
        firstName
        lastName
        avatar
        id
      }
      active
    }
  }
}
`,

    rootType: "Query",

    selection: {
        productReviews: {
            type: "ReviewRes",
            keyRaw: "productReviews(page: $page, search: $search, limit: $limit, pid: $pid, active: $active)",
            nullable: true,

            fields: {
                count: {
                    type: "Int",
                    keyRaw: "count",
                    nullable: true
                },

                page: {
                    type: "Int",
                    keyRaw: "page",
                    nullable: true
                },

                pageSize: {
                    type: "Int",
                    keyRaw: "pageSize",
                    nullable: true
                },

                data: {
                    type: "Review",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        rating: {
                            type: "Float",
                            keyRaw: "rating",
                            nullable: true
                        },

                        message: {
                            type: "String",
                            keyRaw: "message",
                            nullable: true
                        },

                        user: {
                            type: "User",
                            keyRaw: "user",
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

                                avatar: {
                                    type: "String",
                                    keyRaw: "avatar",
                                    nullable: true
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
                                }
                            }
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            page: "Int",
            search: "String",
            limit: "Int",
            pid: "ID",
            active: "Boolean"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=c1b59e755fd8faee540ac614f031dfb8767c686b188346091976a684c8fd2485";