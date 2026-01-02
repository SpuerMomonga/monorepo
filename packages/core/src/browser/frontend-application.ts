import { Widget } from '@lumino/widgets'
import { inject, injectable } from 'inversify'
import { ApplicationShell } from './shell'

@injectable()
export class FrontendApplication {
  constructor(
    @inject(ApplicationShell) protected readonly _shell: ApplicationShell,
  ) { }

  get shell(): ApplicationShell {
    return this._shell
  }

  /**
   * Start the frontend application.
   */
  async startup(): Promise<void> {
    const host = await this.getHost()
    this.attachShell(host)
  }

  protected getHost(): Promise<HTMLElement> {
    if (document.body) {
      return Promise.resolve(document.body)
    }
    return new Promise<HTMLElement>(resolve =>
      window.addEventListener('load', () => resolve(document.body), { once: true }),
    )
  }

  protected attachShell(host: HTMLElement): void {
    Widget.attach(this.shell, host)
  }
}
