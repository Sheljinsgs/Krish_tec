const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const ServiceProviderProfile = require('../../models/ServiceProviderProfile');
const Serviceprovider = require('../../models/Serviceprovider');

router.put(
  '/cook',
  check('location', 'location is required').notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { location } = req.body;
    const title="cook";

    try {
      const user = await ServiceProviderProfile.find({ location, title: title });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'There is no service at the location' }] });
      }

      return res.status(200).json(user);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.put(
    '/cab',
    check('location', 'location is required').notEmpty(),
  
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { location } = req.body;
      const title ="cab";
  
      try {
        const user = await ServiceProviderProfile.find({ location, title: title });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'There is no service at the location' }] });
        }
  
        return res.status(200).json(user);
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

  router.put(
    '/electrision',
    check('location', 'location is required').notEmpty(),
  
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { location } = req.body;
      const title =  "electrision";
  
      try {
        const user = await ServiceProviderProfile.find({ location, title: title });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'There is no service at the location' }] });
        }
  
        return res.status(200).json(user);
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

module.exports = router;