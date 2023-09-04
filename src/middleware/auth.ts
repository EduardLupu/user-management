
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

export const checkAuthentification = (req: Request, res: Response, next: any) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      req.body.user = decoded

      next()
    })
  }
  catch (error) {
    console.error(error)
    res.status(500).json({message: `Server Error: ${error}`})
  }
}