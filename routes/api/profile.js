const express = require("express");
const { check, validationResult } = require("express-validator");
const config = require("config");
const request = require("request");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const auth = require("../../middlewares/auth");

const router = express.Router();

// @route    GET api/profile/me
// @desc     My Profile
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ message: "There's no profile for this user." });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error !");
  }
});

// @route    POST api/profile
// @desc     Create / Update profile
// @access   Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required.")
        .not()
        .isEmpty(),
      check("skills", "Skills are required.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    profileFields.skills = skills.split(",").map(i => i.trim());
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;

    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    try {
      // Upsert = if theres a profile for this user, update. else, create one.
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error !");
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server error !");
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile of user
// @access   Public
router.get("/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ message: "No profile found." });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.message.includes("ObjectId"))
      return res.status(400).json({ message: "No profile found." });
    res.status(500).send("Server error !");
  }
});

// @route    Delete api/profile
// @desc     Delete Profile, user and posts.
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    // TODO : Remove Posts
    // Remove profile
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ message: "User removed !" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error !");
  }
});

// @route    PUT api/profile/experience
// @desc     Add / Update experience
// @access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;

      const profile = await Profile.findOne({
        user: req.user.id
      });

      if (!profile)
        return res.status(400).json({ message: "No profiles found !" });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error !");
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete Experience
// @access   Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile)
      return res.status(400).json({ message: "No profile found !" });

    const removeIndex = profile.experience
      .map(i => i.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error !");
  }
});

// @route    PUT api/profile/education
// @desc     Add education
// @access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "School degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Study field is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile)
        return res.status(400).json({ message: "No profile found" });

      profile.education.unshift(req.body);
      await profile.save();
      res.send(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error !");
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete Education
// @access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(400).json({ message: "No profile found" });

    const removeIndex = profile.education
      .map(i => i.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error !");
  }
});

// @route    GET api/profile/github/:username
// @desc     Get User repos from GitHub
// @access   Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ message: "No GitHub profile found !" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error !");
  }
});

module.exports = router;
