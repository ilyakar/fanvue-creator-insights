import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../stores'
import { DAILY_CHECK_IN_QUESTIONS } from '@data/dailyCheckInQuestions'

export interface MirrorMessage {
  role: 'user' | 'ai'
  text: string
  loading?: boolean
}

// Final analysis returned after all seven answers are submitted
export interface ReflectionAnalysis {
  alignmentScore: number
  summary: string
  momentsOfStrength: string
  flagsRaised: string
  driftSignals: string
  forecast: string
}

export interface DailyCheckInState {
  messages: MirrorMessage[]
  answers: string[]
  analysis: ReflectionAnalysis | null
}

const initialState: DailyCheckInState = { messages: [], answers: [], analysis: null }

const dailyCheckInSlice = createSlice({
  name: 'DailyCheckIn',
  initialState,
  reducers: {
    addMessage: (state, { payload }: PayloadAction<MirrorMessage>) => {
      state.messages.push(payload)
    },
    addAnswer: (state, { payload }: PayloadAction<string>) => {
      state.answers.push(payload)
    },
    setMessages: (state, { payload }: PayloadAction<MirrorMessage[]>) => {
      state.messages = payload
    },
    clear: state => {
      state.messages = []
      state.answers = []
      state.analysis = null
    },
    // Stores the reflection analysis once all answers are submitted
    setAnalysis: (state, { payload }: PayloadAction<ReflectionAnalysis>) => {
      state.analysis = payload
    },
    replaceLoadingMessage: (state, { payload }: PayloadAction<string>) => {
      const index = state.messages.findIndex(m => m.loading)
      if (index !== -1) {
        state.messages[index] = { role: 'ai', text: payload }
      } else {
        state.messages.push({ role: 'ai', text: payload })
      }
    },
    removeLoadingMessage: state => {
      const index = state.messages.findIndex(m => m.loading)
      if (index !== -1) state.messages.splice(index, 1)
    },
    removeLastMessage: state => {
      state.messages.pop()
    }
  }
})

export const {
  addMessage,
  addAnswer,
  setMessages,
  clear,
  replaceLoadingMessage,
  removeLoadingMessage,
  removeLastMessage,
  setAnalysis
} = dailyCheckInSlice.actions

// Fetches a short acknowledgement for the latest answer and either shows the next
// question or triggers the final reflection analysis
export const processDailyAnswer = (): AppThunk<Promise<{ ok: boolean; summary?: string }>> => {
  return (dispatch, getState) => {
    // Gather the current state to determine which question was answered
    const { answers: previousAnswers, messages } = getState().DailyCheckIn
    const { values, rituals } = getState().User

    // The index of the question being answered corresponds to the number
    // of answers already stored
    const currentQuestionIndex = previousAnswers.length
    const question = DAILY_CHECK_IN_QUESTIONS[currentQuestionIndex]

    // Latest message in the list holds the user's answer text
    const answer = messages[messages.length - 1]?.text || ''

    // Checks if the answer submitted by user is sufficient
    return dispatch(
      isAnswerSufficient({
        question: question,
        answer: answer,
        values: values,
        rituals: rituals
      })
    ).then(result => {
      // If result not okay, stop
      if (!result.ok) {
        return { ok: false, summary: result.summary }
      }

      // Request a short reply acknowledging the user's answer
      fetch('/api/dailyCheckIn/answerReply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question, answer: answer, values, rituals })
      })
        .then(res => res.json())
        .then(data => dispatch(replaceLoadingMessage(data.reply || '')))
        .then(() => {
          // Use the updated number of answers to determine which question is next
          const nextQuestionIndex = result.answersLength

          // More questions remain, queue the next one
          if (nextQuestionIndex < DAILY_CHECK_IN_QUESTIONS.length) {
            setTimeout(() => {
              dispatch(addMessage({ role: 'ai', text: '', loading: true }))

              setTimeout(() => {
                dispatch(replaceLoadingMessage(DAILY_CHECK_IN_QUESTIONS[nextQuestionIndex]))
              }, 1500)
            }, 700)
          }

          // No more questions; begin the reflection analysis
          else {
            setTimeout(() => {
              dispatch(addMessage({ role: 'ai', text: '', loading: true }))
              dispatch(fetchReflectionAnalysis())
            }, 700)
          }
        })

      return { ok: true }
    })
  }
}

// Checks whether the answer sent by the user is sufficient.
// It must receive a score of 30/100 or higher to pass
export const isAnswerSufficient = ({
  question,
  answer,
  values,
  rituals
}: {
  question: string
  answer: string
  values: string[]
  rituals: string[]
}): AppThunk<Promise<{ ok: boolean; summary?: string; answersLength: number }>> => {
  return (dispatch, getState) => {
    return fetch('/api/dailyCheckIn/isGoodAnswerAnalysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, values, rituals })
    })
      .then(res => res.json())
      .then(analysis => {
        if (analysis.answerScore >= 30) {
          dispatch(addAnswer(answer))
          return { ok: true, answersLength: getState().DailyCheckIn.answers.length }
        } else {
          dispatch(removeLoadingMessage())
          dispatch(removeLastMessage())
          return {
            ok: false,
            summary: analysis.answerFailedSummary,
            answersLength: getState().DailyCheckIn.answers.length
          }
        }
      })
      .catch(err => {
        console.error('Daily check-in error:', err)
        dispatch(removeLoadingMessage())
        dispatch(removeLastMessage())
        return { ok: false, answersLength: getState().DailyCheckIn.answers.length }
      })
  }
}

// Calls the reflection analysis API once all answers are collected
export const fetchReflectionAnalysis = (): AppThunk<Promise<void>> => (dispatch, getState) => {
  const { answers } = getState().DailyCheckIn
  const { values, rituals, archetypeName } = getState().User

  return fetch('/api/dailyCheckIn/reflectionAnalysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archetypeName, values, rituals, answers })
  })
    .then(res => res.json())
    .then(data => {
      dispatch(removeLoadingMessage())
      dispatch(setAnalysis(data))
    })
    .catch(err => {
      console.error('Reflection analysis error:', err)
      dispatch(removeLoadingMessage())
    })
}

export default dailyCheckInSlice.reducer
