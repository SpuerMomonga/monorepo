import 'reflect-metadata'

async function startup() {
  const { app } = await import('electron')
  const { Container } = await import('inversify')

  const container = new Container()
  container.load()

  async function start() {

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
