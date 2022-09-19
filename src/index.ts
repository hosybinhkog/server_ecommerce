import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const main = async() => {
  const app = express()
  app.use(cors({
    origin: 'http://localhost:6969',
    credentials: true
  }))
  app.use(morgan('tiny'))
  app.use(helmet())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser());
}