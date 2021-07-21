const express = require('express')
const Conversation = require('../models/Conversation')

const router = express.Router()

//new conv
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation)
    } catch (error) {
        console.log(error)
    }
})

//get conv
router.get("/:userId", async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        res.status(200).json(conversations)
    } catch (error) {
        console.log(error)
    }
})

//get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] }
        })
        res.status(200).json(conversation)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router