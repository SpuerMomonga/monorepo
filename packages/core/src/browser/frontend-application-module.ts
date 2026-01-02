import { ContainerModule } from 'inversify'
import { FrontendApplication } from './frontend-application'
import { ApplicationShell } from './shell'

export const frontendApplicationModule = new ContainerModule((options) => {
  options.bind(FrontendApplication).toSelf().inSingletonScope()

  options.bind(ApplicationShell).toSelf().inSingletonScope()
})
