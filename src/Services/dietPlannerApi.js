import axios from 'axios'

const API_ROOT = 'https://tahamina1116-diet-planner.hf.space/gradio_api/call'

const dietPlannerClient = axios.create({
  baseURL: API_ROOT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const coerceText = (value) => {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(coerceText).filter(Boolean).join('\n')
  }

  if (typeof value === 'object') {
    const prioritizedKeys = ['text', 'result', 'data', 'output', 'message', 'value']

    for (const key of prioritizedKeys) {
      if (key in value) {
        const nestedText = coerceText(value[key])

        if (nestedText) {
          return nestedText
        }
      }
    }

    return Object.values(value).map(coerceText).filter(Boolean).join('\n')
  }

  return String(value)
}

const parseSseData = (rawData) => {
  const trimmed = String(rawData ?? '').trim()

  if (!trimmed) {
    return ''
  }

  try {
    return coerceText(JSON.parse(trimmed)) || trimmed
  } catch {
    return trimmed
  }
}

const parseSseBlock = (block) => {
  const lines = String(block ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')

  let eventName = 'message'
  const dataLines = []

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim()
      continue
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^\s/, ''))
    }
  }

  return {
    eventName,
    data: dataLines.join('\n'),
  }
}

const readCompletionStream = async (eventId, { attempts = 2 } = {}) => {
  const streamUrl = `${API_ROOT}/create_diet_plan/${encodeURIComponent(eventId)}`
  let lastError = null

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(streamUrl, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
        },
      })

      if (!response.ok) {
        throw new Error(`Diet plan stream failed with status ${response.status}`)
      }

      if (!response.body) {
        const fallbackText = await response.text()
        const parsed = parseSseData(fallbackText)

        if (parsed) {
          return parsed
        }

        throw new Error('The diet plan stream finished without a final response.')
      }
console.log(response.body)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let latestText = ''

      while (true) {
        const { value, done } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })

        const blocks = buffer.replace(/\r\n/g, '\n').split('\n\n')
        buffer = blocks.pop() ?? ''

        for (const block of blocks) {
          const { eventName, data } = parseSseBlock(block)
          const parsedText = parseSseData(data)

          if (parsedText) {
            latestText = parsedText
          }

          if (eventName === 'complete' && parsedText) {
            await reader.cancel().catch(() => {})
            return parsedText.trim()
          }
        }
      }

      if (buffer.trim()) {
        const { eventName, data } = parseSseBlock(buffer)
        const parsedText = parseSseData(data)

        if (parsedText) {
          latestText = parsedText
        }

        if (eventName === 'complete' && parsedText) {
          return parsedText.trim()
        }
      }

      if (latestText) {
        return latestText.trim()
      }

      throw new Error('The diet plan stream finished without a final response.')
    } catch (error) {
      lastError = error

      if (attempt < attempts) {
        await delay(700 * attempt)
      }
    }
  }

  throw lastError ?? new Error('Unable to generate the diet plan right now.')
}

export const generateDietPlan = async (payload) => {
  const response = await dietPlannerClient.post('/v2/create_diet_plan', payload)
  const eventId = response?.data?.event_id ?? response?.data?.data?.event_id

  if (!eventId) {
    throw new Error('The diet planner service did not return an event id.')
  }

  const planText = await readCompletionStream(eventId)
  console.log('Diet planner full response:', {
    requestPayload: payload,
    createResponse: response.data,
    eventId,
    planText,
  })

  return {
    eventId,
    planText,
    raw: response.data,
  }
}

export const getDietPlannerErrorMessage = (error) => {
  const responseData = error?.response?.data

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  if (responseData?.message) {
    return String(responseData.message)
  }

  if (responseData?.error) {
    return String(responseData.error)
  }

  if (responseData?.detail) {
    return String(responseData.detail)
  }

  if (error?.code === 'ECONNABORTED') {
    return 'The diet planner request timed out. Please try again.'
  }

  if (error?.name === 'AbortError') {
    return 'The diet plan request was cancelled.'
  }

  return error?.message || 'Unable to generate a personalized diet plan right now.'
}