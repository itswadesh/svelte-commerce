export default {
    name: "saveBlog",
    kind: "HoudiniMutation",
    hash: "0b98fd86de24c3d15bb87e676c1d9271d76106b77006f4a7d8b6f0b74753bee7",

    raw: `mutation saveBlog($id: String!, $title: String, $slug: String, $excerpt: String, $content: String, $published_at: String, $img: String, $tags: [String], $active: Boolean) {
  saveBlog(
    id: $id
    title: $title
    slug: $slug
    excerpt: $excerpt
    content: $content
    published_at: $published_at
    img: $img
    tags: $tags
    active: $active
  ) {
    id
    title
    slug
    active
    excerpt
    content
    published_at
    img
    imgCdn
    tags
    active
  }
}
`,

    rootType: "Mutation",

    selection: {
        saveBlog: {
            type: "OneBlog",
            keyRaw: "saveBlog(id: $id, title: $title, slug: $slug, excerpt: $excerpt, content: $content, published_at: $published_at, img: $img, tags: $tags, active: $active)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id"
                },

                title: {
                    type: "String",
                    keyRaw: "title",
                    nullable: true
                },

                slug: {
                    type: "String",
                    keyRaw: "slug",
                    nullable: true
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                },

                excerpt: {
                    type: "String",
                    keyRaw: "excerpt",
                    nullable: true
                },

                content: {
                    type: "String",
                    keyRaw: "content",
                    nullable: true
                },

                published_at: {
                    type: "String",
                    keyRaw: "published_at",
                    nullable: true
                },

                img: {
                    type: "String",
                    keyRaw: "img",
                    nullable: true
                },

                imgCdn: {
                    type: "String",
                    keyRaw: "imgCdn",
                    nullable: true
                },

                tags: {
                    type: "String",
                    keyRaw: "tags",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            id: "String",
            title: "String",
            slug: "String",
            excerpt: "String",
            content: "String",
            published_at: "String",
            img: "String",
            tags: "String",
            active: "Boolean"
        },

        types: {}
    }
};

"HoudiniHash=7265c2b843fa6633ab18ec97c8456be70ce7ce276fb724651f20ecdb5bb1613c";