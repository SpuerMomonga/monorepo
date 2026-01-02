import { Container } from 'inversify'
import { Application } from './application'
import { HelloWorld } from './hello-world'
import 'reflect-metadata'

(async () => {
  const container = new Container()

  container.bind(HelloWorld).toSelf().inSingletonScope()
  container.bind(Application).toSelf().inSingletonScope()

  try {
    await start()
  } catch (error) {
    console.error('Failed to start the frontend application.')
    if (error) {
      console.error(error)
    }
  }

  function start() {
    return container.get(Application).start()
  }
})()
