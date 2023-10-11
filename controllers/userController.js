const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a new user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with this id" });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Add a new friend to a user's friend list
  async addFriend(req, res) {
    console.log("You are now adding a friend");
    console.log(req.body);
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(400).json({ message: "No user found with that ID." });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(400).json({ message: "No user found with that ID" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
