const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql')

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => {
                xml.GoodreadsResponse.author[0].name[0]
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve: xml =>
                xml.GoodreadsResponse.author[0].books[0].book
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: xml =>
                xml.title[0]
                // console.log('i am xml', JSON.stringify(xml, null, 2))
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => xml.isbn[0]
        }
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) => fetch(
                    `https://www.goodreads.com/author/show.xml?id=${args.id}&key=xWnaclwDotUU6yaZ4Jw`
                )
                .then(response => response.text())
                .then(parseXML)
            }
        })
    })
})