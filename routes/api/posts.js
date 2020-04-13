const express = require("express");
const { check, validationResult } = require("express-validator");

const auth = require("../../middlewares/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

const router = express.Router();

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text cannot be empty")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error !");
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error !");
  }
});

// @route    GET api/posts/:post_id
// @desc     Get post by ID
// @access   Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({ message: "No post found !" });

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.message.includes("ObjectId"))
      return res.status(404).json({ message: "No post found !" });
    res.status(500).send("Server error !");
  }
});

// @route    DELETE api/posts/:post_id
// @desc     Delete Post by Id
// @access   Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json({ message: "Post is not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ message: "User is not authorized !" });

    await post.remove();
    res.json({ message: "Post is removed" });
  } catch (err) {
    console.error(err.message);

    if (err.message.includes("ObjectId"))
      return res.status(404).json({ message: "No post found !" });
    res.status(500).send("Server error !");
  }
});

// @route    PUT api/posts/like/:post_id
// @desc     Like/Remove Like from post
// @access   Private
router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).send({ message: "Post not found !" });

    const likeIndex = post.likes.map(i => i.user).indexOf(req.user.id);

    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.unshift({ user: req.user.id });
    }
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error !");
  }
});

// @route    POST api/posts/comment/:post_id
// @desc     Comment on a post
// @access   Private
router.post(
  "/comment/:post_id",
  [
    auth,
    [
      check("text", "Text cannot be empty")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.post_id);

      const newComment = {
        name: user.name,
        text: req.body.text,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error !");
    }
  }
);

// @route    DELETE api/posts/comment/:post_id/:comment_id
// @desc     Delete Comment by CommentId and PostId
// @access   Private
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({ message: "Post is not found" });

    const commentIndex = post.comments
      .map(i => i._id)
      .indexOf(req.params.comment_id);

    if (commentIndex === -1)
      return res.status(404).json({ message: "Comment not found" });

    const comment = post.comments[commentIndex];
    if (comment.user.toString() !== req.user.id)
      return res.status(401).json({ message: "User is not authorized." });

    post.comments.splice(commentIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);

    if (err.message.includes("ObjectId"))
      return res.status(404).json({ message: "No post found !" });
    res.status(500).send("Server error !");
  }
});

module.exports = router;
