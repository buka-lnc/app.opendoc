import { getSingletonHighlighter } from 'shiki'
import { latte, macchiato } from '@catppuccin/vscode'

export async function loadShikiThemes (): Promise<void> {
  const highlighter = await getSingletonHighlighter()
  highlighter.loadTheme(macchiato as any)
  highlighter.loadTheme(latte as any)
}
