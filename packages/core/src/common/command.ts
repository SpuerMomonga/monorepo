import type { Command } from '@monorepo/manifest'
import { injectable } from 'inversify'

export interface CommandHandler {
  execute: (...args: any[]) => any
}

export const CommandContribution = Symbol('CommandContribution')

export interface CommandContribution {
  registerCommands: (commands: CommandRegistry) => void
}

export interface CommandService {
  executeCommand: <T>(command: string, ...args: any[]) => Promise<T | undefined>

  // readonly onWillExecuteCommand: Event<WillExecuteCommandEvent>

  // readonly onDidExecuteCommand: Event<CommandEvent>
}

@injectable()
export class CommandRegistry {
  protected readonly _commands: { [command: string]: Command } = {}
  protected readonly _handlers: { [command: string]: CommandHandler[] } = {}

  registerCommand(command: Command, handler?: CommandHandler) {}

  unregisterCommand(command: Command): void
  unregisterCommand(command: string): void
  unregisterCommand(command: Command | string): void {
    console.log('unregisterCommand', command)
  }

  async executeCommand<T>(command: string, ...args: any[]): Promise<T> {}
}
