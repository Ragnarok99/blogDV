const graphql = require("graphql");
const _ = require("lodash");
const Post = require("../models/post");
const Category = require("../models/category");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
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

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    lastName: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const loginType = new GraphQLObjectType({
  name: "login",
  fields: () => ({
    message: { type: GraphQLString },
    token: { type: GraphQLString }
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
    posts: {
      type: GraphQLList(PostType),
      resolve: async () => await Post.find()
    },
    categories: {
      type: GraphQLList(CategoryType),
      resolve: async (parent, args, { user }) => {
        console.log(user);
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
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
        title: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) },
        categories: { type: GraphQLNonNull(GraphQLList(GraphQLString)) }
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
    },
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLString },
        email: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        const { name, lastName, email, username, password } = args;
        const dbPassword = await bcrypt.hash(password, 12);
        const user = new User({
          name,
          lastName,
          email,
          username,
          password: dbPassword
        });

        return user.save();
      }
    },
    login: {
      type: loginType,
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        const { username, password } = args;

        const user = await User.findOne({ username });
        if (!user) {
          return { message: "auth failed", token: null };
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return { message: "auth failed", token: null };

        const {
          parsed: { SECRET_KEY_TOKEN }
        } = dotenv.config();

        const token = jwt.sign(
          _.pick(user, ["_id", "username", "email"]),
          SECRET_KEY_TOKEN,
          { expiresIn: "1d" }
        );
        return { message: "auth successfuly", token };
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
