const { ApolloServer } = require('apollo-server');


const typeDefs = `
type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
}
type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
}

type Mutation {
    postPhoto(name: String! description: String): Photo!
}
`

var photos = []

const resolvers = {
    Query: {
        totalPhotos: () => photos.length
    },
    Mutation: {
        postPhoto(parent, args) {
            photos.push(args)
            return true
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => console.log(`GraphQL Service running om ${url}`))