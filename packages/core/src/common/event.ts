import type { Disposable, DisposableGroup } from './disposable'

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: DisposableGroup): Disposable
}
