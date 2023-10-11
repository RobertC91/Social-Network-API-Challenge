const { Thought, User, Reaction } = require("../models");

module.exports = {
  //   Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   Create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findByIdAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      )

      if (!user) {
        return res.status(404).json({ message: 'Thought created, but no user with that ID.' })
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //   Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: "No thought with this id!" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        res.status(404).json({ message: "No thought with that ID" });
      }

      await Reaction.deleteMany({ _id: { $in: thought.reactions } });
      res.json({ message: "Thought and Reactions Deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   Create a Reaction
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res
          .status(400)
          .json({ message: "No thought found with that ID." });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   Remove a reaction
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res
          .status(400)
          .json({ message: "No thought found with that ID." });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
