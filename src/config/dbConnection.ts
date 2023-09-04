import { Sequelize } from 'sequelize'
import { options } from './config'

const sequelize = new Sequelize(
  `${options.dialect}://${options.username}:${options.password}@${options.host}/${options.database}`,
  {
    logging: false
  }
)

export async function connectToDatabase() {
  try {
    await sequelize.authenticate()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((error) => console.log('Error syncing database:', error))

export default sequelize
