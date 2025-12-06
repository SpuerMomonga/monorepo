import { app } from 'electron'
import { Container } from 'inversify'
import electronMainApplicationModule from './electron-main'
import { ElectronMainApplication } from './electron-main/electronMainApplication'
import 'reflect-metadata'

async function startup() {
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(1)
  }

  const container = new Container()
  container.load(electronMainApplicationModule)

  async function start() {
    const application = container.get(ElectronMainApplication)
    await application.startup()
  }

  try {
    await start()
  } catch (error) {
    if (typeof error !== 'number') {
      console.error('Failed to start the electron application.')
      if (error) {
        console.error(error)
      }
    }
    app.quit()
  }
}

startup()
