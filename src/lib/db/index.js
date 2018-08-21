import admin from 'firebase-admin'
import config from '../../config'

class Db {
  static init (collection, type = false) {
    try {
      let app = null
      const appName = 'pimex-messages'

      const serviceAccount = require(`${config.keysFolder}/${config.db.keyFilename}`)

      const dbConfig = {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: serviceAccount.databaseURL
      }

      if (!admin.apps.length) {
        admin.initializeApp(dbConfig)
      }

      try {
        app = admin.app(appName)
      } catch (e) {
        admin.initializeApp(dbConfig, appName)
        admin.firestore().settings({timestampsInSnapshots: true})
      }

      app = admin.app(appName)

      if (type === 'fb') {

        const db = admin.database(app)

        return db.ref(`/${collection}`)
      }

      const db = app.firestore()

      return db.collection(collection)
    } catch (e) {
      console.error(e)
      throw new Error('Hubo un error iniciando la base de datos')
    }
  }
}

module.exports = Db
