import { useCallback, useEffect, useRef, useState } from 'react'

const LANGUAGE_ORDER = [ 'en-US','bn-BD']

const getSpeechRecognitionConstructor = () => {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(() => Boolean(getSpeechRecognitionConstructor()))

  const recognitionRef = useRef(null)
  const languageIndexRef = useRef(0)
  const finalTranscriptRef = useRef('')
  const manualStopRef = useRef(false)
  const isListeningRef = useRef(false)
  const onPermissionDeniedRef = useRef(null)
  const onErrorRef = useRef(null)
  const retryTimerRef = useRef(null)
  const startWithLanguageRef = useRef(null)

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
  }, [])

  const cleanupRecognition = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    recognition.onstart = null
    recognition.onresult = null
    recognition.onerror = null
    recognition.onend = null

    try {
      recognition.abort()
    } catch {
      try {
        recognition.stop()
      } catch {
        // Recognition may already be stopped.
      }
    }

    recognitionRef.current = null
  }, [])

  const buildRecognition = useCallback((language) => {
    const SpeechRecognition = getSpeechRecognitionConstructor()
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.lang = language

    return recognition
  }, [])

  const finishListening = useCallback(
    (nextTranscript = '') => {
      clearRetryTimer()
      isListeningRef.current = false
      setListening(false)
      setTranscript(nextTranscript)
      cleanupRecognition()
    },
    [cleanupRecognition, clearRetryTimer]
  )

  const scheduleLanguageRetry = useCallback(
    (nextLanguageIndex) => {
      clearRetryTimer()
      finalTranscriptRef.current = ''
      setTranscript('')

      retryTimerRef.current = window.setTimeout(() => {
        retryTimerRef.current = null
        if (!manualStopRef.current) {
          startWithLanguageRef.current?.(nextLanguageIndex)
        }
      }, 120)
    },
    [clearRetryTimer]
  )

  const startWithLanguage = useCallback(
    (languageIndex) => {
      const language = LANGUAGE_ORDER[languageIndex]
      if (!language) {
        finishListening(`${finalTranscriptRef.current}`.trim())
        return
      }

      languageIndexRef.current = languageIndex
      cleanupRecognition()

      const recognition = buildRecognition(language)
      if (!recognition) {
        setSupported(false)
        finishListening('')
        onErrorRef.current?.('unsupported')
        return
      }

      recognitionRef.current = recognition

      recognition.onstart = () => {
        isListeningRef.current = true
        setListening(true)
      }

      recognition.onresult = (event) => {
        let interimText = ''

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index]
          const spokenText = result?.[0]?.transcript ?? ''

          if (result.isFinal) {
            finalTranscriptRef.current = `${finalTranscriptRef.current}${spokenText}`
          } else {
            interimText += spokenText
          }
        }

        setTranscript(`${finalTranscriptRef.current}${interimText}`.trim())
      }

      recognition.onerror = (event) => {
        const errorCode = event?.error ?? 'unknown'

        if (errorCode === 'not-allowed' || errorCode === 'service-not-allowed') {
          manualStopRef.current = true
          onPermissionDeniedRef.current?.()
          finishListening('')
          return
        }

        if (errorCode === 'aborted') {
          return
        }

        const shouldRetry =
          languageIndexRef.current === 0 &&
          !manualStopRef.current &&
          ['no-speech', 'language-not-supported', 'network', 'audio-capture'].includes(errorCode)

        if (shouldRetry) {
          scheduleLanguageRetry(1)
          return
        }

        finishListening(`${finalTranscriptRef.current}`.trim())
        onErrorRef.current?.(errorCode)
      }

      recognition.onend = () => {
        if (manualStopRef.current) {
          finishListening(`${finalTranscriptRef.current}`.trim())
          return
        }

        const capturedText = `${finalTranscriptRef.current}`.trim()

        if (!capturedText && languageIndexRef.current === 0) {
          scheduleLanguageRetry(1)
          return
        }

        finishListening(capturedText)
      }

      try {
        recognition.start()
      } catch {
        if (languageIndexRef.current === 0 && !manualStopRef.current) {
          scheduleLanguageRetry(1)
          return
        }

        finishListening('')
        onErrorRef.current?.('start-failed')
      }
    },
    [buildRecognition, cleanupRecognition, finishListening, scheduleLanguageRetry]
  )

  startWithLanguageRef.current = startWithLanguage

  const startListening = useCallback(
    ({ onPermissionDenied, onError } = {}) => {
      onPermissionDeniedRef.current = onPermissionDenied ?? null
      onErrorRef.current = onError ?? null

      const SpeechRecognition = getSpeechRecognitionConstructor()
      if (!SpeechRecognition) {
        setSupported(false)
        onError?.('unsupported')
        return
      }

      if (isListeningRef.current) {
        return
      }

      manualStopRef.current = false
      finalTranscriptRef.current = ''
      languageIndexRef.current = 0
      setTranscript('')
      clearRetryTimer()

      startWithLanguage(0)
    },
    [clearRetryTimer, startWithLanguage]
  )

  const stopListening = useCallback(() => {
    manualStopRef.current = true
    clearRetryTimer()

    const capturedText = `${finalTranscriptRef.current}`.trim()
    finishListening(capturedText)
  }, [clearRetryTimer, finishListening])

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = ''
    setTranscript('')
  }, [])

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognitionConstructor()))

    return () => {
      manualStopRef.current = true
      clearRetryTimer()
      cleanupRecognition()
    }
  }, [cleanupRecognition, clearRetryTimer])

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    supported,
  }
}

export default useSpeechRecognition
