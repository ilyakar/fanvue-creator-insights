import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../stores'

export interface MirrorMessage {
  role: 'user' | 'ai'
  text: string
  loading?: boolean
}

export interface MirrorState {
  messages: MirrorMessage[]
}

const initialState: MirrorState = { messages: [] }

// Redux slice storing mirror chat messages
const mirrorSlice = createSlice({
  name: 'Mirror',
  initialState,
  reducers: {
    // Adds a new chat message to the log
    addMessage: (state, { payload }: PayloadAction<MirrorMessage>) => {
      state.messages.push(payload)
    },
    // Replaces all chat messages at once
    setMessages: (state, { payload }: PayloadAction<MirrorMessage[]>) => {
      state.messages = payload
    },
    // Clears the chat history
    clearMessages: state => {
      state.messages = []
    },
    // Replaces the temporary loading message with the AI response
    replaceLoadingMessage: (state, { payload }: PayloadAction<string>) => {
      const index = state.messages.findIndex(message => message.loading)
      if (index !== -1) {
        state.messages[index] = { role: 'ai', text: payload }
      } else {
        state.messages.push({ role: 'ai', text: payload })
      }
    },
    // Removes the temporary loading message without adding a reply
    removeLoadingMessage: state => {
      const index = state.messages.findIndex(message => message.loading)
      if (index !== -1) {
        state.messages.splice(index, 1)
      }
    },
    // Removes the user's last message (used when answer quality is too low)
    removeLastMessage: state => {
      if (state.messages.length > 0) {
        state.messages.pop()
      }
    }
  }
})

export const {
  addMessage,
  setMessages,
  clearMessages,
  replaceLoadingMessage,
  removeLoadingMessage,
  removeLastMessage
} = mirrorSlice.actions

// Sends conversation history to the API and stores the AI's reply
export const fetchMirrorReply = (): AppThunk<Promise<{ ok: boolean }>> => (dispatch, getState) => {
  const history = getState().Mirror.messages.filter(m => !m.loading)
  const { values, rituals } = getState().User

  return fetch('/api/talkToYourFutureSelf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values, rituals, history })
  })
    .then(res => res.json())
    .then(data => {
      if (data.reply) {
        // replace loading placeholder with the AI's actual reply
        dispatch(replaceLoadingMessage(data.reply))
      }
      return { ok: true }
    })
    .catch(error => {
      console.error('Mirror chat error:', error)
      // also clean up any placeholder or user message on error
      dispatch(removeLoadingMessage())
      dispatch(removeLastMessage())
      return { ok: false }
    })
}

export default mirrorSlice.reducer
