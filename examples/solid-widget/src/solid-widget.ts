import type { JSX } from 'solid-js'
import { Widget } from '@lumino/widgets'
import { render } from 'solid-js/web'

export abstract class SolidWidget extends Widget {
  constructor() {
    super({})
    render(() => this.render(), this.node)
  }

  protected abstract render(): JSX.Element
}
