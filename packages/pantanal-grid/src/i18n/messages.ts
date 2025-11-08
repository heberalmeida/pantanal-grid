import type { Messages } from '../types'

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
    subtotal: 'Subtotal',
    create: 'Criar',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    destroy: 'Excluir',
    delete: 'Excluir',
    filterAll: 'Todos',
    filterTrue: 'Sim',
    filterFalse: 'Não',
    sortBy: 'Ordenar por:',
    sortAsc: 'Crescente',
    sortDesc: 'Decrescente',
    sortNone: 'Nenhum',
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
    subtotal: 'Subtotal',
    create: 'Create',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    destroy: 'Delete',
    delete: 'Delete',
    filterAll: 'All',
    filterTrue: 'Yes',
    filterFalse: 'No',
    sortBy: 'Sort by:',
    sortAsc: 'Ascending',
    sortDesc: 'Descending',
    sortNone: 'None',
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
    subtotal: 'Subtotal',
    create: 'Crear',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    destroy: 'Eliminar',
    delete: 'Eliminar',
    filterAll: 'Todos',
    filterTrue: 'Sí',
    filterFalse: 'No',
    sortBy: 'Ordenar por:',
    sortAsc: 'Ascendente',
    sortDesc: 'Descendente',
    sortNone: 'Ninguno',
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