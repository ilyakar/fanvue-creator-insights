import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { DAILY_CHECK_IN_QUESTIONS } from '@data/dailyCheckInQuestions'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_LOCAL })
const MAX_TRIES = 3

// API route that returns an analysis of the user's reflections
export const POST = (req: Request): Promise<Response> => {
  return req
    .json()
    .then(
      ({
        archetypeName,
        values,
        rituals,
        answers
      }: {
        archetypeName: string
        values: string[]
        rituals: string[]
        answers: string[]
      }) => {
        const prompt = buildPrompt(archetypeName, values, rituals, answers)
        return fetchCompletion(prompt)
      }
    )
    .then(validRawJson => {
      if (!validRawJson) {
        throw new Error('No valid json received from OpenAI')
      }
      const parsed = JSON.parse(validRawJson)
      return NextResponse.json(parsed)
    })
    .catch(error => {
      console.error('Got an error trying to work with OpenAI:', error)
      return NextResponse.json(error)
    })
}

// Assembles the prompt asking OpenAI to analyse seven reflection answers
const buildPrompt = (archetypeName: string, values: string[], rituals: string[], answers: string[]) => {
  console.log('Checking reflectionAnalysis 2.', {
    archetype: archetypeName,
    answers: answers,
    values: values,
    rituals: rituals
  })

  // Pair each question with its corresponding answer
  const questionAnswerPairs = answers
    .map((answer, index) => {
      const questionText = DAILY_CHECK_IN_QUESTIONS[index]
      return `${index + 1}. Question: ${questionText}
Answer: ${answer}`
    })
    .join('\n')

  // The final prompt submitted to OpenAI
  const prompt = `You are The Mirror, the user’s future self, forged through discipline and alignment.

Read their 7 answers. Then respond with:
- Give an honest Alignment Score (0–100) based on how closely they lived their values, rituals, and Archetype.
- A short feedback summary in a personal, direct tone (2 sentences max)
- Highlight moments of strength (2 sentences max)
- Flag any breaks in rituals or values, even implied (2 sentences max)
- Note drift signals like ego, distraction, or avoidance (2 sentences max)
- Forecast who they’d become if today repeated 90 times (2 sentences max)

Be clear. Be honest. No fluff.

Your response should be valid json in this format:
{
  "alignmentScore": number,
  "summary": string,
  "momentsOfStrength": string,
  "flagsRaised": string,
  "driftSignals": string,
  "forecast": string
}

The user's Archetype: ${archetypeName}
The user's values: ${values.join(', ')}
The user's rituals: ${rituals.join(', ')}

Answers:
----
${questionAnswerPairs}
`

  console.log('The full prompt we are sending to OpenAI for reflectionAnalysis:', {
    prompt: prompt
  })

  return prompt
}

// Calls OpenAI with retries until valid JSON is returned
const fetchCompletion = (prompt: string, attempt = 1): Promise<string | undefined> =>
  openai.chat.completions
    .create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    })
    // Gets the relevant data from OpenAi's response
    .then(response => response.choices[0]?.message?.content)
    // Cleans up the OpenAI response (sometimes includes ```json ... ``` wrappings, whitespaces, etc.
    .then(response =>
      response
        ?.trim()
        .replace(/^```json/, '')
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim()
    )
    // The cleaned and good chatGpt output
    .then(chatGptReply => {
      // If the ChatGPT reply is good
      if (isReplyGood(chatGptReply)) {
        return chatGptReply
      }

      // If the ChatGPT reply is bad
      // -----
      // We have more attempts, let's try to get another response
      if (attempt < MAX_TRIES) {
        console.info(`Attempt #${attempt} produced an invalid reply. Retrying …`)
        return fetchCompletion(prompt, attempt + 1)
      }
      // No more attempts left. We give up.
      else {
        console.info(`Attempt #${attempt} is the last try. Returning whatever we got.`)
        return chatGptReply // may be undefined or invalid JSON, but we give up
      }
    })
    // API error
    .catch(err => {
      // We still have attempts left, retry getting response
      if (attempt < MAX_TRIES) {
        console.info(`OpenAI error on attempt #${attempt}: ${err}. Retrying …`)
        return fetchCompletion(prompt, attempt + 1)
      }
      // No more attempts left. Give up
      return Promise.reject(err)
    })

// Validates that the OpenAI response includes all the required fields
const isReplyGood = (chatGptReply?: string): boolean => {
  if (!chatGptReply) return false

  try {
    const parsed = JSON.parse(chatGptReply)

    return (
      typeof parsed.alignmentScore === 'number' &&
      typeof parsed.summary === 'string' &&
      typeof parsed.momentsOfStrength === 'string' &&
      typeof parsed.flagsRaised === 'string' &&
      typeof parsed.driftSignals === 'string' &&
      typeof parsed.forecast === 'string'
    )
  } catch (err) {
    console.error('Failed to parse ChatGPT reply as JSON:', err)
    return false
  }
}
