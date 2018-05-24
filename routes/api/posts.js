const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const ValidatePostInput = require('../../validation/post');

//@route    GET api/posts/test
//@desc     Tests posts route
//@access   Public
router.get('/test', (req, res) => res.json({msg: 'Posts Works'}));

//@route    GET api/posts
//@desc     Get posts
//@access   Public
router.get('/', (req, res) => {
    Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
        nopostsfound: 'No posts found'
    }));
});

//@route    GET api/posts/:id
//@desc     Get posts by id
//@access   Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({
        nopostfound: 'No post find for that id'
    }));
});

//@route    POST api/posts
//@desc     Create post
//@access   Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);

    // check validation
    if(!isValid){
        // if any errors, send 400 with errors
        return res.status(400).json(errors);
    }

    const NewPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    NewPost.save().then(post => res.json(post));
});

//@route    DELETE api/posts/:id
//@desc     Delete post
//@access   Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            // check for post owner
            if(post.user.toString() !== req.user.id){
                return res.status(401).json({ notauthorized: 'user not authorized'});
            }

            // Delete
            post.remove().then(() => res.json({ success: true}));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
    })
});

//@route    POST api/posts/like/:id
//@desc     Like post
//@access   Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ alreadyliked: 'User already liked this post'});
            }
            // add the user id to the likes array
            post.likes.unshift({user: req.user.id});

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
    })
});

//@route    POST api/posts/unlike/:id
//@desc     UnLike post
//@access   Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json({ notliked: 'You have not yet liked this post'});
            }
            // Get remove index
            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

            // splice out of array
            post.likes.splice(removeIndex, 1);

            // save it
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
    })
});

//@route    POST api/posts/comment/:id
//@desc     Add comment to post
//@access   Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);

    // check validation
    if(!isValid){
        // if any errors, send 400 with errors
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
    .then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        // add comments array
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Remove comment from post
//@access   Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        // check to see if the comment exists
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({ commentnotexists: 'Comment does not exists' });
        }
        // get remove index
        const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

        // splice out of array
        post.comments.splice(removeIndex, 1);
        //save post
        post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;