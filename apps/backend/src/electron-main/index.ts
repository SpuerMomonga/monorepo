import { ContainerModule } from 'inversify'
import { ElectronMainApplication } from './electronMainApplication'

export default new ContainerModule((options) => {
  options.bind(ElectronMainApplication).toSelf().inSingletonScope()
})
