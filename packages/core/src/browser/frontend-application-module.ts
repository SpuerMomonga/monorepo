import { ContainerModule } from 'inversify'
import { bindContributionProvider } from '../common/contribution-provider'
import { FrontendApplication } from './frontend-application'
import { FrontendApplicationContribution } from './frontend-application-contribution'
import { ApplicationShell } from './shell'

export const frontendApplicationModule = new ContainerModule((options) => {
  options.bind(FrontendApplication).toSelf().inSingletonScope()
  bindContributionProvider(options, FrontendApplicationContribution)

  options.bind(ApplicationShell).toSelf().inSingletonScope()
})
