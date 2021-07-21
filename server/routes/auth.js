const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const User = require('../models/User')

// REGISTER
router.post('/register', async (req, res) => {
    const {username, email , password} = req.body

    //Simple Validation
    if (!username || !password || !email) {
        return res.status(400).json({success: false, message: 'Missing username and/or password!'})
    }

    try {
        // Check for existing user
        const user = await User.findOne({username})

        if (user) {
            return res.status(400).json({success: false, message: 'Username already taken'})
        }

        // All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({username, email, password: hashedPassword})
        await newUser.save()

        res.status(200).json({success: true, message: 'User created successfully', newUser})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    const {email, password} = req.body

    //Simple Validation
    if (!email || !password) {
        return res.status(400).json({success: false, message: 'Missing email and/or password!'})
    }

    try {
        // Check for existing user
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: 'Incorrect email or password!'})
        }

        // Email found
        const passwordValid = await argon2.verify(user.password, password)

        if (!passwordValid) {
            return res.status(400).json({success: false, message: 'Incorrect username or password!'})
        }

        // All good
        res.status(200).json({success: true, message: 'User Logged in Successfully', user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

module.exports = router