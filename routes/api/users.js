const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const passport = require('passport');

// Validators 
const validateRegister = require('../../validation/register');
const validateLogin = require('../../validation/login');

/**
 * @route GET api/users/register
 * @desc Register user
 * @access Public
 */
router.post('/register', (req, res) => {

    // Make validation
    const { errors, isValid } = validateRegister(req.body);
    if (!isValid) return res.status(400).json({ errors });

    User.findOne({ email: req.body.email })
        .then(user => {

            if (user) {
                errors.email = "Email already exists";
                return res.status(400).json(errors);
            }
            const avatar = gravatar.url(req.body.email, {
                s: '100', // Size
                r: 'pg', // Rating 
                d: 'mm', // Default
            })
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            res.json(user);
                        })
                        .catch(err => console.log(err));
                })
            })
        })
});

/**
 * @route GET api/users/login
 * @desc Login user / Return a jwt token
 * @access Public
 */
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Make validation
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) return res.status(400).json({ errors });

    // Find user by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = "Email not found";
                return res.status(404).json(errors);
            };
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            // TODO: Below might not be needed
                            name: user.name,
                            avatar: user.avatar
                        }
                        return res.json({
                            success: true,
                            token: `Bearer ${jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })}`
                        })
                    }
                    errors.password = "Password does not match";
                    return res.json(errors);
                })
        })
        .catch(err => console.log(err));
});

/**
 * @route GET api/users/current
 * @desc Return current user
 * @access Private
 */

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;