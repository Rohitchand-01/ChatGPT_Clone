import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuth(req)
    console.log('Auth info:', auth)

    return NextResponse.json({ userId: auth.userId, sessionId: auth.sessionId }, { status: 200 })
  } catch (err) {
    console.error('[TEST AUTH ERROR]', err)
    return NextResponse.json({ error: 'Auth test failed' }, { status: 500 })
  }
}
