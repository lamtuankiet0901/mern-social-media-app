const express = require('express')
const Message = require('../models/Message')

const router = express.Router()

//add
router.post("/", async (req, res) => {
    const newMessage = await new Message(req.body)

    try {
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    } catch (error) {
        res.status(500).json(error)
    }
})


//get
router.get("/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router