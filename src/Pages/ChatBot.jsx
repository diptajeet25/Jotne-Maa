import { useContext, useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import {
  Bot,
  LoaderCircle,
  SendHorizonal,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Home/Footer'
import useAxiosSecure from '../Hooks/useAxiosSecure'
import { AuthContext } from '../Context/AuthContext'

const getWelcomeText = (displayName) => `Hello${displayName ? ` ${displayName}` : ''}! I'm your AI maternal healthcare assistant 💗`

const buildInitialMessages = (displayName) => [
  {
    id: 'welcome-ai-message',
    role: 'assistant',
    text: getWelcomeText(displayName),
  },
]

const MarkdownMessage = ({ children }) => (
  <div className="space-y-3 text-sm leading-8 text-slate-700">
    <ReactMarkdown
      components={{
        h2: (props) => (
          <h2 className="mt-4 mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-pink-600 first:mt-0" {...props} />
        ),
        p: (props) => <p className="mb-3 leading-8 text-slate-700 last:mb-0" {...props} />,
        li: (props) => (
          <li className="mb-2 ml-5 list-disc leading-8 text-slate-700 marker:text-pink-400" {...props} />
        ),
        strong: (props) => <strong className="font-semibold text-slate-950" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
)

const ChatBot = () => {
  const axiosSecure = useAxiosSecure()
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState(() => buildInitialMessages(user?.displayName))
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef(null)
  const latestMessageRef = useRef(null)

  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      const response = await axiosSecure.post('/chatbot', { message })
      return response.data
    },
  })

  useEffect(() => {
    if (!chatContainerRef.current || !latestMessageRef.current) {
      return
    }

    const container = chatContainerRef.current
    const latestMessage = latestMessageRef.current
    const targetTop = latestMessage.offsetTop + latestMessage.offsetHeight - container.clientHeight

    container.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    })
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleSend()
  }

  const handleSend = async () => {
    const trimmed = input.trim()

    if (!trimmed || loading) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const data = await sendMessageMutation.mutateAsync(trimmed)
      const aiReply = (data?.reply ?? '').trim() || 'I am here to support you. Please try again in a moment.'

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: aiReply,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I could not reach the care assistant right now. Please try again shortly.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleInputKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.45),transparent_28%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.35),transparent_28%),linear-gradient(180deg,#fff8fd_0%,#ffffff_100%)] text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
          <div className="pointer-events-none absolute -left-10 -top-8 h-36 w-36 rounded-full bg-pink-200/45 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full bg-violet-200/45 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5">
            <header className="rounded-[26px] border border-white/70 bg-white/85 p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-violet-500 text-white shadow-[0_12px_26px_rgba(236,72,153,0.25)]">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">AI Maternal Assistant</p>
                    <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Care Chat Support</h1>
                    <p className="mt-1 text-sm text-slate-500">Ask pregnancy care, wellness, and support questions any time.</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Session
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
                <Sparkles className="h-4 w-4" />
                Real-time AI Guidance
              </div>
            </header>

            <div className="rounded-[26px] border border-white/75 bg-white/85 p-3 shadow-sm sm:p-4">
              <div ref={chatContainerRef} className="h-screen overflow-y-auto rounded-[20px] bg-[linear-gradient(180deg,#fffafd_0%,#ffffff_100%)] p-3 sm:h-[82vh] lg:h-[88vh] sm:p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isUser = message.role === 'user'

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 transition-all duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 shadow-sm">
                            <Bot className="h-4 w-4" />
                          </div>
                        ) : null}

                        <div
                          className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[75%] ${
                            isUser
                              ? 'rounded-br-md bg-linear-to-r from-pink-500 to-violet-500 text-white'
                              : 'rounded-bl-md border border-pink-100 bg-white text-slate-700'
                          }`}
                        >
                          {isUser ? message.text : <MarkdownMessage>{message.text}</MarkdownMessage>}
                        </div>

                        {isUser ? (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-sm">
                            <UserRound className="h-4 w-4" />
                          </div>
                        ) : null}
                      </div>
                    )
                  })}

                  {loading ? (
                    <div className="flex items-end gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 shadow-sm">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-pink-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                        <LoaderCircle className="h-4 w-4 animate-spin text-pink-500" />
                        <span>Typing...</span>
                      </div>
                    </div>
                  ) : null}

                  <div ref={latestMessageRef} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-3 rounded-[20px] border border-pink-100 bg-white p-2 shadow-sm sm:p-3">
                <div className="flex items-end gap-2 sm:gap-3">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    rows={1}
                    placeholder="Ask anything about maternal health, pregnancy care, or emotional wellness..."
                    className="min-h-13 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-300 focus:bg-white"
                  />

                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-pink-500 to-violet-500 text-white shadow-[0_14px_28px_rgba(236,72,153,0.20)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Send message"
                  >
                    {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ChatBot
