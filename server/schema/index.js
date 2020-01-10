const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const Blog = require('../models/Blog'),
    Author = require('../models/Author');

const BlogType = new GraphQLObjectType({
    name: 'BlogType',
    description: 'Represents a blog',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        image: { type: GraphQLString },
        text: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'AuthorType',
    description: 'Represents an author',
    fields: () => ({
        id: { type: GraphQLID },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
})

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        blogs: {
            type: new GraphQLList(BlogType),
            name: 'Gets all blogs',
            resolve(parent, args) {
                return Blog.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            name: 'Get all authors',
            resolve(parent, args) {
                return Author.find({})
            }
        },
        blog: {
            type: BlogType,
            name: 'Get specific blog',
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Blog.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            name: 'Get specific author',
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Author.findById(args.id)
            }
        }
    }
})

const MutationQuery = new GraphQLObjectType({
    name: 'MutationQuery',
    fields: {
        addBlog: {
            type: BlogType,
            args: {
                title: { type: GraphQLNonNull(GraphQLString) },
                image: { type: GraphQLNonNull(GraphQLString) },
                text: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const { title, image, text, authorId } = args
                const blog = new Blog({ title, image, text, authorId })
                return blog.save()
            }
        },
        addAuthor: {
            type: AuthorType,
            args: {
                fname: { type: GraphQLNonNull(GraphQLString) },
                lname: { type: GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                const { fname, lname, age } = args
                const author = new Author({ fname, lname, age })
                return author.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation: MutationQuery
})