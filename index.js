const { ApolloServer } = require('apollo-server');


const typeDefs = `
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
    allPhotos: [Photo!]!
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
    "postedBy": "gPlake"
}, {
    "id": "2",
    "name": "Enjoing",
    "description": "The heart chute",
    "category": "SELFIE",
    "postedBy": "sSchmidt"
}];

var tags = [
    {"photoID": "1", "userID": "gPlake"},
    {"photoID": "2", "userID": "sSchmidt"},
    {"photoID": "2", "userID": "gPlake"},
]

const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos
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
        }
    },
    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.postedBy === parent.githubLogin)
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => console.log(`GraphQL Service running om ${url}`))