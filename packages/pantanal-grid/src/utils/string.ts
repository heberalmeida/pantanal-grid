/**
 * Normalizes and cleans string values that may contain HTML entities or incorrectly escaped characters
 */

/**
 * Decodes HTML entities in a string
 * @param str - The string to decode
 * @returns The decoded string
 */
export function decodeHtmlEntities(str: string): string {
  if (typeof str !== 'string') return str
  
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    // Fallback for SSR: decode common entities manually
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x60;/g, '`')
      .replace(/&#x3D;/g, '=')
  }
  
  // Create a temporary DOM element to decode entities
  const textarea = document.createElement('textarea')
  textarea.innerHTML = str
  return textarea.value
}

/**
 * Normalizes quote characters in a string
 * Converts various quote types to standard single or double quotes
 * @param str - The string to normalize
 * @param preferSingle - If true, prefers single quotes, otherwise double quotes
 * @returns The normalized string
 */
export function normalizeQuotes(str: string, preferSingle = true): string {
  if (typeof str !== 'string') return str
  
  // Map of various quote characters to standard quotes
  // Using Unicode escapes to avoid parsing issues
  const quoteMap: Record<string, string> = preferSingle
    ? {
        '\u201C': "'", // Left double quotation mark “
        '\u201D': "'", // Right double quotation mark ”
        '\u201E': "'", // Double low-9 quotation mark „
        '\u2018': "'", // Left single quotation mark '
        '\u2019': "'", // Right single quotation mark '
        '"': "'",      // Straight double quote
      }
    : {
        '\u2018': '"', // Left single quotation mark '
        '\u2019': '"', // Right single quotation mark '
        '\u201A': '"', // Single low-9 quotation mark ‚
        "'": '"',      // Straight single quote
      }
  
  let result = str
  Object.entries(quoteMap).forEach(([from, to]) => {
    result = result.replace(new RegExp(from, 'g'), to)
  })
  
  return result
}

/**
 * Cleans a string value by:
 * - Decoding HTML entities
 * - Normalizing quotes
 * - Fixing common encoding issues
 * @param value - The value to clean (can be string, number, object, array, etc.)
 * @param options - Options for cleaning
 * @returns The cleaned value
 */
export function cleanStringValue(
  value: any,
  options: {
    decodeEntities?: boolean
    normalizeQuotes?: boolean
    preferSingleQuotes?: boolean
    deep?: boolean // If true, recursively clean objects and arrays
  } = {}
): any {
  const {
    decodeEntities = true,
    normalizeQuotes: shouldNormalizeQuotes = true,
    preferSingleQuotes = true,
    deep = false,
  } = options

  // Handle null/undefined
  if (value == null) return value

  // Handle strings
  if (typeof value === 'string') {
    let result = value
    
    if (decodeEntities) {
      result = decodeHtmlEntities(result)
    }
    
    if (shouldNormalizeQuotes) {
      result = normalizeQuotes(result, preferSingleQuotes)
    }
    
    return result
  }

  // Handle arrays (if deep mode)
  if (deep && Array.isArray(value)) {
    return value.map(item => cleanStringValue(item, options))
  }

  // Handle objects (if deep mode)
  if (deep && typeof value === 'object' && value !== null && !(value instanceof Date)) {
    const cleaned: Record<string, any> = {}
    Object.keys(value).forEach(key => {
      const cleanedKey = typeof key === 'string' 
        ? cleanStringValue(key, { ...options, deep: false })
        : key
      cleaned[cleanedKey] = cleanStringValue((value as Record<string, any>)[key], options)
    })
    return cleaned
  }

  // Return as-is for other types (numbers, dates, etc.)
  return value
}

/**
 * Deep cleans all string values in an object or array
 * Useful for cleaning data received from APIs or user input
 * @param data - The data to clean
 * @returns The cleaned data
 */
export function deepCleanStrings(data: any): any {
  return cleanStringValue(data, {
    decodeEntities: true,
    normalizeQuotes: true,
    preferSingleQuotes: true,
    deep: true,
  })
}

/**
 * Cleans a single string value (non-recursive)
 * Quick helper for cleaning individual strings
 * @param str - The string to clean
 * @returns The cleaned string
 */
export function cleanString(str: string): string {
  return cleanStringValue(str, {
    decodeEntities: true,
    normalizeQuotes: true,
    preferSingleQuotes: true,
    deep: false,
  }) as string
}

