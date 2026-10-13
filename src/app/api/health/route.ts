export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export function GET() {
  return Response.json({ message: 'OK' }, { status: 200 })
}
