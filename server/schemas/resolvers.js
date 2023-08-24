const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    
    me: async (parent, args, context) => { 
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
        // .select('-__v -password')
        .populate('savedBooks');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // users: async () => {
    //   return User.find().populate('savedBooks');
    // },
    // user: async (parent, { _id }) => {
    //   return User.findOne({ _id }).populate("savedBooks")
    // },
  },

  Mutation: {

    addUser: async (parent, { email, password, username }) => {
      const user = await User.create({ email, password, username });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, args, context) => {
      if (!args.description) {
        args.description = "No description available";
      }
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args, } },
          {
            new: true,
            runValidators: true,
          }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to save a book.');
    },

    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged into to remove a book.');
    },
  },
};

module.exports = resolvers;
