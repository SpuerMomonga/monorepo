import { FrontendApplication, frontendApplicationModule } from '@monorepo/core/browser'
import { Container } from 'inversify'
import 'reflect-metadata'
import './index.css'

(async () => {
  const container = new Container()

  container.load(frontendApplicationModule)

  try {
    await start()
  } catch (error) {
    console.error('Failed to start the frontend application.')
    if (error) {
      console.error(error)
    }
  }

  function start() {
    return container.get(FrontendApplication).startup()
  }
})()
