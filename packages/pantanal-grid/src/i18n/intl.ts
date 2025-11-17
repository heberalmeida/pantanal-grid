export interface DateFieldNameOptions {
  type?: 'day' | 'dayperiod' | 'era' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'weekday' | 'year' | 'zone'
  nameType?: 'long' | 'short' | 'narrow'
  standalone?: boolean
}

export interface DateFormatNameOptions {
  type?: 'days' | 'months' | 'quarters'
  nameType?: 'long' | 'short' | 'narrow'
  standalone?: boolean
}

export interface DateFormatOptions {
  pattern?: string
  skeleton?: string
  date?: 'short' | 'medium' | 'long' | 'full'
  time?: 'short' | 'medium' | 'long' | 'full'
  datetime?: 'short' | 'medium' | 'long' | 'full'
  calendar?: string
}

export interface NumberFormatOptions {
  style?: 'decimal' | 'currency' | 'percent' | 'unit'
  currency?: string
  currencyDisplay?: 'symbol' | 'code' | 'name' | 'narrowSymbol'
  minimumIntegerDigits?: number
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  useGrouping?: boolean
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
  compactDisplay?: 'short' | 'long'
}

export interface DateFormatPart {
  pattern: string
  type: string
  value?: string
}

export class IntlService {
  private locale: string

  constructor(locale: string) {
    this.locale = locale
  }

  dateFieldName(options: DateFieldNameOptions): string {
    const { type = 'day', nameType = 'long' } = options
    const date = new Date(2024, 0, 1)
    
    const formatOptions: Intl.DateTimeFormatOptions = {}
    if (type === 'day' || type === 'weekday') {
      formatOptions.weekday = nameType
    } else if (type === 'month') {
      formatOptions.month = nameType
    } else if (type === 'year') {
      formatOptions.year = 'numeric'
    } else if (type === 'hour') {
      formatOptions.hour = 'numeric'
    } else if (type === 'minute') {
      formatOptions.minute = 'numeric'
    } else if (type === 'second') {
      formatOptions.second = 'numeric'
    }
    
    const formatter = new Intl.DateTimeFormat(this.locale, formatOptions)
    const parts = formatter.formatToParts(date)
    const targetPart = parts.find(p => p.type === type)
    return targetPart?.value || ''
  }

  dateFormatNames(options: DateFormatNameOptions): any {
    const { type = 'days', nameType = 'long' } = options
    const result: any = {}
    
    if (type === 'days') {
      const formatter = new Intl.DateTimeFormat(this.locale, {
        weekday: nameType
      })
      for (let i = 0; i < 7; i++) {
        const date = new Date(2024, 0, 7 + i)
        const formatted = formatter.formatToParts(date)
        const dayPart = formatted.find(p => p.type === 'weekday')
        result[i] = dayPart?.value || ''
      }
    } else if (type === 'months') {
      const formatter = new Intl.DateTimeFormat(this.locale, {
        month: nameType
      })
      for (let i = 0; i < 12; i++) {
        const date = new Date(2024, i, 1)
        const formatted = formatter.formatToParts(date)
        const monthPart = formatted.find(p => p.type === 'month')
        result[i] = monthPart?.value || ''
      }
    } else if (type === 'quarters') {
      for (let i = 0; i < 4; i++) {
        result[i] = `Q${i + 1}`
      }
    }
    
    return result
  }

  firstDay(): number {
    try {
      const localeData = (Intl as any).LocaleData?.(this.locale)
      if (localeData && localeData.firstDayOfWeek !== undefined) {
        return localeData.firstDayOfWeek
      }
      
      if (this.locale.startsWith('pt') || this.locale.startsWith('es')) {
        return 1
      }
      
      return 0
    } catch {
      return 0
    }
  }

