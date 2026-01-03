import type { Container, ContainerModuleLoadOptions, ResolutionContext, ServiceIdentifier } from 'inversify'

export const ContributionProvider = Symbol('ContributionProvider')

export interface ContributionProvider<T extends object> {
  getContributions: () => T[]
}

class ContainerBasedContributionProvider<T extends object> implements ContributionProvider<T> {
  protected services: T[] | undefined

  constructor(
    protected readonly serviceIdentifier: ServiceIdentifier<T>,
    protected readonly context: ResolutionContext,
  ) {}

  getContributions(): T[] {
    if (this.services === undefined) {
      const currentServices: T[] = []
      const ctx = this.context

      if (ctx !== null) {
        try {
          currentServices.push(...ctx.getAll(this.serviceIdentifier))
        } catch (error) {
          console.error(error)
        }
      }

      this.services = currentServices
    }

    return this.services
  }
}

export type Bindable = ContainerModuleLoadOptions | Container

export function bindContributionProvider(bindable: Bindable, id: symbol): void {
  const bindingToSyntax = bindable.bind(ContributionProvider)
  bindingToSyntax
    .toDynamicValue(ctx => new ContainerBasedContributionProvider(id, ctx))
    .inSingletonScope()
    .whenNamed(id)
}
