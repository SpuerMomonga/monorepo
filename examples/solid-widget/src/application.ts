import { Widget } from '@lumino/widgets'
import { inject, injectable } from 'inversify'
import { HelloWorld } from './hello-world'

@injectable()
export class Application {
  constructor(@inject(HelloWorld) protected helloWorld: HelloWorld) {}

  protected getHost(): Promise<HTMLElement> {
    if (document.body) {
      return Promise.resolve(document.body)
    }
    return new Promise<HTMLElement>(resolve =>
      window.addEventListener('load', () => resolve(document.body), { once: true }),
    )
  }

  async start(): Promise<void> {
    const host = await this.getHost()
    Widget.attach(this.helloWorld, host)
  }
}