  format(format: string, values: any[]): string {
    let result = format
    values.forEach((value, index) => {
      const regex = new RegExp(`\\{${index}(:[^}]+)?\\}`, 'g')
      result = result.replace(regex, (match) => {
        if (match.includes(':')) {
          const formatPart = match.match(/:(.+)\}/)?.[1]
          if (formatPart) {
            if (formatPart === 'c' || formatPart === 'C') {
              return this.formatNumber(value, { style: 'currency', currency: 'USD' })
            } else if (formatPart === 'n' || formatPart === 'N') {
              return this.formatNumber(value, { style: 'decimal' })
            } else if (formatPart === 'p' || formatPart === 'P') {
              return this.formatNumber(value * 100, { style: 'percent' })
            } else if (formatPart === 'd') {
              return this.formatDate(value, 'short')
            }
          }
        }
        return String(value)
      })
    })
    return result
  }

  formatDate(value: Date, format?: string | DateFormatOptions): string {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return ''
    }
    
    if (typeof format === 'string') {
      if (format === 'short') {
        return new Intl.DateTimeFormat(this.locale, { dateStyle: 'short' }).format(value)
      } else if (format === 'medium') {
        return new Intl.DateTimeFormat(this.locale, { dateStyle: 'medium' }).format(value)
      } else if (format === 'long') {
        return new Intl.DateTimeFormat(this.locale, { dateStyle: 'long' }).format(value)
      } else if (format === 'full') {
        return new Intl.DateTimeFormat(this.locale, { dateStyle: 'full' }).format(value)
      } else {
        return new Intl.DateTimeFormat(this.locale, { dateStyle: 'short' }).format(value)
      }
    } else if (typeof format === 'object' && format !== null) {
      const options: Intl.DateTimeFormatOptions = {}
      if (format.date) {
        options.dateStyle = format.date
      }
      if (format.time) {
        options.timeStyle = format.time
      }
      if (format.datetime) {
        options.dateStyle = format.datetime
        options.timeStyle = format.datetime
      }
      if (format.pattern) {
        return this.formatDateWithPattern(value, format.pattern)
      }
      return new Intl.DateTimeFormat(this.locale, options).format(value)
    }
    
    return new Intl.DateTimeFormat(this.locale, { dateStyle: 'short' }).format(value)
  }

  private formatDateWithPattern(date: Date, pattern: string): string {
    const formatOptions: Intl.DateTimeFormatOptions = {}
    
    if (pattern.includes('yyyy') || pattern.includes('YYYY')) {
      formatOptions.year = 'numeric'
    } else if (pattern.includes('yy') || pattern.includes('YY')) {
      formatOptions.year = '2-digit'
    }
    
    if (pattern.includes('MMMM')) {
      formatOptions.month = 'long'
    } else if (pattern.includes('MMM')) {
      formatOptions.month = 'short'
    } else if (pattern.includes('MM')) {
      formatOptions.month = '2-digit'
    } else if (pattern.includes('M')) {
      formatOptions.month = 'numeric'
    }
    
    if (pattern.includes('dd') || pattern.includes('DD')) {
      formatOptions.day = '2-digit'
    } else if (pattern.includes('d') || pattern.includes('D')) {
      formatOptions.day = 'numeric'
    }
    
    if (pattern.includes('HH') || pattern.includes('hh')) {
      formatOptions.hour = '2-digit'
      formatOptions.hour12 = pattern.includes('hh')
    } else if (pattern.includes('H') || pattern.includes('h')) {
      formatOptions.hour = 'numeric'
      formatOptions.hour12 = pattern.includes('h')
    }
    
    if (pattern.includes('mm')) {
      formatOptions.minute = '2-digit'
    } else if (pattern.includes('m')) {
      formatOptions.minute = 'numeric'
    }
    
    if (pattern.includes('ss')) {
      formatOptions.second = '2-digit'
    } else if (pattern.includes('s')) {
      formatOptions.second = 'numeric'
    }
    
    const formatter = new Intl.DateTimeFormat(this.locale, formatOptions)
    return formatter.format(date)
  }

  formatNumber(value: number, format: string | NumberFormatOptions): string {
    if (typeof format === 'string') {
      if (format === 'c' || format === 'C') {
        return new Intl.NumberFormat(this.locale, { style: 'currency', currency: 'USD' }).format(value)
      } else if (format === 'n' || format === 'N') {
        return new Intl.NumberFormat(this.locale, { style: 'decimal' }).format(value)
      } else if (format === 'p' || format === 'P') {
        return new Intl.NumberFormat(this.locale, { style: 'percent' }).format(value)
      } else {
        return new Intl.NumberFormat(this.locale).format(value)
      }
    } else {
      return new Intl.NumberFormat(this.locale, format).format(value)
    }
  }

  numberSymbols(): any {
    const formatter = new Intl.NumberFormat(this.locale)
    const parts = formatter.formatToParts(1234.56)
    const symbols: any = {}
    
    parts.forEach(part => {
      if (part.type === 'decimal') {
        symbols.decimal = part.value
      } else if (part.type === 'group') {
        symbols.group = part.value
      } else if (part.type === 'currency') {
        symbols.currency = part.value
      }
    })
    
    const currencyFormatter = new Intl.NumberFormat(this.locale, { style: 'currency', currency: 'USD' })
    const currencyParts = currencyFormatter.formatToParts(1234.56)
    const currencySymbol = currencyParts.find(p => p.type === 'currency')?.value
    if (currencySymbol) {
      symbols.currency = currencySymbol
    }
    
    return symbols
  }

  parseDate(value: string, format?: string | DateFormatOptions | (string | DateFormatOptions)[]): Date {
    if (Array.isArray(format)) {
      for (const fmt of format) {
        try {
          const parsed = this.parseDateWithFormat(value, fmt)
          if (!isNaN(parsed.getTime())) {
            return parsed
          }
        } catch {
          continue
        }
      }
      return new Date(value)
    }
    
    if (format) {
      return this.parseDateWithFormat(value, format)
    }
    
    return new Date(value)
  }

  private parseDateWithFormat(value: string, format: string | DateFormatOptions): Date {
    if (typeof format === 'string') {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    return new Date(value)
  }

  parseNumber(value: string): number {
    if (!value || typeof value !== 'string') {
      return 0
    }
    
    const symbols = this.numberSymbols()
    const groupSeparator = symbols.group || ','
    const decimalSeparator = symbols.decimal || '.'
    
    let cleaned = value.trim()
    
    if (groupSeparator && cleaned.includes(groupSeparator)) {
      cleaned = cleaned.replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    }
    
    if (decimalSeparator && cleaned.includes(decimalSeparator)) {
      cleaned = cleaned.replace(decimalSeparator, '.')
    }
    
    cleaned = cleaned.replace(/[^\d.\-+Ee]/g, '')
    
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  splitDateFormat(format: string | DateFormatOptions): DateFormatPart[] {
    if (typeof format === 'object' && format !== null && format.pattern) {
      return this.splitPattern(format.pattern)
    }
    
    if (typeof format === 'string') {
      return this.splitPattern(format)
    }
    
    return []
  }

  private splitPattern(pattern: string): DateFormatPart[] {
    const parts: DateFormatPart[] = []
    let i = 0
    
    while (i < pattern.length) {
      const char = pattern[i]
      
      if (char === 'y' || char === 'Y') {
        let count = 0
        while (i < pattern.length && (pattern[i] === 'y' || pattern[i] === 'Y')) {
          count++
          i++
        }
        parts.push({ pattern: char.repeat(count), type: 'year', value: char.repeat(count) })
      } else if (char === 'M') {
        let count = 0
        while (i < pattern.length && pattern[i] === 'M') {
          count++
          i++
        }
        parts.push({ pattern: char.repeat(count), type: 'month', value: char.repeat(count) })
      } else if (char === 'd' || char === 'D') {
        let count = 0
        const baseChar = char
        while (i < pattern.length && (pattern[i] === 'd' || pattern[i] === 'D')) {
          count++
          i++
        }
        parts.push({ pattern: baseChar.repeat(count), type: 'day', value: baseChar.repeat(count) })
      } else if (char === 'h' || char === 'H') {
        let count = 0
        while (i < pattern.length && (pattern[i] === 'h' || pattern[i] === 'H')) {
          count++
          i++
        }
        parts.push({ pattern: char.repeat(count), type: 'hour', value: char.repeat(count) })
      } else if (char === 'm') {
        let count = 0
        while (i < pattern.length && pattern[i] === 'm') {
          count++
          i++
        }
        parts.push({ pattern: char.repeat(count), type: 'minute', value: char.repeat(count) })
      } else if (char === 's') {
        let count = 0
        while (i < pattern.length && pattern[i] === 's') {
          count++
          i++
        }
        parts.push({ pattern: char.repeat(count), type: 'second', value: char.repeat(count) })
      } else {
        let literal = ''
        while (i < pattern.length && !['y', 'Y', 'M', 'd', 'D', 'h', 'H', 'm', 's'].includes(pattern[i])) {
          literal += pattern[i]
          i++
        }
        if (literal) {
          parts.push({ pattern: literal, type: 'literal', value: literal })
        }
      }
    }
    
    return parts
  }

  toString(value: any, format: any): string {
    if (value instanceof Date) {
      return this.formatDate(value, format)
    }
    
    if (typeof value === 'number') {
      return this.formatNumber(value, format)
    }
    
    if (typeof format === 'string') {
      return this.format(format, [value])
    }
    
    return String(value)
  }
}

