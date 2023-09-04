import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './src/routes/userRoutes'
import { connectToDatabase } from './src/config/dbConnection'

dotenv.config()

connectToDatabase().then(() => {
  console.log('Connection has been established successfully.')
})

const app = express(),
  port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use('/api', userRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
