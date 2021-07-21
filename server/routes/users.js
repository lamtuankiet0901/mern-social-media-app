const express = require('express')
const argon2 = require('argon2')
const User = require('../models/User')

const router = express.Router()

// Update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                req.body.password = await argon2.hash(req.body.password)
            } catch (error) {
                return res.status(500).json(error)
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id,{$set: req.body})
            res.status(200).json({success: true, message: "Account has been updated", user})
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})

// Delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({success: true, message: "Account has been deleted", user})
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can detele only your account")
    }
})

// Get user via ID
router.get('/', async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId ? await User.findById(userId).select('-password -updatedAt') : await User.findOne({username: username})
        res.status(200).json({success: true, message: "Selected user via ID", user})
    } catch (error) {
        return res.status(500).json(error)
    }
})

// Get friends
router.get('/friends/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId).select('_id username profilePicture')
            })
        )
        res.status(200).json(friends)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// follow a user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId} })
                await currentUser.updateOne({$push: {followings: req.params.id} })
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("You already follow this user")
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You cant follow yourself")
    }
})

// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId} })
                await currentUser.updateOne({$pull: {followings: req.params.id} })
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("You dont follow this user")
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You cant unfollow yourself")
    }
})

module.exports = router