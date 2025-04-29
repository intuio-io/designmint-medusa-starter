const BASE_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

async function fetchClient(endpoint: any, options: any) {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
    next: {
      ...options.next,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data, response }
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}

export default fetchClient
