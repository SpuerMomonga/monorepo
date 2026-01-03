import type { JSX } from 'solid-js'
import { injectable } from 'inversify'
import { createEffect, createSignal, on } from 'solid-js'
import { SolidWidget } from './solid-widget'

@injectable()
export class HelloWorld extends SolidWidget {
  private count = [0]

  constructor() {
    super()
  }

  protected onCount(count: number) {
    this.count.push(count)
  }

  protected render(): JSX.Element {
    return <MyComponents count={this.count} onCount={this.onCount.bind(this)} />
  }
}

interface MyComponentsProps {
  count: number[]
  onCount: (count: number) => void
}

function MyComponents(props: MyComponentsProps) {
  const [count, setCount] = createSignal(0)
  const [total, setTotal] = createSignal<number[]>([])

  createEffect(
    on(
      () => props.count,
      (newCount) => {
        setTotal(newCount)
      },
      { defer: true }, // 可选：延迟执行避免初始重复触发
    ),
  )

  const increment = () => {
    setCount(prev => prev + 1)
    props.onCount(count())
  }

  return (
    <div>
      <h1>hello world</h1>
      <div>
        {count()}
        -
        {total()}
      </div>
      <button on:click={increment}>Increment</button>
    </div>
  )
}
