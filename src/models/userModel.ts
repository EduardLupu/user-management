import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/dbConnection'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
class User extends Model {
  public id!: number
  public name!: string
  public email!: string
  public password!: string
  // public readonly createdAt!: Date
  // public readonly updatedAt!: Date

  public generateAuthToken() {
    return jwt.sign(
      {
        id: this.id,
        name: this.name,
        email: this.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize, // Pass the sequelize instance
    timestamps: true,
    underscored: true,
  }
)

User.beforeSave(async (user: User) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10)
  }
})

export default User;