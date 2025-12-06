import { isFunction, isObject } from '@monorepo/util'

export interface Disposable {
  dispose: () => void
}

export namespace Disposable {
  export function is(arg: unknown): arg is Disposable {
    return isObject<Disposable>(arg) && isFunction(arg.dispose)
  }
  export function create(func: () => void): Disposable {
    return { dispose: func }
  }
  /** Always provides a reference to a new disposable. */
  export declare const NULL: Disposable
}

export type DisposableGroup = { push: (disposable: Disposable) => void } | { add: (disposable: Disposable) => void }
