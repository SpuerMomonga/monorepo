import { Widget } from '@lumino/widgets'
import { inject, injectable, named } from 'inversify'
import { ContributionProvider } from '../common/contribution-provider'
import { FrontendApplicationContribution } from './frontend-application-contribution'
import { ApplicationShell } from './shell'

@injectable()
export class FrontendApplication {
  constructor(
    @inject(ContributionProvider) @named(FrontendApplicationContribution)
    protected readonly contributions: ContributionProvider<FrontendApplicationContribution>,
    @inject(ApplicationShell) protected readonly _shell: ApplicationShell,
  ) { }

  get shell(): ApplicationShell {
    return this._shell
  }

  /**
   * Start the frontend application.
   */
  async startup(): Promise<void> {
    await this.startContributions()

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

  protected async startContributions(): Promise<void> {
    for (const contribution of this.contributions.getContributions()) {
      if (contribution.initialize) {
        try {
          contribution.initialize()
        } catch (error) {
          console.error('Could not initialize contribution', error)
        }
      }
    }
  }
}
