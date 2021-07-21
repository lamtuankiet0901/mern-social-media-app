const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const conversationRoute = require('./routes/conversations')
const messageRoute = require('./routes/messages')
const multer = require('multer')
const path = require("path")

dotenv.config();

const app = express()
const URI = process.env.DATABASE_URL
PORT = process.env.PORT || 5000

const connectDB = async () => {
    try {
        mongoose.connect(URI, {
            useCreateIndex: true,
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log("Connect MongoDB successful!")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

const upload = multer({storage});

app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        res.status(200).json("File uploaded successfully")
    } catch (error) {
        console.log(error)
    }
})

// Route
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/messages', messageRoute)

app.get('/user', (req, res) => {
    res.send('Welcome to user page')
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})