import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_LOCAL })
const MAX_TRIES = 3

export const POST = (req: Request): Promise<Response> =>
  req
    .json()
    .then(
      ({
        question,
        answer,
        values,
        rituals
      }: {
        question: string
        answer: string
        values: string[]
        rituals: string[]
      }) => {
        const prompt = buildPrompt(question, answer, values, rituals)
        return fetchCompletion(prompt)
      }
    )
    .then(reply => NextResponse.json({ reply }))
    .catch(error => {
      console.error('Daily answer reply error:', error)
      return NextResponse.json({ error: 'Failed to get response from OpenAI' })
    })

const buildPrompt = (question: string, answer: string, values: string[], rituals: string[]) => {
  return `You are a supportive assistant for a self-reflection app. The user just answered a daily check-in question.
Provide a short, one sentence acknowledgement of the answer.

The user's values are: ${values.join(', ')}.
The user's rituals are: ${rituals.join(', ')}.

Question: ${question}
Answer: ${answer}`
}

const fetchCompletion = (prompt: string, attempt = 1): Promise<string | undefined> =>
  openai.chat.completions
    .create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    })
    .then(res => res.choices[0]?.message?.content?.trim())
    .then(reply => {
      if (reply && reply.length > 0) {
        return reply
      }
      if (attempt < MAX_TRIES) {
        console.info(`Attempt #${attempt} produced an invalid reply. Retrying …`)
        return fetchCompletion(prompt, attempt + 1)
      }
      return reply
    })
    .catch(err => {
      if (attempt < MAX_TRIES) {
        console.info(`OpenAI error on attempt #${attempt}: ${err}. Retrying …`)
        return fetchCompletion(prompt, attempt + 1)
      }
      return Promise.reject(err)
    })
