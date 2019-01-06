const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfile = require('../../validation/profile');
const validateExperience = require('../../validation/experience');
const validateEducation = require('../../validation/education');

/**
 * @route GET api/profile
 * @desc Get current user profile
 * @access Protected
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    const errors = {};

    Profile
        .findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @route GET api/profile/handle/:handle
 * @desc Get profile by handle
 * @access Public
 */
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile
        .findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No profile found';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @route GET api/profile/user/:userId
 * @desc Get profile by userId
 * @access Public
 */
router.get('/user/:userId', (req, res) => {
    const errors = {};
    Profile
        .findOne({ user: req.params.userId })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No profile found';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({ profile: "There is no profile for this id" }));
});

/**
 * @route GET api/profile/all
 * @desc Get all profiles
 * @access Public
 */

router.get('/all', (req, res) => {
    const errors = {};
    Profile
        .find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.profiles = "No profiles were found";
                return res.status(404).json({ profile: "There are no profiles" });
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @route POST api/profile
 * @desc Create or Edit user profile
 * @access Protected
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfile(req.body);
    if (!isValid) return res.status(400).json({ errors });

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.handle) profileFields.handle = req.body.handle;

    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                ).then(profile => res.json(profile));
            } else {
                // Create
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errors.handle = "That handle already exists";
                            res.status(400).json(errors);
                        }
                        new Profile(profileFields)
                            .save()
                            .then(profile => res.json(profile));
                    })
            }
        })
});

/**
 * @route POST api/profile/experience
 * @desc Add experience to profile
 * @access Protected
 */
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateExperience(req.body);
    if (!isValid) return res.status(400).json({ errors });

    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.experience.unshift(newExp);
            profile.save()
                .then(profile => res.json(profile));
        })
});

/**
 * @route POST api/profile/education
 * @desc Add education to profile
 * @access Protected
 */
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateEducation(req.body);
    if (!isValid) return res.status(400).json({ errors });

    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.education.unshift(newEducation);
            profile.save()
                .then(profile => res.json(profile));
        });
});

/**
 * @route DELETE api/profile/experience/:exp_id
 * @desc Remove experience from profile
 * @access Protected
 */
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);
            profile.experience.splice(removeIndex, 1);
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err));

});

/**
 * @route DELETE api/profile/education/:edu_id
 * @desc Remove education from profile
 * @access Protected
 */
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.exp_id);
            profile.education.splice(removeIndex, 1);
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err));

});

/**
 * @route DELETE api/profile
 * @desc Delete user and profile
 * @access Protected
 */

 router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile
        .findOneAndRemove( { user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => res.json({ success: "User and profile deleted"}));
        });
 });
module.exports = router;