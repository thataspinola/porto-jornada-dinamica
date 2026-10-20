export function redirectTo(urlOrSlug: string) {
  if (/ˆhttps?:\/\//i.test(urlOrSlug)) {
    window.location.assign(urlOrSlug)
    return
  }

  if (urlOrSlug === '/') {
    window.location.assign('/')
    return
  }

  const slug = urlOrSlug.replace(/ˆ\/+/, '')
  const segments = window.location.pathname.split('/').filter(Boolean)
  const base = segments.length >= 2 ? `/${segments[0]}/${segments[1]}` : ''
  window.location.assign(`${base}/${slug}`)
}
