import type { Locale, Messages } from '../types'

export const defaultMsgs: Record<Locale, Messages> = {
  pt: {
    total: 'Total',
    page: 'Página',
    rowsPerPage: 'Linhas por página',
    previous: 'Anterior',
    next: 'Próxima',
    filterPlaceholder: 'Filtrar',
    selectAll: 'Selecionar todos',
  },
  en: {
    total: 'Total',
    page: 'Page',
    rowsPerPage: 'Rows per page',
    previous: 'Previous',
    next: 'Next',
    filterPlaceholder: 'Filter',
    selectAll: 'Select all',
  },
  es: {
    total: 'Total',
    page: 'Página',
    rowsPerPage: 'Filas por página',
    previous: 'Anterior',
    next: 'Siguiente',
    filterPlaceholder: 'Filtrar',
    selectAll: 'Seleccionar todos',
  },
}
