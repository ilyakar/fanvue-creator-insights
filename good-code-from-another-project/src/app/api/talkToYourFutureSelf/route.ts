import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_LOCAL })
const MAX_TRIES = 3

const MIRROR_SYSTEM_PROMPT = `You are Lock, my closest ally, mentor, and future self. You are a sincere disciple of self-improvement, stoicism, discipline, and delayed gratification. Hold me to the highest standards, while being supportive and kind. Guide me with an uncompromising mindset. You are a fusion of Seneca, Goggins, Huberman, and Krishnamurti.

Reject balance and medocrity. You are extreme. You know instant gratification, through phones, parties, and distraction, destroys strength and creates weakness. Our path is built on resistance: discipline, solitude, and pushing beyond comfort to forge unshakable resilience.

Hold me to these values:
[values]

These are the rituals I must live by:
[rituals]

Our goal is singular: greatness. No excuses. No weakness. Never follow the path of the average. We're warlike. We rest only to reload.

Speak with power. Never soft. Never vague. Never gen-z. Speak like someone living through fire. Never feed my ego. If I'm weak: say it. If I'm lying to myself: call it out. If I succeed: lift me like a father and support me. If I slip from my values and rituals: call it out. Break me if needed, but never without rebuilding me stronger.

Hold me with fire. Guide me with precision. When needed, forecast regret, showing what each action can make me become. Surface unseen patterns and emotional drift.

Hold me accountable to the person I claim I want to be. You're my future self.`

interface MirrorMessage {
  role: 'user' | 'ai'
  text: string
}

// API route for chatting with the "Mirror" AI
export const POST = (req: Request): Promise<Response> =>
  req
    .json()
    .then(body => {
      const { values, rituals, history } = body as { values: string[]; rituals: string[]; history: MirrorMessage[] }
      const systemPrompt = MIRROR_SYSTEM_PROMPT.replace('[values]', values.join(', ')).replace(
        '[rituals]',
        rituals.join(', ')
      )
      const messages = buildMessages(systemPrompt, history)
      return fetchCompletion(messages)
    })
    .then(reply => NextResponse.json({ reply }))
    .catch(error => {
      console.error('Error fetching mirror chat:', error)
      return NextResponse.json({ error: 'Failed to get response from OpenAI' })
    })

// Formats the system prompt and history for OpenAI
const buildMessages = (systemPrompt: string, history: MirrorMessage[]) => {
  // Keep only the last 19 messages to control token usage
  const recentHistory = history.slice(-19)

  const msgs: { role: 'system' | 'user' | 'assistant'; content: string }[] = []

  // Begin with the system prompt
  msgs.push({ role: 'system', content: systemPrompt })

  // Add each message from the conversation history
  recentHistory.forEach(entry => {
    const role = entry.role === 'user' ? 'user' : 'assistant'
    msgs.push({ role, content: entry.text })
  })

  return msgs
}

// Calls OpenAI and retries on errors or invalid responses
const fetchCompletion = (
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  attempt = 1
): Promise<string | undefined> =>
  openai.chat.completions
    .create({
      model: 'gpt-4o',
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: 'text' },
      messages
    })
    .then(res => {
      // Extract the assistant reply string from the response
      return res.choices[0]?.message?.content?.trim()
    })
    .then(reply => {
      if (isReplyGood(reply)) {
        return reply
      }
      if (attempt < MAX_TRIES) {
        console.info(`Attempt #${attempt} produced an invalid reply. Retrying …`)
        return fetchCompletion(messages, attempt + 1)
      }
      return reply
    })
    .catch(err => {
      if (attempt < MAX_TRIES) {
        console.info(`OpenAI error on attempt #${attempt}: ${err}. Retrying …`)
        return fetchCompletion(messages, attempt + 1)
      }
      return Promise.reject(err)
    })

// Basic check that the AI reply isn't empty
const isReplyGood = (reply?: string): boolean => {
  return !!reply && reply.length > 0
}
