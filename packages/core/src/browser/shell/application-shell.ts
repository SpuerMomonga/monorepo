import { Widget } from '@lumino/widgets'
import { injectable, postConstruct } from 'inversify'

@injectable()
export class ApplicationShell extends Widget {
  constructor() {
    super({})
  }

  @postConstruct()
  protected init() {
    this.initializeShell()
  }

  protected initializeShell() {
    this.addClass('raykit-application-shell')
  }
}
