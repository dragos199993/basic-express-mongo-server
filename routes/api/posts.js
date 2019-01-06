const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validationPost = require('../../validation/post');

/**
 * @route GET api/posts
 * @desc Get posts
 * @access Public
 */
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

/**
 * @route GET api/posts/:id
 * @desc Get post by id
 * @access Public
 */
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: "No post found by this id" }));
});

/**
 * @route DELETE api/posts/:id
 * @desc Delete a post by id
 * @access Protected
 */

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user.toString() !== req.user.id)
                        return res.status(401).json({ notauthorized: "User not authorized" });

                    post.remove().then(() => res.json({ success: "Post deleted successfuly" }))
                })
                .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
        })
});


/**
 * @route POST api/posts/like/:id
 * @desc Like a post
 * @access Protected
 */

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
                        return res.status(400).json({ alreadyliked: "User already liked this post" });
                    post.likes.unshift({ user: req.user.id });
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
        })
});

/**
 * @route POST api/posts/unlike/:id
 * @desc Unlike a post
 * @access Protected
 */
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
                        return res.status(400).json({ notliked: "You have not yet liked this post" });
                    post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
        })
});

/**
 * @route POST api/posts/comment/:id
 * @desc Add a comment to post
 * @access Protected
 */
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const { errors, isValid } = validationPost(req.body);
    if (!isValid) return res.status(400).json({ errors });

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
            post.comments = [...post.comments, newComment];
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

/**
 * @route DELETE api/posts/comment/:id/:comment_id
 * @desc DELETE a comment from post
 * @access Protected
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // TODO: Check if the user that is trying to delete owns the comment
    // Profile.findOne({ user: req.user.id })
        // .then( profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0)
                        return res.status(404).json({ commentnotfound: "Comment does not exist"});
                    post.comments = post.comments.filter(comment => comment._id !== req.params.comment_id);
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        // })
});

/**
 * @route POST api/posts
 * @desc Create a post
 * @access Protected
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validationPost(req.body);
    if (!isValid) return res.status(400).json({ errors });

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })

    newPost.save()
        .then(post => res.json(post));
});

module.exports = router;