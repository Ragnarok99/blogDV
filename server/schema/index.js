const graphql = require("graphql");
const _ = require("lodash");
const Post = require("../models/post");
const Category = require("../models/category");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} = graphql;

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    categories: {
      type: GraphQLList(CategoryType),
      async resolve(parent, args) {
        const categories = await Category.find();
        return parent.categories.map(id =>
          categories.find(cat => cat._id.toString() === id)
        );
      }
    }
  })
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Post.findById(args.id);
      }
    },
    categories: {
      type: GraphQLList(CategoryType),
      args: { categories: { type: GraphQLList(GraphQLString) } },
      resolve: async (parent, args) => {
        return await Category.find();
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCategory: {
      type: CategoryType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        const { name, description } = args;
        const category = new Category({
          name,
          description
        });

        return category.save();
      }
    },
    addPost: {
      type: PostType,
      args: {
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        categories: { type: GraphQLList(GraphQLString) }
      },
      resolve: (parent, args) => {
        const { title, categories, body } = args;
        const post = new Post({
          title,
          body,
          categories
        });
        return post.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
