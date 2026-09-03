export type CommandGroup = 'start' | 'edit' | 'view' | 'output' | 'settings' | 'help'
export type CommandMenu = 'file' | 'view' | 'help'

export interface ResumeCommand {
  checked?: boolean
  description?: string
  enabled: boolean
  group: CommandGroup
  icon: string
  id: string
  keywords: string[]
  label: string
  menu?: CommandMenu
  palette?: boolean
  scope?: string
  shortcut?: string
  run: () => Promise<void> | void
}

export type ResumeCommandId = ResumeCommand['id']
