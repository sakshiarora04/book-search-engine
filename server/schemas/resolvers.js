const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        try {
          const user = await User.findOne({ _id: context.user._id });
          return user;
        } catch (err) {
          console.log("Unable to find user data", err);
        }
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw AuthenticationError("No user found");
        }
        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw AuthenticationError("Incorrect Password");
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log("log error", err);
      }
    },
    saveBook: async (parent, { bookDetails }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookDetails } },
            { new: true, runValidators: true }
          );
            console.log(updatedUser,  bookDetails)
          return updatedUser;
        } catch (err) {
          console.log("Save book error", err);
        }
      }
      throw AuthenticationError("You need to be logged in!");
      
    },
    removeBook: async (parents, { bookId }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
          );

          return updatedUser;
        } catch (err) {
          console.log("Remove book error", err);
        }
      }
      throw AuthenticationError("You need to be logged in!");
      
    },
  },
};

module.exports = resolvers;
