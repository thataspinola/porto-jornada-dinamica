// As respostas do backend seguem o envelope { data, metadata }; consumimos só o "data"
export function unwrapApiEnvelope(response: unknown): unknown {
  if (
    response &&
    typeof response === 'object' &&
    'data' in (response as Record<string, unknown>)
  ) {
    return (response as { data: unknown }).data
  }

  return response
}
