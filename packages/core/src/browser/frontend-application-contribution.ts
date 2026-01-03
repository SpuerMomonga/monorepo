import type { MaybePromise } from '../common/types'
import type { FrontendApplication } from './frontend-application'

export const FrontendApplicationContribution = Symbol('FrontendApplicationContribution')
export interface FrontendApplicationContribution {
  initialize?: () => void
  configure?: (app: FrontendApplication) => MaybePromise<void>
  onStart?: (app: FrontendApplication) => MaybePromise<void>
  onWillStop?: (app: FrontendApplication) => boolean
  onStop?: (app: FrontendApplication) => void
  initializeLayout?: (app: FrontendApplication) => MaybePromise<void>
  onDidInitializeLayout?: (app: FrontendApplication) => MaybePromise<void>
}
