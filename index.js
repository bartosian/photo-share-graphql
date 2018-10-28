const { ApolloServer } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');


const typeDefs = `
scalar DateTime
enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
}
type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
}

type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!

}

input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
}
type Query {
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
}

type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
}
`
var _id = 0;
var users = [
    {"githubLogin": "sSchmidt", "name": "Mike Hattrup"},
    {"githubLogin": "gPlake", "name": "Glen Plake"}
];
var photos = [{
    "id": "1",
    "name": "Dropping",
    "description": "The heart chute",
    "category": "ACTION",
    "postedBy": "gPlake",
    "created": "3-28-1977"
}, {
    "id": "2",
    "name": "Enjoing",
    "description": "The heart chute",
    "category": "SELFIE",
    "postedBy": "sSchmidt",
    "created": "1-2-1985"
}];

var tags = [
    {"photoID": "1", "userID": "gPlake"},
    {"photoID": "2", "userID": "sSchmidt"},
    {"photoID": "2", "userID": "gPlake"},
]

const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: (parent, args) => {
            args.after
        }
    },
    Mutation: {
        postPhoto(parent, args) {

            var newPhoto = {
                id: _id++,
                ...args.input
            }
            photos.push(args)
            return newPhoto
        }
    },
    Photo: {
        url: parent => `http://yoursite.com/${parent.id}.jpg`,
        postedBy: parent => {
            return users.find(u => u.githubLogin === parent.postedBy)
        },
        taggedUsers: parent => tags
            .filter(tag => tag.photoID === parent.id)
            .map(tag => tag.userID)
            .map(tag => users.find(u => u.githubLogin === tag))
    },
    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.postedBy === parent.githubLogin)
        },
        inPhotos: parent => tags
            .filter(tag => tag.userID === parent.id)
            .map(tag => tag.photoID)
            .map(photoID => photos.find(p => p.id === photoID))
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value.',
        parseValue: value => new Date(value),
        serialize: value => new Date(value).toISOString(),
        parseLiteral: ast => ast.value
    })
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => console.log(`GraphQL Service running om ${url}`))