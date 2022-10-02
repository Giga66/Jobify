import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connect.js'
import 'express-async-errors'
import morgan from 'morgan'


const app = express()
dotenv.config()

//routers

import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

//middleware

import notFoundMiddleWare from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

app.use(express.json())


app.get('/api/v1', (req, res) => {
    res.json({ msg: 'Welcome!' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()

