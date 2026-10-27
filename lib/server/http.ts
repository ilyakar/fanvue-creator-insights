/* ------------------------------------------------------------
Rejects cross-origin mutations before reading or changing private records.
---------------------------------------------------------------*/

import { NextResponse } from 'next/server'

import { getAppOrigin } from './config'

export class RequestError extends Error {
  status: number

  // Carries an intentional public message and the matching HTTP status.
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Rejects cross-origin mutations before reading or changing private records.
export const requireSameOrigin = (request: Request) => {
  if (request.headers.get('origin') !== getAppOrigin()) {
    throw new RequestError('Please submit this action from the app.', 403)
  }
}

// Returns controlled errors without leaking provider responses, prompts or secrets.
export const errorResponse = (error: unknown) =>
  NextResponse.json(
    {
      error: error instanceof RequestError ? error.message : 'Something went wrong. Please try again.'
    },
    { status: error instanceof RequestError ? error.status : 500, headers: { 'Cache-Control': 'no-store' } }
  )
