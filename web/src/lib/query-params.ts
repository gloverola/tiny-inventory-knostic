interface QueryParamsOptions {
  [key: string]: string | number | boolean | null | undefined
}

export function createParams(params: QueryParamsOptions): string {
  const queryParams: string[] = []

  Object.entries(params).forEach(([key, value]) => {
    // Skip null, undefined, empty strings, and 'none' values
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      value !== 'none'
    ) {
      queryParams.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
    }
  })

  return queryParams.join('&')
}

export function createUrlWithParams(
  baseUrl: string,
  params: QueryParamsOptions
): string {
  const queryString = createParams(params)
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
