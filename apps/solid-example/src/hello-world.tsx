import type { JSX } from 'solid-js'
import { injectable } from 'inversify'
import { createSignal } from 'solid-js'
import { SolidWidget } from './solid-widget'

@injectable()
export class HelloWorld extends SolidWidget {
  constructor() {
    super()
  }

  protected render(): JSX.Element {
    return <MyComponents />
  }
}

function MyComponents() {
  const [count, setCount] = createSignal(0)

  return (
    <div>
      <h1>hello world</h1>
      <div>{count()}</div>
      <button on:click={() => setCount(prev => prev + 1)}>Increment</button>
    </div>
  )
}
