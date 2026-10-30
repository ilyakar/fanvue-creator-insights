import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize the OpenAI client with your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_LOCAL })

// Route that accepts an uploaded audio blob and returns the text transcription
export const POST = (req: Request): Promise<Response> =>
  req
    .formData()
    .then<NextResponse>(data => {
      // grab the uploaded recording
      const fileBlob = data.get('file')

      // exit early if we didn't receive any audio
      if (!fileBlob || !(fileBlob instanceof Blob)) {
        return NextResponse.json({ error: 'No file received' })
      }

      // Recreate the File with a proper name so the OpenAI API accepts the format
      const file = new File([fileBlob], 'recording.webm', { type: 'audio/webm' })

      // request a transcription from OpenAI Whisper in English
      return openai.audio.transcriptions
        .create({
          file,
          model: 'whisper-1',
          language: 'en'
        })
        .then(transcription =>
          // return the text result back to the client
          NextResponse.json({ text: transcription.text })
        )
    })
    .catch(error => {
      // log and report any errors
      console.error('Transcription error:', error)
      return NextResponse.json({ error: 'Failed to transcribe audio' })
    }) as Promise<Response>
