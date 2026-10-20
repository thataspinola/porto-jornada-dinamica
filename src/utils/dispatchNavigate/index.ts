export const NAVIGATE_EVENT = 'app:navigate'

export function dispatchNavigate() {
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
}
