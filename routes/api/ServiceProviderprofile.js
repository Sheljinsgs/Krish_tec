const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/ServiceProviderProfile');
const User = require('../../models/Serviceprovider');
const Serviceprovider = require('../../models/Serviceprovider');
const ServiceProviderProfile = require('../../models/ServiceProviderProfile');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post(
  '/',
  auth,
  check('contact', 'contact number is required').notEmpty(),
  check('title', 'title is required').notEmpty(),
  check('location', 'location is required').notEmpty(),
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  check('bio', 'bio is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      contact,
      title,
      location,
      status,
      skills,
      bio,
      ...rest
    } = req.body;
    try {
      let profile = await Serviceprovider.findOne({ user: req.user.id });
      const User=await Serviceprovider.findById(req.user.id).select('name');
      const name=User.name;

      console.log(name);

      profile = new ServiceProviderProfile({
        name,
        contact,
        title,
        location,
        status,
        skills,
        bio,
        ...rest
      });

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }


    
  }
);

router.put(
  '/experience',
  auth,
  check('title', 'Title is required').notEmpty(),
  check('location', 'location is required').notEmpty(),
  check('years', 'years is required').notEmpty(),
  check('description', 'description is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Serviceprovider.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const profiles = await Serviceprovider.find().populate('user', ['name']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({ params: { user_id } }, res) => {
    try {
      const profile = await Serviceprovider.findOne({
        user: user_id
      }).populate('user', ['name']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.delete('/', auth, async (req, res) => {
  try {
    await Promise.all([
      Post.deleteMany({ user: req.user.id }),
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id })
    ]);

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

module.exports = router;
