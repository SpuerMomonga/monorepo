import { app } from 'electron'
import { injectable } from 'inversify'

@injectable()
export class ElectronMainApplication {
  async startup(): Promise<void> {
    await app.whenReady()
  }

  async openWindow(): Promise<void> {}
}
