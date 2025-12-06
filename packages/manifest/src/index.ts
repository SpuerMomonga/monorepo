import * as z from 'zod'

export const Command = z.object({
  command: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
})

export type Command = z.infer<typeof Command>

export const ExtensionManifest = z.object({})

export type ExtensionManifest = z.infer<typeof ExtensionManifest>
