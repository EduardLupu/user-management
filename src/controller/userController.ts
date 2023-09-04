import { Request, Response } from 'express'
import User from '../models/userModel'
import bcrypt from 'bcrypt'

export class UserController {
  public static async register(req: Request, res: Response) {
    try {
      const user = await User.findOne({ where: { email: req.body.email } })

      if (user) {
        return res.status(401).json({ message: 'User already exists' })
      }

      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const newUser = await User.create({ name, email, password }),
        token = newUser.generateAuthToken()

      return res.status(201).json({
        token: token
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({message: `Server Error: ${error}`});
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ message: 'Invalid e-mail' })
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid password' })
      }

      const token = user.generateAuthToken()
      return res.status(200).json({
        token: token
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({message: `Server Error: ${error}`});
    }
  }

  public static async profile(req: Request, res: Response) {
    try {
      ///console.log(req.body.user) /// You just get the same user that you get from the query, but I think this is double protection
      const user = await User.findByPk(req.body.user.id, { attributes: { exclude: ['password'] } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.status(200).json(user)
    } catch (error) {
      console.error(error)
      res.status(500).json({message: `Server Error: ${error}`});
    }
  }

  public static async updateUserInformation(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.body.user.id, { attributes: { exclude: ['password'] } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const { name, email } = req.body

      if (name) {
        user.name = name
      }
      if (email) {
        user.email = email
      }
      if (!name && !email) {
        return res.status(400).json({ message: 'At least one field should be updated.' })
      }

      await user.save()

      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
      res.status(500).json({message: `Server Error: ${error}`});
    }
  }

  public static async changePassword(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.body.user.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const { password, newPassword, confirmNewPassword } = req.body

      if (!password || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Passwords do not match' })
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid actual password' })
      }

      user.password = newPassword
      await user.save()

      return res.status(200).json({ message: 'Password changed successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({message: `Server Error: ${error}`});
    }
  }
  public static async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.body.user.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      await user.destroy()
      return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({message: `Server Error: ${error}`});
    }
  }
}
