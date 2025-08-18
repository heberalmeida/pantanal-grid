import type { Locale, Messages } from '../types'

const builtInMsgs: Record<'pt' | 'en' | 'es', Messages> = {
   pt: {
    total: 'Total',
    page: 'Página',
    rowsPerPage: 'Linhas por página',
    previous: 'Anterior',
    next: 'Próxima',
    filterPlaceholder: 'Filtrar',
    selectAll: 'Selecionar todos',
    expandAll: 'expandir tudo', 
    collapseAll: 'recolher tudo', 
    subtotal: 'Subtotal'
  },
  en: {
    total: 'Total',
    page: 'Page',
    rowsPerPage: 'Rows per page',
    previous: 'Previous',
    next: 'Next',
    filterPlaceholder: 'Filter',
    selectAll: 'Select all',
    expandAll: 'expand all', 
    collapseAll: 'collapse all', 
    subtotal: 'Subtotal'
  },
  es: {
    total: 'Total',
    page: 'Página',
    rowsPerPage: 'Filas por página',
    previous: 'Anterior',
    next: 'Siguiente',
    filterPlaceholder: 'Filtrar',
    selectAll: 'Seleccionar todos',
    expandAll: 'expandir todo', 
    collapseAll: 'colapsar todo', 
    subtotal: 'Subtotal'
  },
 }

const runtimeMsgs: Record<string, Partial<Messages>> = {}

export function registerLocale(locale: string, messages: Partial<Messages>) {
  runtimeMsgs[locale] = { ...(runtimeMsgs[locale] || {}), ...messages }
}

export function getMessages(locale: string, overrides?: Partial<Messages>): Messages {
  const base = builtInMsgs['en']
  const maybeBuiltIn = (builtInMsgs as any)[locale] as Messages | undefined
  return {
    ...base,
    ...(maybeBuiltIn || {}),
    ...(runtimeMsgs[locale] || {}),
    ...(overrides || {}),
  }
}

export const defaultMsgs = builtInMsgs