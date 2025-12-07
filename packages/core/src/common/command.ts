import type { Event } from './event'
import { isObject } from '@monorepo/util'
import { injectable } from 'inversify'
import debounce from 'p-debounce'
import { Disposable, DisposableCollection } from './disposable'
import { Emitter, WaitUntilEvent } from './event'

export interface Command {
  id: string
  title: string
  subtitle?: string
  description?: string
  icon?: string
  category?: string
}

export namespace Command {
  export function is(arg: unknown): arg is Command {
    return isObject(arg) && 'id' in arg
  }
}

export interface CommandHandler {
  execute: (...args: any[]) => any
  isEnabled?: (...args: any[]) => boolean
  onDidChangeEnabled?: Event<void>
  isVisible?: (...args: any[]) => boolean
  isToggled?: (...args: any[]) => boolean
}

export const CommandContribution = Symbol('CommandContribution')
export interface CommandContribution {
  registerCommands: (commands: CommandRegistry) => void
}

export interface CommandEvent {
  commandId: string
  args: any[]
}

export interface WillExecuteCommandEvent extends WaitUntilEvent, CommandEvent {
}

export const CommandService = Symbol('CommandService')

export interface CommandService {
  executeCommand: <T>(command: string, ...args: any[]) => Promise<T | undefined>
  readonly onWillExecuteCommand: Event<WillExecuteCommandEvent>
  readonly onDidExecuteCommand: Event<CommandEvent>
}

@injectable()
export class CommandRegistry implements CommandService {
  protected readonly _commands: { [command: string]: Command } = {}
  protected readonly _handlers: { [command: string]: CommandHandler[] } = {}

  protected readonly toUnregisterCommands = new Map<string, Disposable>()

  protected _recent: string[] = []

  protected readonly onWillExecuteCommandEmitter = new Emitter<WillExecuteCommandEvent>()
  readonly onWillExecuteCommand = this.onWillExecuteCommandEmitter.event

  protected readonly onDidExecuteCommandEmitter = new Emitter<CommandEvent>()
  readonly onDidExecuteCommand = this.onDidExecuteCommandEmitter.event

  protected readonly onCommandsChangedEmitter = new Emitter<void>()
  readonly onCommandsChanged = this.onCommandsChangedEmitter.event

  constructor() {}

  * getAllCommands(): IterableIterator<Readonly<Command & { handlers: CommandHandler[] }>> {
    for (const command of Object.values(this._commands)) {
      yield { ...command, handlers: this._handlers[command.id] ?? [] }
    }
  }

  registerCommand(command: Command, handler?: CommandHandler) {
    if (this._commands[command.id]) {
      console.warn(`A command ${command.id} is already registered.`)
      return Disposable.NULL
    }
    const toDispose = new DisposableCollection(this.doRegisterCommand(command))
    if (handler) {
      toDispose.push(this.registerHandler(command.id, handler))
    }
    this.toUnregisterCommands.set(command.id, toDispose)
    toDispose.push(Disposable.create(() => this.toUnregisterCommands.delete(command.id)))
    return toDispose
  }

  protected doRegisterCommand(command: Command): Disposable {
    this._commands[command.id] = command
    return {
      dispose: () => {
        delete this._commands[command.id]
      },
    }
  }

  unregisterCommand(command: Command): void
  unregisterCommand(id: string): void
  unregisterCommand(commandOrId: Command | string): void {
    const id = Command.is(commandOrId) ? commandOrId.id : commandOrId
    const toUnregister = this.toUnregisterCommands.get(id)
    if (toUnregister) {
      toUnregister.dispose()
    }
  }

  registerHandler(commandId: string, handler: CommandHandler): Disposable {
    let handlers = this._handlers[commandId]
    if (!handlers) {
      this._handlers[commandId] = handlers = []
    }
    handlers.unshift(handler)
    this.fireDidChange()
    return {
      dispose: () => {
        const idx = handlers.indexOf(handler)
        if (idx >= 0) {
          handlers.splice(idx, 1)
          this.fireDidChange()
        }
      },
    }
  }

  protected fireDidChange = debounce(() => this.doFireDidChange(), 0)

  protected doFireDidChange(): void {
    this.onCommandsChangedEmitter.fire()
  }

  isEnabled(command: string, ...args: any[]): boolean {
    return typeof this.getActiveHandler(command, ...args) !== 'undefined'
  }

  isVisible(command: string, ...args: any[]): boolean {
    return typeof this.getVisibleHandler(command, ...args) !== 'undefined'
  }

  isToggled(command: string, ...args: any[]): boolean {
    return typeof this.getToggledHandler(command, ...args) !== 'undefined'
  }

  async executeCommand<T>(commandId: string, ...args: any[]): Promise<T> {
    const handler = this.getActiveHandler(commandId, ...args)
    if (handler) {
      await this.fireWillExecuteCommand(commandId, args)
      const result = await handler.execute(...args)
      this.onDidExecuteCommandEmitter.fire({ commandId, args })
      return result
    }
    throw Object.assign(new Error(`The command '${commandId}' cannot be executed. There are no active handlers available for the command.`), { code: 'NO_ACTIVE_HANDLER' })
  }

  protected async fireWillExecuteCommand(commandId: string, args: any[] = []): Promise<void> {
    await WaitUntilEvent.fire(this.onWillExecuteCommandEmitter, { commandId, args }, 30000)
  }

  getVisibleHandler(commandId: string, ...args: any[]): CommandHandler | undefined {
    const handlers = this._handlers[commandId]
    if (handlers) {
      for (const handler of handlers) {
        try {
          if (!handler.isVisible || handler.isVisible(...args)) {
            return handler
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    return undefined
  }

  getActiveHandler(commandId: string, ...args: any[]): CommandHandler | undefined {
    const handlers = this._handlers[commandId]
    if (handlers) {
      for (const handler of handlers) {
        try {
          if (!handler.isEnabled || handler.isEnabled(...args)) {
            return handler
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    return undefined
  }

  getToggledHandler(commandId: string, ...args: any[]): CommandHandler | undefined {
    const handlers = this._handlers[commandId]
    if (handlers) {
      for (const handler of handlers) {
        try {
          if (handler.isToggled && handler.isToggled(...args)) {
            return handler
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    return undefined
  }

  get commands(): Command[] {
    return Object.values(this._commands)
  }

  getCommand(id: string): Command | undefined {
    return this._commands[id]
  }

  get commandIds(): string[] {
    return Object.keys(this._commands)
  }

  get recent(): Command[] {
    const commands: Command[] = []
    for (const recentId of this._recent) {
      const command = this.getCommand(recentId)
      if (command) {
        commands.push(command)
      }
    }
    return commands
  }

  set recent(commands: Command[]) {
    this._recent = Array.from(new Set(commands.map(e => e.id)))
  }

  addRecentCommand(recent: Command | Command[]): void {
    for (const recentCommand of Array.isArray(recent) ? recent : [recent]) {
      const index = this._recent.findIndex(commandId => commandId === recentCommand.id)
      if (index >= 0) {
        this._recent.splice(index, 1)
      }
      this._recent.unshift(recentCommand.id)
    }
  }

  clearCommandHistory(): void {
    this.recent = []
  }
}
