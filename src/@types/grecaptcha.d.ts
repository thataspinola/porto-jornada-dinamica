declare global {
  namespace ReCaptchaV3 {
    interface ReCaptchaInstance {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
