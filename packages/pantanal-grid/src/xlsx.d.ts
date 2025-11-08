/**
 * Type declarations for the optional xlsx module
 * This allows the xlsx library to be used as an optional peer dependency
 */

declare module 'xlsx' {
  export interface WorkBook {
    SheetNames: string[]
    Sheets: { [sheet: string]: WorkSheet }
  }

  export interface WorkSheet {
    [cell: string]: CellObject | any
    '!ref'?: string
    '!cols'?: ColInfo[]
    '!rows'?: RowInfo[]
    '!merges'?: Range[]
    '!autofilter'?: { ref: string }
  }

  export interface CellObject {
    t: 'n' | 's' | 'b' | 'd' | 'e'
    v: any
    w?: string
    f?: string
    r?: string
    h?: string
    c?: string
    z?: string
    l?: Hyperlink
    s?: any
  }

  export interface ColInfo {
    wch?: number
    width?: number
    wpx?: number
    hidden?: boolean
  }

  export interface RowInfo {
    hpt?: number
    hpx?: number
    hidden?: boolean
  }

  export interface Range {
    s: { c: number; r: number }
    e: { c: number; r: number }
  }

  export interface Hyperlink {
    Target: string
    Tooltip?: string
  }

  export interface ParsingOptions {
    type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string'
    cellText?: boolean
    cellDates?: boolean
    sheetStubs?: boolean
    sheetRows?: number
    bookType?: BookType
    bookSheets?: boolean
    bookVBA?: boolean
    password?: string
    WTF?: boolean
  }

  export interface WritingOptions {
    type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string'
    cellDates?: boolean
    bookSST?: boolean
    bookType?: BookType
    compression?: boolean
    Props?: Properties
    themeXLSX?: any
    ignoreEC?: boolean
    numbers?: any
  }

  export interface Properties {
    Title?: string
    Subject?: string
    Author?: string
    Manager?: string
    Company?: string
    Category?: string
    Keywords?: string
    Comments?: string
    LastAuthor?: string
    CreatedDate?: Date
  }

  export type BookType = 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'csv' | 'txt' | 'sylk' | 'html' | 'dif' | 'dbf' | 'rtf' | 'prn' | 'eth' | 'ods' | 'fods' | 'uos' | 'biff2' | 'biff3' | 'biff4' | 'biff5' | 'biff8' | 'numbers' | 'qpw' | 'wk1' | 'wk3' | 'wk4' | 'wks' | '123'

  export const utils: {
    aoa_to_sheet<T = any>(data: T[][], opts?: any): WorkSheet
    sheet_add_aoa<T = any>(ws: WorkSheet, data: T[][], opts?: any): WorkSheet
    sheet_to_json<T = any>(worksheet: WorkSheet, opts?: any): T[]
    sheet_to_csv(worksheet: WorkSheet, opts?: any): string
    sheet_to_txt(worksheet: WorkSheet, opts?: any): string
    sheet_to_html(worksheet: WorkSheet, opts?: any): string
    sheet_to_formulae(worksheet: WorkSheet): string[]
    json_to_sheet<T = any>(data: T[], opts?: any): WorkSheet
    book_new(): WorkBook
    book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name?: string): void
    book_set_sheet_visibility(workbook: WorkBook, sheet: number | string, visibility: number): void
    encode_cell(cell: { c: number; r: number }): string
    encode_range(range: Range): string
    decode_cell(cell: string): { c: number; r: number }
    decode_range(range: string): Range
    format_cell(cell: CellObject, v?: any, opts?: any): string
    parse_date_code(d: number, opts?: any): Date | null
    SSF: any
  }

  export function read(data: any, opts?: ParsingOptions): WorkBook
  export function readFile(filename: string, opts?: ParsingOptions): WorkBook
  export function write(workbook: WorkBook, opts?: WritingOptions): any
  export function writeFile(workbook: WorkBook, filename: string, opts?: WritingOptions): void
  export function writeFileAsync(filename: string, workbook: WorkBook, opts: WritingOptions, cb: (err?: Error) => void): void

  const XLSX: {
    read: typeof read
    readFile: typeof readFile
    write: typeof write
    writeFile: typeof writeFile
    writeFileAsync: typeof writeFileAsync
    utils: typeof utils
    version: string
  }

  export default XLSX
}

